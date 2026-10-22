/**
 * TEMPORARY: POST /api/email-preview sends one sample of every lead email to the first
 * LEAD_NOTIFY_EMAIL address, so the texts can be checked in a real inbox. Remove after use.
 */
import { previewAllEmails } from './valuation-request';

interface Env {
  RESEND_API_KEY?: string;
  LEAD_NOTIFY_EMAIL?: string;
  RESEND_FROM_EMAIL?: string;
}

export const onRequestPost = async ({ env }: { env: Env }): Promise<Response> => {
  const to = (env.LEAD_NOTIFY_EMAIL ?? '').split(',')[0]?.trim();
  if (!env.RESEND_API_KEY || !to) return new Response('not configured', { status: 500 });
  const ids = await previewAllEmails(env, to);
  return Response.json({ to, followUps: ids.length });
};
