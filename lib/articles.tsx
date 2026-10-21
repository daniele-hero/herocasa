import type { ReactNode } from 'react';

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** ISO date shown as "aggiornato il". */
  updated: string;
  /** false = reachable by URL for review, but noindex, out of the sitemap and not linked. */
  published: boolean;
  body: ReactNode;
};

const Note = ({ children }: { children: ReactNode }) => (
  <p className="!text-[14px] border-l-[3px] border-[var(--gold)] pl-4 !text-[var(--olive-70)]">{children}</p>
);

/** Italian guides for owners (tax and permit rules are Italian; translations can follow once reviewed). */
export const ARTICLES: Article[] = [
  {
    slug: 'cin-suap-affitti-brevi',
    title: 'CIN e SUAP per gli affitti brevi: cosa serve davvero',
    description:
      'Codice Identificativo Nazionale, SCIA al SUAP, sicurezza, Questura e tassa di soggiorno: la lista completa degli adempimenti per affittare una casa sul Lago di Garda.',
    updated: '2026-10-21',
    published: false,
    body: (
      <>
        <p>
          Affittare una seconda casa ai turisti è diventato più semplice da fare e più complicato da fare in regola. Negli ultimi anni sono arrivati il{' '}
          <strong>CIN</strong>, nuovi obblighi di sicurezza e controlli più stretti sugli annunci. Ecco cosa serve, in ordine, per una casa sul Lago di Garda.
        </p>

        <h2>1. Il CIN, Codice Identificativo Nazionale</h2>
        <p>
          Il CIN è il codice che identifica ogni immobile affittato per finalità turistiche. Si richiede online, tramite la <strong>Banca Dati delle Strutture
          Ricettive (BDSR)</strong> del Ministero del Turismo, accedendo con SPID o CIE. Per le case che avevano già un codice regionale (in Veneto e in Lombardia
          esisteva da tempo) il CIN viene in genere assegnato partendo da quello.
        </p>
        <p>Una volta ottenuto, il CIN va:</p>
        <ul>
          <li>indicato in <strong>ogni annuncio</strong>, su Airbnb, Booking e qualsiasi altro canale;</li>
          <li>esposto <strong>all&apos;esterno dell&apos;edificio</strong>, in modo visibile.</li>
        </ul>
        <p>
          Le sanzioni sono pesanti: affittare senza CIN può costare da <strong>800 a 8.000 euro</strong>, mentre non esporlo o non indicarlo negli annunci da 500 a
          5.000 euro. I portali, inoltre, possono oscurare gli annunci senza codice.
        </p>

        <h2>2. I requisiti di sicurezza</h2>
        <p>Per ottenere e mantenere il CIN la casa deve avere:</p>
        <ul>
          <li>un <strong>rilevatore di gas combustibili</strong> e di <strong>monossido di carbonio</strong> funzionanti;</li>
          <li><strong>estintori portatili</strong> a norma, in posizione accessibile e visibile, sottoposti alle verifiche periodiche.</li>
        </ul>
        <p>È una spesa contenuta, ma va fatta prima di pubblicare l&apos;annuncio: la mancanza dei dispositivi è sanzionata a parte.</p>

        <h2>3. SUAP e SCIA: quando servono</h2>
        <p>
          Se affitti <strong>in forma non imprenditoriale</strong> (pochi immobili, nessun servizio di tipo alberghiero), di norma non serve una SCIA: bastano CIN,
          eventuali comunicazioni al Comune o al portale regionale e gli adempimenti dei punti successivi.
        </p>
        <p>
          Se invece l&apos;attività è <strong>imprenditoriale</strong>, serve la <strong>SCIA</strong> (Segnalazione Certificata di Inizio Attività) da presentare al{' '}
          <strong>SUAP</strong> del Comune. La legge presume l&apos;attività d&apos;impresa oltre un certo numero di immobili affittati: con la Legge di Bilancio 2026
          la soglia è stata abbassata, e dal terzo immobile in poi conviene verificare con il commercialista se serve la partita IVA.
        </p>

        <h2>4. Gli adempimenti a ogni soggiorno</h2>
        <ul>
          <li>
            <strong>Comunicazione alla Questura</strong>: i dati di ogni ospite vanno trasmessi tramite il portale Alloggiati Web entro 24 ore dall&apos;arrivo (o
            subito, per soggiorni di un giorno).
          </li>
          <li><strong>Dati ISTAT</strong>: arrivi e presenze vanno comunicati periodicamente tramite il portale della propria Regione.</li>
          <li>
            <strong>Tassa di soggiorno</strong>: la stabilisce ogni Comune, con importi ed esenzioni diversi. Va riscossa dagli ospiti (se non lo fa già il
            portale) e versata al Comune con le relative dichiarazioni.
          </li>
          <li>
            <strong>Identificazione degli ospiti</strong>: le autorità chiedono di verificare l&apos;identità di chi soggiorna; le cassette per le chiavi senza
            alcun riconoscimento sono state oggetto di contestazioni.
          </li>
        </ul>

        <h2>5. Le tasse sui ricavi</h2>
        <p>
          I ricavi degli affitti brevi si possono tassare con la <strong>cedolare secca</strong>: ne parliamo nel dettaglio nella guida dedicata. In sintesi:
          aliquota del 21% su un immobile a scelta e del 26% sugli altri.
        </p>

        <h2>Chi se ne occupa?</h2>
        <p>
          Puoi gestire tutto in autonomia, ma richiede tempo e precisione: un errore sulla Questura o sulla tassa di soggiorno si paga caro. Con Herocasa queste
          pratiche le seguiamo noi, dal CIN alle comunicazioni di ogni soggiorno, e tu ricevi un riepilogo ogni mese.
        </p>
        <Note>
          Le norme su affitti brevi e locazioni turistiche cambiano spesso e variano da Regione a Regione. Questa guida è informativa: per la tua situazione
          specifica chiedi conferma al tuo commercialista o al Comune.
        </Note>
      </>
    ),
  },
  {
    slug: 'cedolare-secca-affitti-brevi',
    title: 'Cedolare secca sugli affitti brevi nel 2026: come funziona',
    description:
      'Aliquote 21% e 26%, ritenuta dei portali, soglia della partita IVA e confronto con l’IRPEF: la guida aggiornata per i proprietari di case sul Garda.',
    updated: '2026-10-21',
    published: false,
    body: (
      <>
        <p>
          La <strong>cedolare secca</strong> è il modo più usato per tassare i ricavi degli affitti brevi: un&apos;imposta fissa che sostituisce IRPEF e
          addizionali, senza sommarsi agli altri redditi. Ecco come funziona nel 2026 e quando conviene.
        </p>

        <h2>Che cosa si intende per affitto breve</h2>
        <p>
          Per la legge è breve la locazione di un immobile ad uso abitativo <strong>fino a 30 giorni</strong>, stipulata da persone fisiche fuori dall&apos;attività
          d&apos;impresa. Può includere servizi come la fornitura di biancheria e la pulizia dei locali, ma non servizi di tipo alberghiero (colazione, reception
          continua e simili).
        </p>

        <h2>Le aliquote nel 2026</h2>
        <ul>
          <li>
            <strong>21%</strong> sui ricavi di <strong>un solo immobile</strong>, scelto dal proprietario;
          </li>
          <li>
            <strong>26%</strong> sugli altri immobili affittati con contratti brevi.
          </li>
        </ul>
        <p>
          La Legge di Bilancio 2026 (L. 199/2025) aveva inizialmente previsto il 26% per tutti: nella versione finale la regola del 21% su un immobile è stata
          mantenuta.
        </p>

        <h2>La ritenuta di Airbnb, Booking e delle agenzie</h2>
        <p>
          Quando il pagamento passa da un intermediario (un portale o un&apos;agenzia che incassa per conto del proprietario), l&apos;intermediario trattiene una{' '}
          <strong>ritenuta del 21%</strong> e la versa allo Stato. Questa ritenuta non è un&apos;imposta in più: in dichiarazione si scomputa da quanto dovuto, e se
          l&apos;aliquota applicabile è il 26% si versa solo la differenza.
        </p>

        <h2>Quando scatta la partita IVA</h2>
        <p>
          Oltre un certo numero di immobili affittati nell&apos;anno, l&apos;attività si presume imprenditoriale: niente più cedolare secca, serve la partita IVA e
          spesso la SCIA al SUAP. Con la Legge di Bilancio 2026 la soglia è stata abbassata e riguarda chi affitta <strong>dal terzo immobile</strong> in poi.
        </p>

        <h2>Cedolare secca o IRPEF?</h2>
        <p>
          Con la cedolare secca si paga l&apos;aliquota fissa sull&apos;intero canone, senza deduzioni. Con l&apos;IRPEF ordinaria i ricavi si sommano agli altri
          redditi e si tassano con l&apos;aliquota del proprio scaglione (dal 23% al 43%, più le addizionali). In generale la cedolare conviene a chi ha già redditi
          medio-alti; chi ha redditi bassi o costi rilevanti deve fare il calcolo con il commercialista.
        </p>

        <h2>Un esempio</h2>
        <p>
          Ricavi da affitti brevi su un solo immobile: 20.000 euro in un anno. Con la cedolare al 21% l&apos;imposta è di 4.200 euro, già trattenuti in parte dai
          portali come ritenuta. Lo stesso importo, sommato a un reddito da lavoro di 40.000 euro, con l&apos;IRPEF sarebbe tassato all&apos;aliquota del secondo scaglione
          (33% dal 2026) più le addizionali.
        </p>
        <Note>
          Esempio semplificato a scopo illustrativo. Le regole fiscali cambiano spesso: prima di decidere verifica la tua situazione con un commercialista.
        </Note>
      </>
    ),
  },
  {
    slug: 'quanto-rende-casa-lago-di-garda',
    title: 'Quanto rende una casa sul Lago di Garda con gli affitti brevi',
    description:
      'Da cosa dipendono i ricavi di una casa vacanza sul Garda, quali costi considerare e come stimare quanto può rendere la tua: occupazione, prezzi, stagionalità.',
    updated: '2026-10-21',
    published: false,
    body: (
      <>
        <p>
          È la prima domanda di ogni proprietario. La risposta onesta è: dipende, ma da fattori che si possono misurare. Ecco come ragionare per capire quanto può
          rendere la tua casa sul Lago di Garda.
        </p>

        <h2>I tre numeri che contano</h2>
        <ul>
          <li>
            <strong>Prezzo medio a notte</strong>: cambia con la zona (Sirmione, Garda e Malcesine sono tra le più care), la vista lago, la piscina, il numero di
            camere e la stagione.
          </li>
          <li>
            <strong>Notti occupate</strong>: sul Garda la stagione forte va da aprile a ottobre; con prezzi ben gestiti e annunci curati si riempiono anche
            primavera e autunno.
          </li>
          <li>
            <strong>Costi</strong>: commissioni dei portali, pulizie e biancheria, utenze, manutenzione, tasse.
          </li>
        </ul>
        <p>
          Ricavi lordi = prezzo medio × notti occupate. Ricavi netti = lordi meno costi e tasse. Sembra banale, ma la differenza tra una casa gestita bene e una
          gestita male sta quasi tutta in questi tre numeri.
        </p>

        <h2>Un esempio di calcolo</h2>
        <p>Prendiamo un bilocale ipotetico vicino al lago, con terrazzo:</p>
        <ul>
          <li>150 notti occupate a un prezzo medio di 130 euro = <strong>19.500 euro lordi</strong></li>
          <li>commissioni dei portali (intorno al 15%): circa 2.900 euro</li>
          <li>pulizie e biancheria per circa 40 soggiorni: circa 2.400 euro</li>
          <li>utenze e piccola manutenzione: circa 2.000 euro</li>
        </ul>
        <p>
          Prima delle tasse restano circa <strong>12.000 euro</strong>, a cui va tolta la cedolare secca. Con 30 notti in più o 15 euro in più a notte il
          risultato cambia di migliaia di euro: per questo prezzi e calendario contano più di ogni altra cosa.
        </p>
        <Note>Numeri ipotetici a scopo illustrativo: non sono una stima della tua casa.</Note>

        <h2>Cosa fa salire i ricavi</h2>
        <ul>
          <li><strong>Prezzi aggiornati ogni giorno</strong> in base a stagione, eventi e domanda, invece di una tariffa fissa;</li>
          <li><strong>più canali</strong> (Airbnb, Booking, VRBO, diretto) con calendario sincronizzato;</li>
          <li><strong>foto professionali</strong> e annunci in più lingue, perché molti ospiti del Garda arrivano dall&apos;estero;</li>
          <li><strong>recensioni alte</strong>, che portano più prenotazioni e permettono prezzi più alti;</li>
          <li><strong>risposte rapide</strong> e check-in senza intoppi.</li>
        </ul>

        <h2>E la tua casa?</h2>
        <p>
          Ogni casa è diversa: la posizione esatta, lo stato dell&apos;immobile e le settimane in cui vuoi usarla cambiano il risultato. Con la valutazione
          gratuita qui sotto ottieni subito una prima cifra indicativa; poi ti chiamiamo e la costruiamo insieme sui dati reali della tua zona.
        </p>
      </>
    ),
  },
];

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
