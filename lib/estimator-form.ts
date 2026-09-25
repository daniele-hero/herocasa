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
