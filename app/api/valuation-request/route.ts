import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * POST /api/valuation-request
 *
 * Receives leads from both the Hero cascade form and the full Estimator
 * section (distinguished by `source`) and emails them to the Herocasa team
 * inbox via Resend. Requires RESEND_API_KEY and LEAD_NOTIFY_EMAIL to be set
 * (Netlify site settings → Environment variables); without them the lead is
 * still logged server-side but no notification goes out.
 */

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
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function buildEmailHtml(body: ValuationBody): string {
  const rows: Array<[string, string]> = [
    ['Provenienza', body.source ?? '—'],
    ['Nome', body.name ?? '—'],
    ['Email', body.email ?? '—'],
    ['Telefono', body.phone ?? '—'],
    ['Comune', body.zone ?? '—'],
    ['Tipo immobile', body.type ?? '—'],
    ['Camere', String(body.rooms ?? '—')],
    ['Dotazioni', (body.features ?? []).join(', ') || '—'],
    ['Note', body.notes ?? '—'],
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

export async function POST(req: Request) {
  let body: ValuationBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 });
  }

  console.log('[valuation-request]', {
    at: new Date().toISOString(),
    ...body,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || 'Herocasa <onboarding@resend.dev>';

  if (apiKey && notifyTo) {
    try {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from,
        to: notifyTo,
        replyTo: body.email,
        subject: `Nuovo lead: ${body.name || 'proprietario'} — ${body.zone || 'zona non specificata'}`,
        html: buildEmailHtml(body),
      });
      if (result.error) {
        console.error('[valuation-request] Resend returned error', result.error);
      }
    } catch (err) {
      console.error('[valuation-request] Resend send failed', err);
    }
  } else {
    console.warn('[valuation-request] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set — no notification sent');
  }

  return NextResponse.json({ ok: true });
}
