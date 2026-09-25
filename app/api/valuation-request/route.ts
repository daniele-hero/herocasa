import { NextResponse } from 'next/server';

/**
 * POST /api/valuation-request
 *
 * Receives leads from both the Hero cascade form and the full Estimator
 * section (distinguished by `source`). Wire this to your email service
 * (Resend, Postmark, SendGrid) and/or CRM (HubSpot, Pipedrive, Notion,
 * Airtable) before go-live.
 *
 * For a first release without a paid mail provider, the simplest reliable
 * setup is: forward to a dedicated inbox via SMTP (nodemailer) OR send to a
 * webhook (Make.com / Zapier) that already has notifications wired.
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

  // TODO before go-live, replace with real destinations:
  // 1) Email notification to the Herocasa team inbox
  // 2) Save to CRM
  // 3) Send confirmation email to the lead

  console.log('[valuation-request]', {
    at: new Date().toISOString(),
    ...body,
  });

  return NextResponse.json({ ok: true });
}
