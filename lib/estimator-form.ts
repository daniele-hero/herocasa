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
  features: string;
  featuresList: string[];
  notes: string;
  notesPlaceholder: string;
  submit: string;
  legal: string;
  otherZone: string;
}

export const ZONES = [
  'Peschiera del Garda',
  'Lazise',
  'Castelnuovo del Garda',
  'Bardolino',
  'Sirmione',
  'Desenzano del Garda',
  'Padenghe sul Garda',
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
};

export async function postValuationLead(lead: ValuationLead): Promise<void> {
  try {
    await fetch('/api/valuation-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
  } catch {
    // Silent — network hiccups shouldn't block the on-screen confirmation.
    // The endpoint is idempotent-safe to retry server-side if needed.
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

  if (['Sirmione', 'Bardolino'].includes(input.zone)) base *= 1.15;

  base += input.features.length * 2500;
  if (input.features.some((f) => /piscin|pool/i.test(f))) base *= 1.12;
  if (input.features.some((f) => /vista|view|blick/i.test(f))) base *= 1.1;

  return {
    min: Math.round((base * 0.85) / 1000) * 1000,
    max: Math.round((base * 1.2) / 1000) * 1000,
  };
}
