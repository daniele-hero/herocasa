/**
 * Shared shape of the `estimator.form` translation namespace.
 * Both the Estimator section and the Hero cascade form read from this same
 * namespace so proprietors see identical questions in both places.
 */
export interface EstimatorFormCopy {
  name: string;
  email: string;
  phone: string;
  zone: string;
  zonePlaceholder: string;
  type: string;
  typePlaceholder: string;
  types: string[];
  rooms: string;
  roomsOptions: string[];
  roomsDecrease: string;
  roomsIncrease: string;
  features: string;
  featuresList: string[];
  notes: string;
  notesPlaceholder: string;
  submit: string;
  legal: string;
  otherZone: string;
  stepOne: string;
  stepTwo: string;
  next: string;
  back: string;
  emailOptional: string;
  otherZoneName: string;
  otherZonePlaceholder: string;
  phonePlaceholder: string;
  phoneInvalid: string;
  sending: string;
  failTitle: string;
  failBody: string;
  failWhatsapp: string;
  waContinue: string;
  waContinueNote: string;
  waIntroSent: string;
  waIntroFail: string;
  waIntroCall: string;
  waLabels: WhatsappLabels;
}

export type WhatsappLabels = Record<'name' | 'phone' | 'email' | 'zone' | 'type' | 'rooms' | 'features' | 'estimate' | 'notes', string>;

/** Digits in a phone number as typed (spaces, dots, dashes and a leading + allowed). */
export const phoneDigits = (value: string) => (value.match(/\d/g) ?? []).length;
/** Below this the number can't be dialled back: the forms ask the visitor to check it. */
export const MIN_PHONE_DIGITS = 8;

/** wa.me link to Herocasa with the visitor's request already written, one detail per line. */
export function leadWhatsappLink(
  intro: string,
  labels: WhatsappLabels,
  lead: Partial<Record<Exclude<keyof WhatsappLabels, 'features'>, string>> & { features?: string[] },
): string {
  const lines = [intro];
  for (const key of ['name', 'phone', 'email', 'zone', 'type', 'rooms', 'features', 'estimate', 'notes'] as const) {
    const value = key === 'features' ? lead.features?.join(', ') : lead[key];
    if (value?.trim()) lines.push(`${labels[key]}: ${value.trim()}`);
  }
  return `https://wa.me/393663695252?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** Main comuni listed in the form menus; anything else goes through `otherZone` + a free-text comune. */
export const ZONES = [
  'Peschiera del Garda',
  'Lazise',
  'Castelnuovo del Garda',
  'Bardolino',
  'Sirmione',
  'Desenzano del Garda',
  'Padenghe sul Garda',
  'Garda',
  'Torri del Benaco',
  'Malcesine',
  'Manerba del Garda',
  'Salò',
  'Limone sul Garda',
] as const;

export type ValuationLead = {
  source: string;
  name: string;
  email: string;
  phone: string;
  zone: string;
  type: string;
  rooms: string;
  features: string[];
  notes: string;
  submittedAt: string;
  /** Shared with the client-side pixel's `fbq('track', 'Lead', ..., {eventID})` call so Meta dedupes the two deliveries. */
  eventId: string;
  /** Visitor's site language — picks the language of the confirmation email sent to the lead. */
  locale: string;
  /** Marketing-cookie consent: the server only forwards the lead to Meta's Conversions API when true. */
  marketingConsent: boolean;
  estimatedRange?: EstimateRange;
};

/**
 * Sends the lead; true only when the server confirms it (the team notification went out).
 * On false the forms offer WhatsApp with the details pre-written, so the lead is never lost silently.
 */
export async function postValuationLead(lead: ValuationLead): Promise<boolean> {
  try {
    const res = await fetch('/api/valuation-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Page (with any ?utm_ tags, e.g. from the Google Business profiles) and referrer
      // tell the team where the lead came from. Read at submit time: nothing is stored.
      body: JSON.stringify({ ...lead, page: location.pathname + location.search, referrer: document.referrer }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type EstimateRange = { min: number; max: number };

/**
 * Heuristic preview estimate — same formula used by both the Hero cascade
 * form and the full Estimator section, so a visitor sees a consistent
 * number regardless of which form they use. This is an on-screen teaser
 * only; the real figure is worked out by the team and sent within 48h.
 */
export function calculateEstimateRange(input: {
  rooms: string;
  type: string;
  zone: string;
  features: string[];
}): EstimateRange {
  const roomsNum = parseInt(input.rooms, 10) || 2;
  let base = 12000 + roomsNum * 6000;

  if (input.type === 'Villa') base *= 1.5;
  else if (['Casa indipendente', 'Detached house', 'Einfamilienhaus'].includes(input.type)) base *= 1.25;

  if (['Sirmione', 'Bardolino', 'Garda', 'Malcesine', 'Salò', 'Limone sul Garda', 'Gardone Riviera', 'San Felice del Benaco'].includes(input.zone)) base *= 1.15;

  base += input.features.length * 2500;
  if (input.features.some((f) => /piscin|pool/i.test(f))) base *= 1.12;
  if (input.features.some((f) => /vista|view|blick/i.test(f))) base *= 1.1;

  // The site shows only `max`, as an optimistic "up to" figure meant to start
  // the conversation; the real number is explained on the call.
  return {
    min: Math.round((base * 0.85) / 1000) * 1000,
    max: Math.round((base * 1.2) / 1000) * 1000,
  };
}
