import PolicyLayout from '@/components/PolicyLayout';
import { setRequestLocale } from 'next-intl/server';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PolicyLayout
      locale={locale}
      eyebrow="Informativa privacy · art. 13 GDPR"
      title={<>Come trattiamo <em className="italic text-[var(--gold-dark)]">i vostri dati.</em></>}
      lede="In poche parole: raccogliamo solo ciò che serve a rispondervi, non lo vendiamo, potete chiedercelo indietro o farlo cancellare quando volete."
      lastUpdated="24 settembre 2026"
    >
      <h2>1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento dei dati personali raccolti tramite questo sito è <strong>Herocasa</strong> — P.IVA 02668020205.
        Per qualsiasi comunicazione: <a href="mailto:info@herocasa.it">info@herocasa.it</a>.
      </p>

      <h2>2. Dati che raccogliamo</h2>
      <p>Raccogliamo solo i dati strettamente necessari a rispondervi e a proporvi una valutazione dell'immobile:</p>
      <ul>
        <li>nome e cognome</li>
        <li>indirizzo email</li>
        <li>numero di telefono</li>
        <li>informazioni sull'immobile (comune, tipologia, camere, servizi, note libere)</li>
        <li>eventuali comunicazioni successive che ci inviate via email o telefono</li>
      </ul>

      <h2>3. Finalita' e base giuridica</h2>
      <p>Trattiamo i vostri dati per:</p>
      <ul>
        <li>rispondere alla vostra richiesta di valutazione dell'immobile (esecuzione di misure precontrattuali, art. 6(1)(b) GDPR)</li>
        <li>gestire il rapporto contrattuale, qualora decidiate di affidarci l'immobile (art. 6(1)(b) GDPR)</li>
        <li>adempiere agli obblighi di legge fiscali, antiriciclaggio e di comunicazione alle autorita' (art. 6(1)(c) GDPR)</li>
      </ul>
      <p>Non usiamo i vostri dati per attività di marketing senza il vostro consenso esplicito.</p>

      <h2>4. Conservazione</h2>
      <p>
        Conserviamo i dati per il tempo necessario alle finalità sopra descritte, e comunque non oltre 24 mesi dall'ultima interazione,
        salvo obblighi di legge più lunghi (fatturazione, adempimenti fiscali).
      </p>

      <h2>5. Comunicazione a terzi</h2>
      <p>
        I vostri dati non vengono venduti né ceduti. Vengono comunicati solo a fornitori tecnici indispensabili (hosting, invio email, CRM)
        che agiscono come responsabili del trattamento con contratto adeguato.
      </p>

      <h2>6. I vostri diritti</h2>
      <p>
        In qualsiasi momento potete esercitare i diritti previsti dagli articoli 15-22 del GDPR: accesso, rettifica, cancellazione,
        limitazione, portabilita', opposizione. Scriveteci a <a href="mailto:info@herocasa.it">info@herocasa.it</a> e vi rispondiamo entro 30 giorni.
      </p>
      <p>Avete inoltre il diritto di presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</p>

      <h2>7. Cookie</h2>
      <p>
        Per le informazioni sui cookie utilizzati da questo sito consultate la <a href={`/${locale}/cookie`}>Cookie Policy</a>.
      </p>
    </PolicyLayout>
  );
}
