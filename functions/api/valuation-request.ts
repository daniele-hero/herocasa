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

async function sendLeadEmail(body: ValuationBody, env: Env, followUps: string[]): Promise<void> {
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
      html:
        buildEmailHtml(body) +
        (followUps.length
          ? `<p style="font-family:sans-serif;font-size:13px;margin-top:20px;color:#6b6b63">Al proprietario partiranno ${followUps.length} email di follow-up nei prossimi giorni. Se diventa cliente o non è interessato: <a href="${await stopLink(followUps, 'it', env)}">ferma i follow-up</a>.</p>`
          : ''),
    }),
  });
  if (!res.ok) console.error('[valuation-request] Resend error', res.status, await res.text());
}

const SITE = 'https://herocasa.it';
const WA = 'https://wa.me/393663695252';

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

type FollowUp = { day: number; subject: (name: string) => string; body: (name: string, zone: string) => string };

const p = (t: string) => `<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;margin:0 0 14px">${t}</p>`;
const btn = (href: string, label: string) =>
  `<p style="margin:6px 0 18px"><a href="${href}" style="display:inline-block;background:#B8925A;color:#F6F1E4;font-family:Arial,sans-serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;padding:12px 20px">${label}</a></p>`;

/** Nurture sequence for owners who left an email: day 2, 7 and 16. */
const FOLLOWUPS: Record<string, FollowUp[]> = {
  it: [
    {
      day: 2,
      subject: (n) => `${n ? `${n}, ` : ''}cosa dicono i proprietari che ci hanno affidato la casa`,
      body: (n, z) =>
        p(`Ciao${n ? ` ${n}` : ''},`) +
        p(`mentre prepariamo la valutazione${z ? ` per la tua casa a ${z}` : ''}, ti lasciamo le parole di un proprietario che ha fatto il tuo stesso passo:`) +
        `<blockquote style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.5;margin:0 0 8px;padding-left:16px;border-left:3px solid #B8925A">“Prima gestivo da solo. Sei mesi con Herocasa e ho scoperto che la casa rendeva il 30% in più, ma soprattutto non mi arrivavano più telefonate alle undici di sera per un problema con il Wi-Fi.”</blockquote>` +
        p('<span style="color:#6B6A5C;font-size:13px">Marco V., proprietario di una villa a Bardolino</span>') +
        p('Se vuoi parlarne prima della chiamata, scrivici quando preferisci:') +
        btn(WA, 'Scrivici su WhatsApp'),
    },
    {
      day: 7,
      subject: () => 'Le 3 domande che ci fanno tutti i proprietari',
      body: (n) =>
        p(`Ciao${n ? ` ${n}` : ''}, ecco le domande che ci fanno più spesso, con risposte brevi:`) +
        p('<strong>Quanto costa?</strong> Una percentuale sui ricavi, senza costi di attivazione né abbonamenti: se la casa non guadagna, non guadagniamo nemmeno noi.') +
        p('<strong>E la burocrazia?</strong> CIN, pratiche SUAP, comunicazioni alla Questura, ISTAT e tassa di soggiorno le seguiamo noi.') +
        p('<strong>Posso usare la casa?</strong> Sempre: blocchi le date che ti servono e noi gestiamo il resto del calendario.') +
        btn(`${SITE}/it#faq`, 'Leggi tutte le risposte'),
    },
    {
      day: 16,
      subject: (n) => `${n ? `${n}, ` : ''}vuoi ancora la valutazione completa?`,
      body: (n, z) =>
        p(`Ciao${n ? ` ${n}` : ''},`) +
        p(`ti scriviamo un'ultima volta${z ? ` per la tua casa a ${z}` : ''}. Le case che partono prima della stagione arrivano più pronte: foto, annunci e prezzi si preparano con calma.`) +
        p('Se ti interessa ancora, rispondi a questa email o scrivici su WhatsApp e fissiamo una chiamata di 30 minuti.') +
        btn(WA, 'Fissiamo una chiamata'),
    },
  ],
  en: [
    {
      day: 2,
      subject: (n) => `${n ? `${n}, ` : ''}what owners who trusted us with their home say`,
      body: (n, z) =>
        p(`Hi${n ? ` ${n}` : ''},`) +
        p(`while we prepare the valuation${z ? ` for your home in ${z}` : ''}, here are the words of an owner who took the same step:`) +
        `<blockquote style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.5;margin:0 0 8px;padding-left:16px;border-left:3px solid #B8925A">“I used to manage on my own. Six months with Herocasa and I found the house yielded 30% more — but mostly, I stopped getting phone calls at 11 pm about a Wi-Fi problem.”</blockquote>` +
        p('<span style="color:#6B6A5C;font-size:13px">Marco V., owner of a villa in Bardolino</span>') +
        p('If you would like to talk before our call, message us any time:') +
        btn(WA, 'Message us on WhatsApp'),
    },
    {
      day: 7,
      subject: () => 'The 3 questions every owner asks us',
      body: (n) =>
        p(`Hi${n ? ` ${n}` : ''}, here are the questions we hear most, with short answers:`) +
        p('<strong>How much does it cost?</strong> A percentage of revenue, with no setup fee or subscription: if the house earns nothing, neither do we.') +
        p('<strong>What about paperwork?</strong> CIN, SUAP permits, police registration, ISTAT and tourist tax are all handled by us.') +
        p('<strong>Can I still use the house?</strong> Always: block the dates you need and we manage the rest of the calendar.') +
        btn(`${SITE}/en#faq`, 'Read all the answers'),
    },
    {
      day: 16,
      subject: (n) => `${n ? `${n}, ` : ''}would you still like the full valuation?`,
      body: (n, z) =>
        p(`Hi${n ? ` ${n}` : ''},`) +
        p(`this is our last note${z ? ` about your home in ${z}` : ''}. Homes that start before the season arrive better prepared: photos, listings and prices take time to get right.`) +
        p('If you are still interested, reply to this email or message us on WhatsApp and we will book a 30-minute call.') +
        btn(WA, 'Book a call'),
    },
  ],
  de: [
    {
      day: 2,
      subject: (n) => `${n ? `${n}, ` : ''}was Eigentümer sagen, die uns ihr Haus anvertraut haben`,
      body: (n, z) =>
        p(`Guten Tag${n ? ` ${n}` : ''},`) +
        p(`während wir die Bewertung${z ? ` für Ihr Haus in ${z}` : ''} vorbereiten, hier die Worte eines Eigentümers, der denselben Schritt gemacht hat:`) +
        `<blockquote style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.5;margin:0 0 8px;padding-left:16px;border-left:3px solid #B8925A">„Vorher habe ich selbst verwaltet. Nach sechs Monaten mit Herocasa hat das Haus 30% mehr abgeworfen — vor allem aber bekam ich keine Anrufe mehr um elf Uhr abends wegen eines WLAN-Problems.“</blockquote>` +
        p('<span style="color:#6B6A5C;font-size:13px">Marco V., Eigentümer einer Villa in Bardolino</span>') +
        p('Wenn Sie schon vor unserem Gespräch sprechen möchten, schreiben Sie uns jederzeit:') +
        btn(WA, 'Auf WhatsApp schreiben'),
    },
    {
      day: 7,
      subject: () => 'Die 3 Fragen, die uns jeder Eigentümer stellt',
      body: (n) =>
        p(`Guten Tag${n ? ` ${n}` : ''}, hier die häufigsten Fragen mit kurzen Antworten:`) +
        p('<strong>Was kostet es?</strong> Ein Prozentsatz der Einnahmen, ohne Einrichtungsgebühr und ohne Abonnement: Wenn das Haus nichts verdient, verdienen auch wir nichts.') +
        p('<strong>Und die Bürokratie?</strong> CIN, SUAP-Verfahren, Meldung an die Polizei, ISTAT und Kurtaxe übernehmen wir.') +
        p('<strong>Kann ich das Haus selbst nutzen?</strong> Jederzeit: Sie blockieren Ihre Termine, wir verwalten den Rest des Kalenders.') +
        btn(`${SITE}/de#faq`, 'Alle Antworten lesen'),
    },
    {
      day: 16,
      subject: (n) => `${n ? `${n}, ` : ''}möchten Sie die vollständige Bewertung noch erhalten?`,
      body: (n, z) =>
        p(`Guten Tag${n ? ` ${n}` : ''},`) +
        p(`wir schreiben Ihnen ein letztes Mal${z ? ` zu Ihrem Haus in ${z}` : ''}. Häuser, die vor der Saison starten, sind besser vorbereitet: Fotos, Inserate und Preise brauchen Zeit.`) +
        p('Wenn Sie noch Interesse haben, antworten Sie auf diese E-Mail oder schreiben Sie uns auf WhatsApp, und wir vereinbaren ein 30-minütiges Gespräch.') +
        btn(WA, 'Gespräch vereinbaren'),
    },
  ],
};

