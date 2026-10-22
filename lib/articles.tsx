import type { ReactNode } from 'react';
import type { Locale } from './routing';
import type { GuideId } from './guide-links';

export type GuideText = { title: string; description: string; body: ReactNode };
/** `updated`: ISO date shown as "aggiornato il". */
export type GuideContent = { updated: string } & Record<Locale, GuideText>;

const Note = ({ children }: { children: ReactNode }) => (
  <p className="!text-[14px] border-l-[3px] border-[var(--gold)] pl-4 !text-[var(--olive-70)]">{children}</p>
);

/**
 * Owner guides in Italian, English and German: Italian rules, so they matter to foreign owners too.
 * No tax topics on purpose: the owner prefers to cover taxation in person, not on the site.
 * Slugs, link labels and publication live in lib/guide-links.ts.
 */
export const GUIDE_CONTENT: Record<GuideId, GuideContent> = {
  gestore: {
    updated: '2026-10-22',
    it: {
      title: 'Affitti brevi sul Garda: gestire da soli o affidarsi a un gestore?',
      description:
        'Quanto lavoro c’è davvero dietro una casa vacanza, cosa fa un gestore professionale e come sceglierlo: una guida per decidere con calma.',
      body: (
        <>
          <p>
            Molti proprietari iniziano da soli, con un annuncio su Airbnb e un vicino che consegna le chiavi. Funziona, finché la stagione non si riempie. Ecco
            cosa comporta davvero ciascuna strada, per scegliere quella giusta per te e per la tua casa.
          </p>

          <h2>Il lavoro dietro ogni soggiorno</h2>
          <p>Per ogni prenotazione, anche di due notti, c&apos;è una sequenza che si ripete:</p>
          <ul>
            <li>Rispondere a richieste e messaggi, spesso in più lingue e a qualsiasi ora.</li>
            <li>
              Accogliere gli ospiti e registrarli alla Questura entro 24 ore (trovi tutti gli adempimenti nella{' '}
              <a href="/it/guide/cin-suap-affitti-brevi">guida su CIN e SUAP</a>).
            </li>
            <li>Pulizie, cambio della biancheria e controllo della casa tra un ospite e l&apos;altro.</li>
            <li>Gestire gli imprevisti: una caldaia che si ferma, una chiave persa, un arrivo in piena notte.</li>
            <li>Aggiornare prezzi e calendario su ogni portale.</li>
          </ul>
          <p>In alta stagione sul Garda i cambi possono essere due o tre a settimana: chi vive lontano dalla casa se ne accorge presto.</p>

          <h2>Gestire da soli: quando ha senso</h2>
          <ul>
            <li>Abiti vicino alla casa e hai tempo, soprattutto nei weekend.</li>
            <li>Affitti solo poche settimane all&apos;anno.</li>
            <li>Hai una persona di fiducia per pulizie e check-in.</li>
          </ul>
          <p>
            Il vantaggio è che tutto il ricavo resta a te. Il costo è il tuo tempo, più quello che si perde senza accorgersene: prezzi fermi tutta la stagione,
            risposte lente, recensioni non perfette.
          </p>

          <h2>Cosa fa un gestore professionale</h2>
          <ul>
            <li>Annunci curati, con foto professionali e testi in più lingue.</li>
            <li>Prezzi aggiornati ogni giorno in base a stagione, eventi e domanda.</li>
            <li>Pubblicazione su più portali con il calendario sincronizzato.</li>
            <li>Accoglienza degli ospiti, pulizie, biancheria e piccola manutenzione.</li>
            <li>Pratiche e comunicazioni: CIN, Questura, ISTAT, tassa di soggiorno.</li>
          </ul>
          <p>Il compenso di solito è una percentuale sui ricavi: il gestore guadagna di più solo se la tua casa rende di più.</p>

          <h2>Come scegliere il gestore giusto</h2>
          <ul>
            <li><strong>Trasparenza</strong>: un rendiconto mensile chiaro, con prenotazioni, costi e bonifico.</li>
            <li><strong>Presenza sul posto</strong>: qualcuno che conosce la zona e può intervenire in fretta.</li>
            <li><strong>Nessun vincolo nascosto</strong>: chiedi di costi di attivazione, durata del contratto e preavviso per uscire.</li>
            <li><strong>Uso personale</strong>: devi poter bloccare le settimane in cui vuoi usare la casa.</li>
            <li><strong>Recensioni</strong>: chiedi di vedere gli annunci che gestisce già e i loro punteggi.</li>
          </ul>

          <h2>E la tua casa?</h2>
          <p>
            Se vuoi capire quanto potrebbe rendere con una gestione professionale, parti dalla valutazione gratuita qui sotto: ottieni subito una prima cifra,
            poi ne parliamo al telefono, senza impegno.
          </p>
        </>
      ),
    },
    en: {
      title: 'Lake Garda short-term rentals: manage it yourself or hire a property manager?',
      description:
        'How much work really goes into a holiday home, what a professional manager does and how to choose one: a guide to help you decide calmly.',
      body: (
        <>
          <p>
            Many owners start on their own, with an Airbnb listing and a neighbour handing over the keys. It works, until the season fills up. Here is what each
            option really involves, so you can choose the right one for you and your home.
          </p>

          <h2>The work behind every stay</h2>
          <p>For every booking, even a two-night one, the same sequence repeats:</p>
          <ul>
            <li>Answering enquiries and messages, often in several languages and at any hour.</li>
            <li>
              Welcoming guests and registering them with the police within 24 hours (all the requirements are in our{' '}
              <a href="/en/guide/cin-suap-short-term-rentals-italy">guide to CIN and SUAP</a>).
            </li>
            <li>Cleaning, changing the linen and checking the home between guests.</li>
            <li>Handling the unexpected: a boiler that stops, a lost key, an arrival in the middle of the night.</li>
            <li>Updating prices and calendars on every platform.</li>
          </ul>
          <p>In high season on Lake Garda there can be two or three changeovers a week: if you live far from the home, you notice quickly.</p>

          <h2>Managing it yourself: when it makes sense</h2>
          <ul>
            <li>You live near the home and have time, especially at weekends.</li>
            <li>You only rent it out for a few weeks a year.</li>
            <li>You have someone you trust for cleaning and check-in.</li>
          </ul>
          <p>
            The upside is that all the revenue stays with you. The cost is your time, plus what you lose without noticing: prices that never change all season,
            slow replies, reviews that aren’t quite perfect.
          </p>

          <h2>What a professional manager does</h2>
          <ul>
            <li>Well-crafted listings, with professional photos and texts in several languages.</li>
            <li>Prices updated every day based on season, events and demand.</li>
            <li>Publishing on several platforms with a synchronised calendar.</li>
            <li>Welcoming guests, cleaning, linen and minor maintenance.</li>
            <li>Paperwork and notices: CIN, police registration, ISTAT, tourist tax.</li>
          </ul>
          <p>The fee is usually a percentage of revenue: the manager only earns more if your home earns more.</p>

          <h2>How to choose the right manager</h2>
          <ul>
            <li><strong>Transparency</strong>: a clear monthly statement with bookings, costs and payout.</li>
            <li><strong>Local presence</strong>: someone who knows the area and can step in quickly.</li>
            <li><strong>No hidden ties</strong>: ask about set-up fees, contract length and the notice period to leave.</li>
            <li><strong>Personal use</strong>: you should be able to block the weeks when you want to use the home.</li>
            <li><strong>Reviews</strong>: ask to see the listings they already manage and their ratings.</li>
          </ul>

          <h2>What about your home?</h2>
          <p>
            If you’d like to know how much it could earn with professional management, start with the free valuation below: you get a first figure straight away,
            then we talk it through on the phone, with no obligation.
          </p>
        </>
      ),
    },
    de: {
      title: 'Ferienhaus am Gardasee: selbst vermieten oder einen Verwalter beauftragen?',
      description:
        'Wie viel Arbeit wirklich hinter einem Ferienhaus steckt, was ein professioneller Verwalter übernimmt und wie Sie ihn auswählen: ein Ratgeber für eine ruhige Entscheidung.',
      body: (
        <>
          <p>
            Viele Eigentümer fangen allein an, mit einem Airbnb-Inserat und einem Nachbarn, der die Schlüssel übergibt. Das funktioniert, bis die Saison voll wird.
            Hier lesen Sie, was jeder Weg wirklich bedeutet, damit Sie den richtigen für sich und Ihr Haus wählen.
          </p>

          <h2>Die Arbeit hinter jedem Aufenthalt</h2>
          <p>Bei jeder Buchung, auch für zwei Nächte, wiederholt sich derselbe Ablauf:</p>
          <ul>
            <li>Anfragen und Nachrichten beantworten, oft in mehreren Sprachen und zu jeder Uhrzeit.</li>
            <li>
              Gäste empfangen und innerhalb von 24 Stunden bei der Polizei melden (alle Pflichten finden Sie in unserem{' '}
              <a href="/de/ratgeber/cin-suap-ferienvermietung-italien">Ratgeber zu CIN und SUAP</a>).
            </li>
            <li>Reinigung, Wäschewechsel und Kontrolle des Hauses zwischen zwei Gästen.</li>
            <li>Unvorhergesehenes lösen: eine ausgefallene Heizung, ein verlorener Schlüssel, eine Ankunft mitten in der Nacht.</li>
            <li>Preise und Kalender auf jedem Portal aktualisieren.</li>
          </ul>
          <p>In der Hochsaison gibt es am Gardasee zwei bis drei Gästewechsel pro Woche: Wer weit weg wohnt, merkt das schnell.</p>

          <h2>Selbst vermieten: wann es sinnvoll ist</h2>
          <ul>
            <li>Sie wohnen in der Nähe des Hauses und haben Zeit, vor allem am Wochenende.</li>
            <li>Sie vermieten nur wenige Wochen im Jahr.</li>
            <li>Sie haben eine Vertrauensperson für Reinigung und Check-in.</li>
          </ul>
          <p>
            Der Vorteil: Die gesamten Einnahmen bleiben bei Ihnen. Der Preis ist Ihre Zeit, dazu kommt, was unbemerkt verloren geht: Preise, die die ganze Saison
            gleich bleiben, langsame Antworten, nicht ganz perfekte Bewertungen.
          </p>

          <h2>Was ein professioneller Verwalter übernimmt</h2>
          <ul>
            <li>Sorgfältige Inserate mit professionellen Fotos und Texten in mehreren Sprachen.</li>
            <li>Täglich angepasste Preise je nach Saison, Veranstaltungen und Nachfrage.</li>
            <li>Veröffentlichung auf mehreren Portalen mit synchronisiertem Kalender.</li>
            <li>Empfang der Gäste, Reinigung, Wäsche und kleine Instandhaltung.</li>
            <li>Formalitäten und Meldungen: CIN, Questura, ISTAT, Kurtaxe.</li>
          </ul>
          <p>Die Vergütung ist meist ein Prozentsatz der Einnahmen: Der Verwalter verdient nur dann mehr, wenn Ihr Haus mehr einbringt.</p>

          <h2>So wählen Sie den richtigen Verwalter</h2>
          <ul>
            <li><strong>Transparenz</strong>: eine klare monatliche Abrechnung mit Buchungen, Kosten und Überweisung.</li>
            <li><strong>Präsenz vor Ort</strong>: jemand, der die Gegend kennt und schnell eingreifen kann.</li>
            <li><strong>Keine versteckten Bindungen</strong>: Fragen Sie nach Einrichtungsgebühren, Vertragslaufzeit und Kündigungsfrist.</li>
            <li><strong>Eigennutzung</strong>: Sie müssen die Wochen sperren können, in denen Sie das Haus selbst nutzen möchten.</li>
            <li><strong>Bewertungen</strong>: Lassen Sie sich die Inserate zeigen, die er bereits betreut, und deren Bewertungen.</li>
          </ul>

          <h2>Und Ihr Haus?</h2>
          <p>
            Wenn Sie wissen möchten, was es mit professioneller Verwaltung einbringen könnte, beginnen Sie mit der kostenlosen Bewertung unten: Sie erhalten sofort
            eine erste Zahl, danach besprechen wir alles am Telefon, unverbindlich.
          </p>
        </>
      ),
    },
  },
  rendita: {
    updated: '2026-10-22',
    it: {
      title: 'Quanto rende una casa sul Lago di Garda con gli affitti brevi',
      description:
        'Da cosa dipendono i ricavi di una casa vacanza sul Garda, quali costi considerare e come stimare quanto può rendere la tua: occupazione, prezzi, stagionalità.',
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
            <li>Commissioni dei portali (intorno al 15%): circa 2.900 euro</li>
            <li>Pulizie e biancheria per circa 40 soggiorni: circa 2.400 euro</li>
            <li>Utenze e piccola manutenzione: circa 2.000 euro</li>
          </ul>
          <p>
            Al netto di questi costi restano circa <strong>12.000 euro</strong> (prima delle imposte). Con 30 notti in più o 15 euro in più a notte il
            risultato cambia di migliaia di euro: per questo prezzi e calendario contano più di ogni altra cosa.
          </p>
          <Note>Numeri ipotetici a scopo illustrativo: non sono una stima della tua casa.</Note>

          <h2>Cosa fa salire i ricavi</h2>
          <ul>
            <li><strong>Prezzi aggiornati ogni giorno</strong> in base a stagione, eventi e domanda, invece di una tariffa fissa.</li>
            <li><strong>Più canali</strong> (Airbnb, Booking, VRBO, diretto) con calendario sincronizzato.</li>
            <li><strong>Foto professionali</strong> e annunci in più lingue, perché molti ospiti del Garda arrivano dall&apos;estero.</li>
            <li><strong>Recensioni alte</strong>, che portano più prenotazioni e permettono prezzi più alti.</li>
            <li><strong>Risposte rapide</strong> e check-in senza intoppi.</li>
          </ul>

          <h2>E la tua casa?</h2>
          <p>
            Ogni casa è diversa: la posizione esatta, lo stato dell&apos;immobile e le settimane in cui vuoi usarla cambiano il risultato. Con la valutazione
            gratuita qui sotto ottieni subito una prima cifra indicativa; poi ti chiamiamo e la costruiamo insieme sui dati reali della tua zona.
          </p>
        </>
      ),
    },
    en: {
      title: 'How much can a Lake Garda home earn with short-term rentals?',
      description:
        'What drives the revenue of a holiday home on Lake Garda, which costs to consider and how to estimate what yours could earn: occupancy, prices, seasonality.',
      body: (
        <>
          <p>
            It’s every owner’s first question. The honest answer is: it depends, but on factors you can measure. Here is how to work out what your home on Lake
            Garda could earn.
          </p>

          <h2>The three numbers that matter</h2>
          <ul>
            <li>
              <strong>Average nightly rate</strong>: it changes with the area (Sirmione, Garda and Malcesine are among the most expensive), the lake view, a pool,
              the number of bedrooms and the season.
            </li>
            <li>
              <strong>Nights booked</strong>: on Lake Garda the high season runs from April to October; with well-managed prices and good listings, spring and
              autumn fill up too.
            </li>
            <li>
              <strong>Costs</strong>: platform fees, cleaning and linen, utilities, maintenance.
            </li>
          </ul>
          <p>
            Gross revenue = average rate × nights booked. For the net figure, subtract the costs. It sounds obvious, but almost all the difference between a
            well-run home and a badly run one lies in these three numbers.
          </p>

          <h2>A worked example</h2>
          <p>Take a hypothetical one-bedroom flat near the lake, with a terrace:</p>
          <ul>
            <li>150 nights booked at an average rate of €130 = <strong>€19,500 gross</strong></li>
            <li>Platform fees (around 15%): about €2,900</li>
            <li>Cleaning and linen for about 40 stays: about €2,400</li>
            <li>Utilities and minor maintenance: about €2,000</li>
          </ul>
          <p>
            After these costs you are left with about <strong>€12,000</strong> (before taxes). With 30 more nights or €15 more per night the result changes by
            thousands of euros: that’s why pricing and the calendar matter more than anything else.
          </p>
          <Note>Hypothetical figures for illustration only: they are not an estimate for your home.</Note>

          <h2>What pushes revenue up</h2>
          <ul>
            <li><strong>Prices updated every day</strong> based on season, events and demand, instead of a fixed rate.</li>
            <li><strong>More channels</strong> (Airbnb, Booking, VRBO, direct) with a synchronised calendar.</li>
            <li><strong>Professional photos</strong> and listings in several languages, because many Lake Garda guests come from abroad.</li>
            <li><strong>High ratings</strong>, which bring more bookings and allow higher prices.</li>
            <li><strong>Fast replies</strong> and a smooth check-in.</li>
          </ul>

          <h2>What about your home?</h2>
          <p>
            Every home is different: the exact location, the condition of the property and the weeks you want to use it yourself all change the result. With the
            free valuation below you get a first indicative figure straight away; then we call you and work it out together using real data for your area.
          </p>
        </>
      ),
    },
    de: {
      title: 'Was bringt ein Ferienhaus am Gardasee mit Kurzzeitvermietung?',
      description:
        'Wovon die Einnahmen einer Ferienwohnung am Gardasee abhängen, welche Kosten anfallen und wie Sie abschätzen, was Ihre einbringen kann: Auslastung, Preise, Saison.',
      body: (
        <>
          <p>
            Das ist die erste Frage jedes Eigentümers. Die ehrliche Antwort lautet: Es kommt darauf an, aber auf Faktoren, die sich messen lassen. So schätzen Sie
            ab, was Ihr Haus am Gardasee einbringen kann.
          </p>

          <h2>Die drei Zahlen, auf die es ankommt</h2>
          <ul>
            <li>
              <strong>Durchschnittspreis pro Nacht</strong>: Er hängt von der Lage ab (Sirmione, Garda und Malcesine gehören zu den teuersten Orten), vom
              Seeblick, einem Pool, der Zahl der Schlafzimmer und der Saison.
            </li>
            <li>
              <strong>Belegte Nächte</strong>: Am Gardasee dauert die Hauptsaison von April bis Oktober; mit gut gesteuerten Preisen und gepflegten Inseraten
              füllen sich auch Frühling und Herbst.
            </li>
            <li>
              <strong>Kosten</strong>: Provisionen der Portale, Reinigung und Wäsche, Nebenkosten, Instandhaltung.
            </li>
          </ul>
          <p>
            Bruttoeinnahmen = Durchschnittspreis × belegte Nächte. Für den Nettobetrag ziehen Sie die Kosten ab. Das klingt banal, doch fast der ganze Unterschied
            zwischen einem gut und einem schlecht verwalteten Haus steckt in diesen drei Zahlen.
          </p>

          <h2>Ein Rechenbeispiel</h2>
          <p>Nehmen wir eine hypothetische Zweizimmerwohnung nahe am See, mit Terrasse:</p>
          <ul>
            <li>150 belegte Nächte zu durchschnittlich 130 Euro = <strong>19.500 Euro brutto</strong></li>
            <li>Provisionen der Portale (rund 15 %): etwa 2.900 Euro</li>
            <li>Reinigung und Wäsche für etwa 40 Aufenthalte: etwa 2.400 Euro</li>
            <li>Nebenkosten und kleine Instandhaltung: etwa 2.000 Euro</li>
          </ul>
          <p>
            Nach diesen Kosten bleiben rund <strong>12.000 Euro</strong> (vor Steuern). Mit 30 Nächten mehr oder 15 Euro mehr pro Nacht ändert sich das Ergebnis
            um Tausende Euro: Deshalb zählen Preise und Kalender mehr als alles andere.
          </p>
          <Note>Hypothetische Zahlen zur Veranschaulichung: keine Schätzung für Ihr Haus.</Note>

          <h2>Was die Einnahmen steigert</h2>
          <ul>
            <li><strong>Täglich angepasste Preise</strong> nach Saison, Veranstaltungen und Nachfrage statt eines festen Tarifs.</li>
            <li><strong>Mehr Kanäle</strong> (Airbnb, Booking, VRBO, direkt) mit synchronisiertem Kalender.</li>
            <li><strong>Professionelle Fotos</strong> und Inserate in mehreren Sprachen, denn viele Gäste am Gardasee kommen aus dem Ausland.</li>
            <li><strong>Gute Bewertungen</strong>, die mehr Buchungen bringen und höhere Preise ermöglichen.</li>
            <li><strong>Schnelle Antworten</strong> und ein reibungsloser Check-in.</li>
          </ul>

          <h2>Und Ihr Haus?</h2>
          <p>
            Jedes Haus ist anders: Die genaue Lage, der Zustand der Immobilie und die Wochen, in denen Sie es selbst nutzen möchten, verändern das Ergebnis. Mit der
            kostenlosen Bewertung unten erhalten Sie sofort eine erste Richtzahl; danach rufen wir Sie an und rechnen gemeinsam mit echten Daten aus Ihrer Region.
          </p>
        </>
      ),
    },
  },
  cin: {
    updated: '2026-10-22',
    it: {
      title: 'CIN e SUAP per gli affitti brevi: cosa serve davvero',
      description:
        'Codice Identificativo Nazionale, SCIA al SUAP, sicurezza, Questura e tassa di soggiorno: la lista completa degli adempimenti per affittare una casa sul Lago di Garda.',
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
            <li>Indicato in <strong>ogni annuncio</strong>, su Airbnb, Booking e qualsiasi altro canale.</li>
            <li>Esposto <strong>all&apos;esterno dell&apos;edificio</strong>, in modo visibile.</li>
          </ul>
          <p>
            Le sanzioni sono pesanti: affittare senza CIN può costare da <strong>800 a 8.000 euro</strong>, mentre non esporlo o non indicarlo negli annunci da 500 a
            5.000 euro. I portali, inoltre, possono oscurare gli annunci senza codice.
          </p>

          <h2>2. I requisiti di sicurezza</h2>
          <p>Per ottenere e mantenere il CIN la casa deve avere:</p>
          <ul>
            <li>Un <strong>rilevatore di gas combustibili</strong> e di <strong>monossido di carbonio</strong> funzionanti.</li>
            <li><strong>Estintori portatili</strong> a norma, in posizione accessibile e visibile, sottoposti alle verifiche periodiche.</li>
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
    en: {
      title: 'CIN and SUAP for short-term rentals in Italy: what you really need',
      description:
        'The national CIN code, SCIA to the SUAP, safety requirements, police registration and tourist tax: the full checklist for renting out a home on Lake Garda.',
      body: (
        <>
          <p>
            Renting a second home to tourists in Italy has become easier to do and harder to do by the book. In recent years the <strong>CIN</strong>, new safety
            requirements and stricter checks on listings have arrived. Here is what you need, step by step, for a home on Lake Garda.
          </p>

          <h2>1. The CIN, Italy’s national ID code</h2>
          <p>
            The CIN (Codice Identificativo Nazionale) identifies every property rented out for tourist purposes. You apply online through the Ministry of Tourism’s{' '}
            <strong>BDSR database</strong> (Banca Dati delle Strutture Ricettive), logging in with SPID or CIE, the Italian digital identity. Homes that already had a
            regional code (Veneto and Lombardy have had one for years) usually get their CIN starting from it.
          </p>
          <p>Once you have it, the CIN must be:</p>
          <ul>
            <li>Shown in <strong>every listing</strong>, on Airbnb, Booking and any other channel.</li>
            <li>Displayed <strong>outside the building</strong>, where it can be seen.</li>
          </ul>
          <p>
            Fines are steep: renting without a CIN can cost <strong>€800 to €8,000</strong>, and failing to display it or to show it in listings €500 to €5,000.
            Platforms can also hide listings without a code.
          </p>

          <h2>2. Safety requirements</h2>
          <p>To obtain and keep the CIN, the home must have:</p>
          <ul>
            <li>Working <strong>flammable gas</strong> and <strong>carbon monoxide detectors</strong>.</li>
            <li>Compliant <strong>portable fire extinguishers</strong>, easy to reach and visible, with periodic checks.</li>
          </ul>
          <p>It’s a small expense, but it has to be done before the listing goes live: missing devices are fined separately.</p>

          <h2>3. SUAP and SCIA: when you need them</h2>
          <p>
            If you rent <strong>as a private individual</strong> (a few properties, no hotel-style services), you usually don’t need a SCIA: the CIN, any notices
            to the municipality or the regional portal, and the steps below are enough.
          </p>
          <p>
            If the activity is <strong>a business</strong>, for example with several properties or hotel-style services, you need a <strong>SCIA</strong> (a
            certified notice of start of activity) filed with the municipality’s <strong>SUAP</strong>, its one-stop shop for businesses. If you have several homes
            to rent out, check with the municipality which case applies to you before publishing your listings.
          </p>

          <h2>4. What to do for every stay</h2>
          <ul>
            <li>
              <strong>Police registration</strong>: every guest’s details must be sent to the Questura through the Alloggiati Web portal within 24 hours of
              arrival (immediately for one-day stays).
            </li>
            <li><strong>ISTAT data</strong>: arrivals and overnight stays must be reported regularly through the regional portal.</li>
            <li>
              <strong>Tourist tax</strong>: each municipality sets its own amounts and exemptions. It must be collected from guests (unless the platform already
              does it) and paid to the municipality with the related returns.
            </li>
            <li>
              <strong>Guest identification</strong>: the authorities expect hosts to check their guests’ identity; key boxes with no identification at all have
              been challenged.
            </li>
          </ul>

          <h2>Who takes care of it?</h2>
          <p>
            You can handle everything yourself, but it takes time and precision: a mistake with the police registration or the tourist tax can be costly. With
            Herocasa we handle these steps for you, from the CIN to the notices for each stay, and you get a summary every month.
          </p>
          <Note>
            Rules on short-term and tourist rentals change often and vary from region to region. This guide is for information only: for your specific
            situation, check with the municipality or your advisor.
          </Note>
        </>
      ),
    },
    de: {
      title: 'CIN und SUAP für Ferienvermietung in Italien: was Sie wirklich brauchen',
      description:
        'Nationaler CIN-Code, SCIA beim SUAP, Sicherheitsvorschriften, Meldung an die Questura und Kurtaxe: die vollständige Checkliste für die Vermietung eines Hauses am Gardasee.',
      body: (
        <>
          <p>
            Eine Zweitwohnung an Urlauber zu vermieten ist in Italien einfacher geworden, sie vorschriftsmäßig zu vermieten dagegen komplizierter. In den letzten
            Jahren kamen der <strong>CIN</strong>, neue Sicherheitspflichten und strengere Kontrollen der Inserate hinzu. Hier sehen Sie der Reihe nach, was Sie für
            ein Haus am Gardasee brauchen.
          </p>

          <h2>1. Der CIN, der nationale Identifikationscode</h2>
          <p>
            Der CIN (Codice Identificativo Nazionale) kennzeichnet jede Immobilie, die zu touristischen Zwecken vermietet wird. Er wird online über die Datenbank{' '}
            <strong>BDSR</strong> (Banca Dati delle Strutture Ricettive) des Tourismusministeriums beantragt, mit Anmeldung über SPID oder CIE, die italienische
            digitale Identität. Häuser, die bereits einen regionalen Code hatten (in Venetien und der Lombardei gibt es ihn seit Langem), erhalten den CIN in der
            Regel auf dieser Grundlage.
          </p>
          <p>Sobald Sie ihn haben, muss der CIN:</p>
          <ul>
            <li>In <strong>jedem Inserat</strong> angegeben werden, auf Airbnb, Booking und jedem anderen Kanal.</li>
            <li><strong>Außen am Gebäude</strong> gut sichtbar angebracht werden.</li>
          </ul>
          <p>
            Die Strafen sind hoch: Vermieten ohne CIN kann <strong>800 bis 8.000 Euro</strong> kosten, das fehlende Anbringen oder Angeben in den Inseraten 500 bis
            5.000 Euro. Außerdem können die Portale Inserate ohne Code ausblenden.
          </p>

          <h2>2. Sicherheitsvorschriften</h2>
          <p>Um den CIN zu erhalten und zu behalten, braucht das Haus:</p>
          <ul>
            <li>Funktionierende <strong>Gasmelder</strong> und <strong>Kohlenmonoxidmelder</strong>.</li>
            <li>Vorschriftsmäßige <strong>Feuerlöscher</strong>, gut erreichbar und sichtbar, mit regelmäßiger Prüfung.</li>
          </ul>
          <p>Die Kosten sind gering, aber alles muss vor der Veröffentlichung des Inserats erledigt sein: Fehlende Geräte werden gesondert bestraft.</p>

          <h2>3. SUAP und SCIA: wann sie nötig sind</h2>
          <p>
            Wenn Sie <strong>privat</strong> vermieten (wenige Immobilien, keine hotelähnlichen Leistungen), brauchen Sie in der Regel keine SCIA: Es genügen der
            CIN, eventuelle Meldungen an die Gemeinde oder das regionale Portal und die Pflichten der folgenden Punkte.
          </p>
          <p>
            Ist die Tätigkeit dagegen <strong>gewerblich</strong>, etwa mit mehreren Immobilien oder hotelähnlichen Leistungen, brauchen Sie eine{' '}
            <strong>SCIA</strong> (zertifizierte Meldung über den Tätigkeitsbeginn), die beim <strong>SUAP</strong> der Gemeinde eingereicht wird, der zentralen
            Anlaufstelle für Gewerbe. Wenn Sie mehrere Häuser vermieten möchten, klären Sie vor der Veröffentlichung mit der Gemeinde, welcher Fall auf Sie zutrifft.
          </p>

          <h2>4. Pflichten bei jedem Aufenthalt</h2>
          <ul>
            <li>
              <strong>Meldung an die Questura</strong>: Die Daten jedes Gastes müssen über das Portal Alloggiati Web innerhalb von 24 Stunden nach der Ankunft an die
              Polizei übermittelt werden (bei Aufenthalten von einem Tag sofort).
            </li>
            <li><strong>ISTAT-Daten</strong>: Ankünfte und Übernachtungen werden regelmäßig über das Portal der jeweiligen Region gemeldet.</li>
            <li>
              <strong>Kurtaxe</strong>: Jede Gemeinde legt Beträge und Befreiungen selbst fest. Sie wird von den Gästen erhoben (sofern das Portal es nicht schon
              tut) und mit den entsprechenden Erklärungen an die Gemeinde abgeführt.
            </li>
            <li>
              <strong>Identifizierung der Gäste</strong>: Die Behörden verlangen, die Identität der Gäste zu prüfen; Schlüsselboxen ganz ohne Identifizierung wurden
              beanstandet.
            </li>
          </ul>

          <h2>Wer kümmert sich darum?</h2>
          <p>
            Sie können alles selbst erledigen, aber es kostet Zeit und Genauigkeit: Ein Fehler bei der Meldung an die Questura oder bei der Kurtaxe kann teuer
            werden. Bei Herocasa übernehmen wir diese Aufgaben für Sie, vom CIN bis zu den Meldungen bei jedem Aufenthalt, und Sie erhalten jeden Monat eine
            Zusammenfassung.
          </p>
          <Note>
            Die Regeln für Kurzzeit- und Ferienvermietung ändern sich häufig und unterscheiden sich von Region zu Region. Dieser Ratgeber dient nur der Information:
            Für Ihre konkrete Situation fragen Sie bitte bei der Gemeinde oder Ihrem Berater nach.
          </Note>
        </>
      ),
    },
  },
};
