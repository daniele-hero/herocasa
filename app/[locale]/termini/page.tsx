import PolicyLayout from '@/components/PolicyLayout';
import { setRequestLocale } from 'next-intl/server';

export default async function TerminiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PolicyLayout
      locale={locale}
      eyebrow="Termini e condizioni d'uso"
      title={<>Le <em className="italic text-[var(--gold-dark)]">regole del gioco.</em></>}
      lede="Le condizioni che disciplinano l'uso di questo sito. Sono qui per chiarezza, non per formalismo."
      lastUpdated="24 settembre 2026"
    >
      <h2>1. Titolare del sito</h2>
      <p>
        Questo sito è gestito da <strong>Herocasa</strong> — P.IVA 02668020205 (di seguito "Herocasa"). Per qualsiasi comunicazione:{' '}
        <a href="mailto:info@herocasa.it">info@herocasa.it</a>.
      </p>

      <h2>2. Oggetto</h2>
      <p>
        Le presenti condizioni disciplinano l'uso del sito herocasa.it, che ha come finalità principale la presentazione dei servizi di property
        management offerti da Herocasa a proprietari di seconde case sul Lago di Garda.
      </p>
      <p>
        Il sito non è un servizio di prenotazione turistica. I servizi di gestione, i corrispettivi e le condizioni contrattuali sono disciplinati
        da specifici accordi scritti tra Herocasa e ciascun proprietario.
      </p>

      <h2>3. Richiesta di valutazione</h2>
      <p>
        La compilazione del modulo di richiesta valutazione ("Valuta il tuo immobile") non costituisce accettazione di un contratto né un impegno
        reciproco. Si tratta di una richiesta di preventivo. La stima orientativa fornita è indicativa e non vincolante; la valutazione completa
        viene comunicata separatamente via email entro 48 ore lavorative.
      </p>

      <h2>4. Contenuti del sito</h2>
      <p>
        I contenuti presenti (testi, immagini, dati numerici, loghi, video) sono di proprietà di Herocasa o dei rispettivi titolari e sono protetti
        dalle norme sul diritto d'autore. Non è consentita la riproduzione, anche parziale, senza autorizzazione scritta.
      </p>
      <p>
        I dati statistici (tassi di occupazione, rendimenti, numero di immobili in gestione) sono indicativi e riferiti al portafoglio Herocasa
        all'ultima data di aggiornamento del sito. Performance passate non garantiscono risultati futuri.
      </p>

      <h2>5. Limitazioni di responsabilità</h2>
      <p>
        Herocasa cura la correttezza delle informazioni pubblicate, ma non garantisce che siano prive di errori, complete o costantemente aggiornate.
        Herocasa non risponde di eventuali interruzioni tecniche del sito o di danni derivanti da un uso improprio.
      </p>

      <h2>6. Foro competente</h2>
      <p>
        Per qualsiasi controversia relativa all'uso del sito è competente il Foro di Verona, salvo diverse norme inderogabili applicabili al consumatore.
      </p>

      <h2>7. Modifiche</h2>
      <p>
        Herocasa si riserva il diritto di modificare in qualsiasi momento le presenti condizioni, dandone comunicazione tramite pubblicazione sul sito.
      </p>
    </PolicyLayout>
  );
}