const STOP_LABEL: Record<string, string> = {
  it: 'Non voglio ricevere altre email su questa richiesta',
  en: 'I do not want further emails about this request',
  de: 'Ich möchte keine weiteren E-Mails zu dieser Anfrage',
};

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
  const locale = body.locale && FOLLOWUPS[body.locale] ? body.locale : 'it';
  const name = escapeHtml((body.name || '').trim().split(/\s+/)[0] || '');
  const zone = body.zone ? escapeHtml(body.zone) : '';
  const later: string[] = [];
  for (const f of [...FOLLOWUPS[locale]].reverse()) {
    const stop = later.length
      ? `<p style="font-family:Arial,sans-serif;font-size:11px;color:#6B6A5C;margin:24px 0 0"><a href="${await stopLink(later, locale, env)}" style="color:#6B6A5C">${STOP_LABEL[locale]}</a></p>`
      : '';
    const html = `<div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#F6F1E4;color:#1E4D42">${f.body(name, zone)}${p('<span style="font-family:Georgia,serif;font-size:16px">Herocasa</span><br><span style="font-size:13px">+39 366 369 5252 · info@herocasa.it</span>')}${stop}</div>`;
    const res = await resendCall(env, '/emails', {
      from: env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>',
      to: [body.email],
      reply_to: 'info@herocasa.it',
      subject: f.subject(name),
      html,
      scheduled_at: sendDate(f.day),
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
async function sendOwnerConfirmation(body: ValuationBody, env: Env, followUps: string[]): Promise<void> {
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
  <p style="font-family:Arial,sans-serif;font-size:11px;color:#6B6A5C;margin:0">${c.footer}${
    followUps.length ? ` <a href="${await stopLink(followUps, body.locale && FOLLOWUPS[body.locale] ? body.locale : 'it', env)}" style="color:#6B6A5C">${STOP_LABEL[body.locale && FOLLOWUPS[body.locale] ? body.locale : 'it']}</a>` : ''
  }</p>
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

  return json({ ok: true });
};
