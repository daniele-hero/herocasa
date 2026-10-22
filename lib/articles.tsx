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

/**
 * Italian guides for owners (permit rules are Italian; translations can follow once reviewed).
 * No tax topics on purpose: the owner prefers to cover taxation in person, not on the site.
 */
export const ARTICLES: Article[] = [
  {
    slug: 'cin-suap-affitti-brevi',
    title: 'CIN e SUAP per gli affitti brevi: cosa serve davvero',
    description:
      'Codice Identificativo Nazionale, SCIA al SUAP, sicurezza, Questura e tassa di soggiorno: la lista completa degli adempimenti per affittare una casa sul Lago di Garda.',
    updated: '2026-10-22',
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
          Se invece l&apos;attività è <strong>imprenditoriale</strong>, per esempio con più immobili o con servizi di tipo alberghiero, serve la{' '}
          <strong>SCIA</strong> (Segnalazione Certificata di Inizio Attività) da presentare al <strong>SUAP</strong> del Comune. Se hai più case da affittare,
          verifica con il Comune in quale caso rientri prima di pubblicare gli annunci.
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

        <h2>Chi se ne occupa?</h2>
        <p>
          Puoi gestire tutto in autonomia, ma richiede tempo e precisione: un errore sulla Questura o sulla tassa di soggiorno si paga caro. Con Herocasa queste
          pratiche le seguiamo noi, dal CIN alle comunicazioni di ogni soggiorno, e tu ricevi un riepilogo ogni mese.
        </p>
        <Note>
          Le norme su affitti brevi e locazioni turistiche cambiano spesso e variano da Regione a Regione. Questa guida è informativa: per la tua situazione
          specifica chiedi conferma al Comune o al tuo consulente.
        </Note>
      </>
    ),
  },
  {
    slug: 'gestire-da-soli-o-con-un-gestore',
    title: 'Affitti brevi sul Garda: gestire da soli o affidarsi a un gestore?',
    description:
      'Quanto lavoro c’è davvero dietro una casa vacanza, cosa fa un gestore professionale e come sceglierlo: una guida per decidere con calma.',
    updated: '2026-10-22',
    published: false,
    body: (
      <>
        <p>
          Molti proprietari iniziano da soli, con un annuncio su Airbnb e un vicino che consegna le chiavi. Funziona, finché la stagione non si riempie. Ecco
          cosa comporta davvero ciascuna strada, per scegliere quella giusta per te e per la tua casa.
        </p>

        <h2>Il lavoro dietro ogni soggiorno</h2>
        <p>Per ogni prenotazione, anche di due notti, c&apos;è una sequenza che si ripete:</p>
        <ul>
          <li>rispondere a richieste e messaggi, spesso in più lingue e a qualsiasi ora;</li>
          <li>
            accogliere gli ospiti e registrarli alla Questura entro 24 ore (trovi tutti gli adempimenti nella{' '}
            <a href="/it/guide/cin-suap-affitti-brevi">guida su CIN e SUAP</a>);
          </li>
          <li>pulizie, cambio della biancheria e controllo della casa tra un ospite e l&apos;altro;</li>
          <li>gestire gli imprevisti: una caldaia che si ferma, una chiave persa, un arrivo in piena notte;</li>
          <li>aggiornare prezzi e calendario su ogni portale.</li>
        </ul>
        <p>In alta stagione sul Garda i cambi possono essere due o tre a settimana: chi vive lontano dalla casa se ne accorge presto.</p>

        <h2>Gestire da soli: quando ha senso</h2>
        <ul>
          <li>abiti vicino alla casa e hai tempo, soprattutto nei weekend;</li>
          <li>affitti solo poche settimane all&apos;anno;</li>
          <li>hai una persona di fiducia per pulizie e check-in.</li>
        </ul>
        <p>
          Il vantaggio è che tutto il ricavo resta a te. Il costo è il tuo tempo, più quello che si perde senza accorgersene: prezzi fermi tutta la stagione,
          risposte lente, recensioni non perfette.
        </p>

        <h2>Cosa fa un gestore professionale</h2>
        <ul>
          <li>annunci curati, con foto professionali e testi in più lingue;</li>
          <li>prezzi aggiornati ogni giorno in base a stagione, eventi e domanda;</li>
          <li>pubblicazione su più portali con il calendario sincronizzato;</li>
          <li>accoglienza degli ospiti, pulizie, biancheria e piccola manutenzione;</li>
          <li>pratiche e comunicazioni: CIN, Questura, ISTAT, tassa di soggiorno.</li>
        </ul>
        <p>Il compenso di solito è una percentuale sui ricavi: il gestore guadagna di più solo se la tua casa rende di più.</p>

        <h2>Come scegliere il gestore giusto</h2>
        <ul>
          <li><strong>Trasparenza</strong>: un rendiconto mensile chiaro, con prenotazioni, costi e bonifico;</li>
          <li><strong>presenza sul posto</strong>: qualcuno che conosce la zona e può intervenire in fretta;</li>
          <li><strong>nessun vincolo nascosto</strong>: chiedi di costi di attivazione, durata del contratto e preavviso per uscire;</li>
          <li><strong>uso personale</strong>: devi poter bloccare le settimane in cui vuoi usare la casa;</li>
          <li><strong>recensioni</strong>: chiedi di vedere gli annunci che gestisce già e i loro punteggi.</li>
        </ul>

        <h2>E la tua casa?</h2>
        <p>
          Se vuoi capire quanto potrebbe rendere con una gestione professionale, parti dalla valutazione gratuita qui sotto: ottieni subito una prima cifra,
          poi ne parliamo al telefono, senza impegno.
        </p>
      </>
    ),
  },
  {
    slug: 'quanto-rende-casa-lago-di-garda',
    title: 'Quanto rende una casa sul Lago di Garda con gli affitti brevi',
    description:
      'Da cosa dipendono i ricavi di una casa vacanza sul Garda, quali costi considerare e come stimare quanto può rendere la tua: occupazione, prezzi, stagionalità.',
    updated: '2026-10-22',
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
            <strong>Costi</strong>: commissioni dei portali, pulizie e biancheria, utenze, manutenzione.
          </li>
        </ul>
        <p>
          Ricavi lordi = prezzo medio × notti occupate. Al netto si tolgono i costi. Sembra banale, ma la differenza tra una casa gestita bene e una
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
          Al netto di questi costi restano circa <strong>12.000 euro</strong> (prima delle imposte). Con 30 notti in più o 15 euro in più a notte il
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
