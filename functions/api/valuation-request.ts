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
      // Comma-separated list, so a lead still lands in a backup inbox if one recipient bounces.
      to: env.LEAD_NOTIFY_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
      ...(body.email ? { reply_to: body.email } : {}),
      subject: `${kind}: ${body.name || 'proprietario'} — ${body.zone || 'zona non specificata'}`,
      html: buildEmailHtml(body),
    }),
  });
  if (!res.ok) console.error('[valuation-request] Resend error', res.status, await res.text());
}

const CONFIRMATION = {
  it: {
    subject: 'Abbiamo ricevuto la tua richiesta — Herocasa',
    hello: (n: string) => `Ciao${n ? ` ${n}` : ''},`,
    received: (z: string) => `grazie per averci scritto. Abbiamo ricevuto la tua richiesta${z ? ` per l'immobile a <strong>${z}</strong>` : ''}.`,
    next: (p: string) =>
      p ? `Ti chiameremo entro 48 ore al numero che ci hai lasciato (<strong>${p}</strong>).` : 'Ti ricontatteremo entro 48 ore.',
    sooner: 'Se preferisci sentirci prima, scrivici su WhatsApp o chiamaci:',
    whatsapp: 'Scrivici su WhatsApp',
    signoff: 'A presto,<br>il team Herocasa',
    footer: 'Hai ricevuto questa email perché hai compilato un modulo su herocasa.it.',
    waText: 'Ciao, ho appena compilato il modulo sul sito Herocasa',
  },
  en: {
    subject: 'We received your request — Herocasa',
    hello: (n: string) => `Hi${n ? ` ${n}` : ''},`,
    received: (z: string) => `thanks for getting in touch. We have received your request${z ? ` for your property in <strong>${z}</strong>` : ''}.`,
    next: (p: string) =>
      p ? `We will call you within 48 hours on the number you gave us (<strong>${p}</strong>).` : 'We will get back to you within 48 hours.',
    sooner: 'If you would like to talk sooner, message us on WhatsApp or call us:',
    whatsapp: 'Message us on WhatsApp',
    signoff: 'Speak soon,<br>the Herocasa team',
    footer: 'You received this email because you filled in a form on herocasa.it.',
    waText: 'Hi, I just filled in the form on the Herocasa website',
  },
  de: {
    subject: 'Wir haben Ihre Anfrage erhalten — Herocasa',
    hello: (n: string) => `Guten Tag${n ? ` ${n}` : ''},`,
    received: (z: string) => `vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage${z ? ` für Ihre Immobilie in <strong>${z}</strong>` : ''} erhalten.`,
    next: (p: string) =>
      p ? `Wir rufen Sie innerhalb von 48 Stunden unter der angegebenen Nummer an (<strong>${p}</strong>).` : 'Wir melden uns innerhalb von 48 Stunden bei Ihnen.',
    sooner: 'Wenn Sie früher mit uns sprechen möchten, schreiben Sie uns auf WhatsApp oder rufen Sie uns an:',
    whatsapp: 'Auf WhatsApp schreiben',
    signoff: 'Bis bald,<br>Ihr Herocasa-Team',
    footer: 'Sie erhalten diese E-Mail, weil Sie ein Formular auf herocasa.it ausgefüllt haben.',
    waText: 'Hallo, ich habe gerade das Formular auf der Herocasa-Website ausgefüllt',
  },
} as const;

/** Confirmation to the owner: they know the request arrived and how to reach us sooner. */
async function sendOwnerConfirmation(body: ValuationBody, env: Env): Promise<void> {
  if (!env.RESEND_API_KEY || !body.email) return;
  const c = CONFIRMATION[(body.locale as keyof typeof CONFIRMATION) ?? 'it'] ?? CONFIRMATION.it;
  const firstName = escapeHtml((body.name || '').trim().split(/\s+/)[0] || '');
  const zone = body.zone ? escapeHtml(body.zone) : '';
  const phone = body.phone ? escapeHtml(body.phone) : '';
  const wa = `https://wa.me/393663695252?text=${encodeURIComponent(c.waText)}`;
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#F6F1E4;color:#1E4D42">
  <p style="font-size:20px;margin:0 0 16px">${c.hello(firstName)}</p>
  <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;margin:0 0 12px">${c.received(zone)}</p>
  <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;margin:0 0 20px">${c.next(phone)}</p>
  <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;margin:0 0 12px">${c.sooner}</p>
  <p style="margin:0 0 8px"><a href="${wa}" style="display:inline-block;background:#B8925A;color:#F6F1E4;font-family:Arial,sans-serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;padding:12px 20px">${c.whatsapp}</a></p>
  <p style="font-family:Arial,sans-serif;font-size:14px;margin:0 0 24px">+39 366 369 5252 · <a href="mailto:info@herocasa.it" style="color:#8B6F44">info@herocasa.it</a></p>
  <p style="font-size:16px;margin:0 0 28px">${c.signoff}</p>
  <p style="font-family:Arial,sans-serif;font-size:11px;color:#6B6A5C;margin:0">${c.footer}</p>
</div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>',
      to: [body.email],
      reply_to: 'info@herocasa.it',
      subject: c.subject,
      html,
    }),
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
  // Phone is what the forms require (we call back); email is optional.
  if (!body.phone && !body.email) return json({ ok: false, error: 'missing_contact' }, 400);

  console.log('[valuation-request]', { at: new Date().toISOString(), ...body });

  const results = await Promise.allSettled([
    sendLeadEmail(body, env),
    sendOwnerConfirmation(body, env),
    sendMetaConversionEvent(body, request, env),
  ]);
  for (const r of results) if (r.status === 'rejected') console.error('[valuation-request]', r.reason);

  return json({ ok: true });
};
