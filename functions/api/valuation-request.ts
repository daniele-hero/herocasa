/**
 * POST /api/valuation-request — Cloudflare Pages Function.
 *
 * Receives leads from the Hero form, the Estimator section and the
 * call-booking form (distinguished by `source`), emails them to the
 * Herocasa inbox via Resend, sends the owner a confirmation in their
 * language when they left an email, and — only with marketing-cookie
 * consent — reports the same Lead event to Meta's Conversions API
 * (deduplicated against the browser pixel via eventId).
 *
 * Env vars (Cloudflare Pages → Settings → Variables and Secrets):
 * RESEND_API_KEY, LEAD_NOTIFY_EMAIL (one or more, comma-separated), RESEND_FROM_EMAIL (optional),
 * META_CONVERSIONS_API_TOKEN, META_PIXEL_ID (optional). Each integration is
 * skipped independently when its vars are missing.
 */

import { FOLLOWUP_DAYS, confirmationEmail, emailLocale, followUpEmail } from '../../emails/owner-emails';

interface Env {
  RESEND_API_KEY?: string;
  LEAD_NOTIFY_EMAIL?: string;
  RESEND_FROM_EMAIL?: string;
  META_CONVERSIONS_API_TOKEN?: string;
  META_PIXEL_ID?: string;
}

type ValuationBody = {
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  zone?: string;
  type?: string;
  rooms?: string | number;
  features?: string[];
  notes?: string;
  estimatedRange?: { min: number; max: number };
  submittedAt?: string;
  eventId?: string;
  locale?: string;
  marketingConsent?: boolean;
  /** Path + query of the page the form was sent from (utm_* tags included). */
  page?: string;
  referrer?: string;
};

/** Where the lead came from, for the team email: page, referring site, utm_campaign. */
function attribution(body: ValuationBody): { page: string; from: string; campaign: string } {
  const page = typeof body.page === 'string' && body.page.startsWith('/') ? body.page.slice(0, 300) : '';
  let from = 'accesso diretto';
  try {
    if (body.referrer) from = new URL(body.referrer).hostname.replace(/^www\./, '');
  } catch {
    // Malformed referrer: keep the default.
  }
  let campaign = '';
  try {
    campaign = new URL(page || '/', 'https://herocasa.it').searchParams.get('utm_campaign')?.slice(0, 100) ?? '';
  } catch {
    // Malformed page: no campaign.
  }
  return { page, from, campaign };
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Digits-only phone, Italian prefix added when missing (the forms have no country selector). */
function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('39') || digits.length <= 6 ? digits : `39${digits}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function buildEmailHtml(body: ValuationBody): string {
  const src = attribution(body);
  const rows: Array<[string, string]> = [
    ['Provenienza', body.source || '—'],
    ...(src.campaign ? ([['Campagna', src.campaign]] as Array<[string, string]>) : []),
    ['Pagina', src.page || '—'],
    ['Arrivato da', src.from],
    ['Nome', body.name || '—'],
    ['Email', body.email || '—'],
    ['Telefono', body.phone || '—'],
    ['Comune', body.zone || '—'],
    ['Tipo immobile', body.type || '—'],
    ['Camere', String(body.rooms || '—')],
    ['Dotazioni', (body.features ?? []).join(', ') || '—'],
    ['Note', body.notes || '—'],
    ['Stima mostrata', body.estimatedRange ? `fino a €${body.estimatedRange.max.toLocaleString('it-IT')}/anno` : '—'],
    ['Ricevuto il', body.submittedAt ?? new Date().toISOString()],
  ];
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#6b6b63;font-size:13px;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 12px;font-size:14px">${escapeHtml(value)}</td></tr>`
    )
    .join('');
  return `<table cellpadding="0" cellspacing="0" style="font-family:sans-serif;border-collapse:collapse">${rowsHtml}</table>`;
}

/** Team notification; true when Resend accepted it. Without it the lead would only exist in the logs. */
async function sendLeadEmail(body: ValuationBody, env: Env, followUps: string[]): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.LEAD_NOTIFY_EMAIL) {
    console.warn('[valuation-request] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set — no notification sent');
    return false;
  }
  const kind = body.source === 'call-booking-form' ? 'Richiesta chiamata' : 'Nuovo lead';
  // resendCall retries on 429: the follow-ups were just created and the free plan allows ~2 requests/second.
  const res = await resendCall(env, '/emails', {
    from: env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>',
    // Comma-separated list, so a lead still lands in a backup inbox if one recipient bounces.
    to: env.LEAD_NOTIFY_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
    ...(body.email ? { reply_to: body.email } : {}),
    subject: `${kind}: ${body.name || 'proprietario'} — ${body.zone || 'zona non specificata'}`,
    html:
      buildEmailHtml(body) +
      (followUps.length
        ? `<p style="font-family:sans-serif;font-size:13px;margin-top:20px;color:#6b6b63">Al proprietario partiranno ${followUps.length} email di follow-up nei prossimi giorni. Se diventa cliente o non è interessato: <a href="${await stopLink(followUps, 'it', env)}">ferma i follow-up</a>.</p>`
        : ''),
  });
  if (!res.ok) console.error('[valuation-request] Resend error', res.status, await res.text());
  return res.ok;
}

