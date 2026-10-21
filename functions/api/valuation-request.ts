/**
 * POST /api/valuation-request — Cloudflare Pages Function.
 *
 * Receives leads from the Hero form, the Estimator section and the
 * call-booking form (distinguished by `source`), emails them to the
 * Herocasa inbox via Resend and reports the same Lead event to Meta's
 * Conversions API (deduplicated against the browser pixel via eventId).
 *
 * Env vars (Cloudflare Pages → Settings → Variables and Secrets):
 * RESEND_API_KEY, LEAD_NOTIFY_EMAIL, RESEND_FROM_EMAIL (optional),
 * META_CONVERSIONS_API_TOKEN, META_PIXEL_ID (optional). Each integration is
 * skipped independently when its vars are missing.
 */

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
};

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
  const rows: Array<[string, string]> = [
    ['Provenienza', body.source || '—'],
    ['Nome', body.name || '—'],
    ['Email', body.email || '—'],
    ['Telefono', body.phone || '—'],
    ['Comune', body.zone || '—'],
    ['Tipo immobile', body.type || '—'],
    ['Camere', String(body.rooms || '—')],
    ['Dotazioni', (body.features ?? []).join(', ') || '—'],
    ['Note', body.notes || '—'],
    ['Stima mostrata', body.estimatedRange ? `€${body.estimatedRange.min.toLocaleString('it-IT')} – €${body.estimatedRange.max.toLocaleString('it-IT')}` : '—'],
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

async function sendLeadEmail(body: ValuationBody, env: Env): Promise<void> {
  if (!env.RESEND_API_KEY || !env.LEAD_NOTIFY_EMAIL) {
    console.warn('[valuation-request] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set — no notification sent');
    return;
  }
  const kind = body.source === 'call-booking-form' ? 'Richiesta chiamata' : 'Nuovo lead';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>',
      to: env.LEAD_NOTIFY_EMAIL,
      reply_to: body.email,
      subject: `${kind}: ${body.name || 'proprietario'} — ${body.zone || 'zona non specificata'}`,
      html: buildEmailHtml(body),
    }),
  });
  if (!res.ok) console.error('[valuation-request] Resend error', res.status, await res.text());
}

async function sendMetaConversionEvent(body: ValuationBody, request: Request, env: Env): Promise<void> {
  if (!env.META_CONVERSIONS_API_TOKEN || !body.eventId) return;
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
          event_source_url: 'https://herocasa.it/',
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
  if (!body.email) return json({ ok: false, error: 'missing_email' }, 400);

  console.log('[valuation-request]', { at: new Date().toISOString(), ...body });

  const results = await Promise.allSettled([sendLeadEmail(body, env), sendMetaConversionEvent(body, request, env)]);
  for (const r of results) if (r.status === 'rejected') console.error('[valuation-request]', r.reason);

  return json({ ok: true });
};
