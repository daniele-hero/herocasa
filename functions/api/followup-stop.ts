/**
 * GET /api/followup-stop?ids=…&l=…&sig=… — cancels scheduled follow-up emails.
 * Links are created (and HMAC-signed) by functions/api/valuation-request.ts:
 * one in each follow-up for the emails after it, one in the owner's
 * confirmation, and one in the team's lead notification.
 */

interface Env {
  RESEND_API_KEY?: string;
}

const COPY: Record<string, { done: string; body: string; bad: string; back: string }> = {
  it: { done: 'Fatto.', body: 'Non riceverai altre email automatiche su questa richiesta.', bad: 'Link non valido o scaduto.', back: 'Torna al sito' },
  en: { done: 'Done.', body: 'You will not receive further automatic emails about this request.', bad: 'Invalid or expired link.', back: 'Back to the website' },
  de: { done: 'Erledigt.', body: 'Sie erhalten keine weiteren automatischen E-Mails zu dieser Anfrage.', bad: 'Ungültiger oder abgelaufener Link.', back: 'Zur Website' },
};

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const page = (locale: string, title: string, text: string) =>
  new Response(
    `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Herocasa</title></head>
<body style="margin:0;background:#F6F1E4;color:#1E4D42;font-family:Georgia,serif;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box">
<main style="max-width:420px;text-align:center"><h1 style="font-weight:400;font-size:34px;margin:0 0 12px">${title}</h1>
<p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;margin:0 0 24px">${text}</p>
<a href="/${locale}" style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#8B6F44">${COPY[locale].back}</a></main></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const url = new URL(request.url);
  const locale = COPY[url.searchParams.get('l') ?? ''] ? (url.searchParams.get('l') as string) : 'it';
  const c = COPY[locale];
  const ids = url.searchParams.get('ids') ?? '';
  const sig = url.searchParams.get('sig') ?? '';
  if (!env.RESEND_API_KEY || !ids || !/^[0-9a-f]{64}$/.test(sig)) return page(locale, c.bad, '');

  const expected = await hmacHex(`followup:${env.RESEND_API_KEY}`, ids);
  if (expected !== sig) return page(locale, c.bad, '');

  // Already-sent or already-cancelled emails just return an error here; that's fine.
  for (const id of ids.split(',').filter((x) => /^[0-9a-f-]{36}$/i.test(x))) {
    const res = await fetch(`https://api.resend.com/emails/${id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
    });
    if (!res.ok && res.status !== 404) console.warn('[followup-stop] cancel', id, res.status, await res.text());
  }
  return page(locale, c.done, c.body);
};