const SITE = 'https://herocasa.it';

/** Resend REST call; retries on 429 (free plan allows ~2 requests/second). */
async function resendCall(env: Env, path: string, payload?: unknown): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.resend.com${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    if (res.status !== 429 || attempt >= 3) return res;
    const wait = Number(res.headers.get('retry-after')) * 1000 || 700;
    await new Promise((r) => setTimeout(r, wait));
  }
}

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Signed link that cancels the given scheduled follow-ups (verified in functions/api/followup-stop.ts). */
async function stopLink(ids: string[], locale: string, env: Env): Promise<string> {
  const joined = ids.join(',');
  const sig = await hmacHex(`followup:${env.RESEND_API_KEY}`, joined);
  return `${SITE}/api/followup-stop?ids=${encodeURIComponent(joined)}&l=${locale}&sig=${sig}`;
}

/** 10:00 Rome time (≈08:00 UTC) `days` from now. */
function sendDate(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  d.setUTCHours(8, 0, 0, 0);
  return d.toISOString();
}

/**
 * Schedules the nurture emails for an owner who left an email and returns their
 * Resend ids (chronological). Created last-first so each email can carry a stop
 * link for the ones after it.
 */
async function scheduleFollowUps(body: ValuationBody, env: Env): Promise<string[]> {
  if (!env.RESEND_API_KEY || !body.email) return [];
  const locale = emailLocale(body.locale);
  const later: string[] = [];
  for (let i = FOLLOWUP_DAYS.length - 1; i >= 0; i--) {
    const day = FOLLOWUP_DAYS[i];
    const stop = later.length ? await stopLink(later, locale, env) : undefined;
    const { subject, html } = followUpEmail(i, body, stop);
    const res = await resendCall(env, '/emails', {
      from: env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>',
      to: [body.email],
      reply_to: 'info@herocasa.it',
      subject,
      html,
      scheduled_at: sendDate(day),
    });
    if (!res.ok) {
      console.error('[valuation-request] follow-up scheduling error', res.status, await res.text());
      return [];
    }
    const { id } = (await res.json()) as { id: string };
    later.unshift(id);
  }
  return later;
}

/** Confirmation to the owner: recap, next steps, how to reach us sooner (emails/owner-emails.ts). */
async function sendOwnerConfirmation(body: ValuationBody, env: Env, followUps: string[]): Promise<void> {
  if (!env.RESEND_API_KEY || !body.email) return;
  const stop = followUps.length ? await stopLink(followUps, emailLocale(body.locale), env) : undefined;
  const { subject, html } = confirmationEmail(body, stop);
  const res = await resendCall(env, '/emails', {
    from: env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>',
    to: [body.email],
    reply_to: 'info@herocasa.it',
    subject,
    html,
  });
  if (!res.ok) console.error('[valuation-request] owner confirmation error', res.status, await res.text());
}

async function sendMetaConversionEvent(body: ValuationBody, request: Request, env: Env): Promise<void> {
  // No marketing-cookie consent → the lead is not shared with Meta at all.
  if (!env.META_CONVERSIONS_API_TOKEN || !body.eventId || body.marketingConsent !== true) return;
  const pixelId = env.META_PIXEL_ID || '2304401749914019';

  const userData: Record<string, unknown> = {};
  if (body.email) userData.em = [await sha256(body.email)];
  if (body.phone) userData.ph = [await sha256(normalizePhone(body.phone))];
  const ip = request.headers.get('CF-Connecting-IP');
  const userAgent = request.headers.get('User-Agent');
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;

  const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${env.META_CONVERSIONS_API_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.eventId,
          event_source_url: `https://herocasa.it${attribution(body).page.split('?')[0] || '/'}`,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            content_category: body.source,
            content_name: 'Valutazione immobile',
            ...(body.zone ? { zone: body.zone } : {}),
          },
        },
      ],
    }),
  });
  if (!res.ok) console.error('[valuation-request] Meta Conversions API error', res.status, await res.text());
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  let body: ValuationBody;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  // Phone is what the forms require (we call back); email is optional.
  if (!body.phone && !body.email) return json({ ok: false, error: 'missing_contact' }, 400);

  console.log('[valuation-request]', { at: new Date().toISOString(), ...body });

  // Follow-ups first: the notification and confirmation emails carry their stop links.
  const followUps = await scheduleFollowUps(body, env).catch((e) => {
    console.error('[valuation-request] follow-ups failed', e);
    return [] as string[];
  });
  const results = await Promise.allSettled([
    sendLeadEmail(body, env, followUps),
    sendOwnerConfirmation(body, env, followUps),
    sendMetaConversionEvent(body, request, env),
  ]);
  for (const r of results) if (r.status === 'rejected') console.error('[valuation-request]', r.reason);

  // The team never heard of this lead: tell the form, which then offers WhatsApp with the details pre-written.
  const notified = results[0].status === 'fulfilled' && results[0].value === true;
  if (!notified) return json({ ok: false, error: 'notify_failed' }, 502);
  return json({ ok: true });
};
