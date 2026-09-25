import PolicyLayout from '@/components/PolicyLayout';
import { setRequestLocale } from 'next-intl/server';

export default async function CookiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PolicyLayout
      locale={locale}
      eyebrow="Cookie policy"
      title={<>Cookie: <em className="italic text-[var(--gold-dark)]">cosa sono e cosa usiamo.</em></>}
      lede="Usiamo solo i cookie strettamente necessari al funzionamento del sito e — se ci autorizzate — alcuni cookie analitici anonimi per capire cosa migliorare. Nessuna profilazione."
      lastUpdated="24 settembre 2026"
    >
      <h2>1. Cosa sono i cookie</h2>
      <p>
        I cookie sono piccoli file di testo che i siti che visitate salvano nel vostro browser per farvi funzionare, per ricordare le vostre
        preferenze o per raccogliere statistiche sull'uso del sito.
      </p>

      <h2>2. Quali cookie usa questo sito</h2>

      <h3>Cookie tecnici (sempre attivi)</h3>
      <p>Necessari al funzionamento del sito. Non richiedono consenso:</p>
      <ul>
        <li>gestione della sessione</li>
        <li>preferenze di lingua (IT / EN / DE)</li>
        <li>memoria del consenso ai cookie</li>
      </ul>

      <h3>Cookie analitici (con consenso)</h3>
      <p>
        Usati per capire come i visitatori usano il sito e migliorarlo. In fase di go-live verranno configurati (es. Plausible, Google Analytics 4 con
        IP anonimizzato) e sarà possibile rifiutarli.
      </p>

      <h3>Cookie di marketing (con consenso)</h3>
      <p>
        Utilizziamo il Meta Pixel (Facebook/Instagram) per misurare l'efficacia delle nostre campagne pubblicitarie e per mostrarvi contenuti più
        pertinenti sui social network Meta. Il Meta Pixel viene caricato solo se date il consenso esplicito tramite il banner cookie; potete revocarlo
        in qualsiasi momento dalle preferenze cookie in fondo alla pagina. Per maggiori informazioni su come Meta tratta questi dati, consultate la{' '}
        <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
          informativa privacy di Meta
        </a>
        .
      </p>

      <h3>Cookie di terze parti</h3>
      <p>
        Questo sito può contenere contenuti da terze parti (es. mappe, video incorporati). Quando presenti, tali servizi possono impostare cookie propri,
        di cui Herocasa non ha diretto controllo.
      </p>

      <h2>3. Come gestire i cookie</h2>
      <p>
        Potete modificare in qualsiasi momento le vostre preferenze tramite il banner cookie del sito o direttamente dalle impostazioni del vostro browser.
        Disabilitare i cookie tecnici può compromettere il funzionamento del sito.
      </p>

      <h2>4. Aggiornamenti</h2>
      <p>
        Questa cookie policy può essere aggiornata per riflettere modifiche tecniche o normative. La versione in vigore è sempre quella pubblicata su
        questa pagina.
      </p>
    </PolicyLayout>
  );
}
