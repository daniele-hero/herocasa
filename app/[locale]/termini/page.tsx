import type { ReactNode } from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import { setRequestLocale } from 'next-intl/server';

type Copy = { eyebrow: string; title: ReactNode; lede: string; updated: string; body: ReactNode };

const gold = (t: string) => <em className="italic text-[var(--gold-dark)]">{t}</em>;
const mail = <a href="mailto:info@herocasa.it">info@herocasa.it</a>;

const COPY = (locale: string): Copy =>
  ({
    it: {
      eyebrow: "Termini e condizioni d'uso",
      title: <>Le {gold('regole del gioco.')}</>,
      lede: "Le condizioni che disciplinano l'uso di questo sito. Sono qui per chiarezza, non per formalismo.",
      updated: '21 ottobre 2026',
      body: (
        <>
          <h2>1. Titolare del sito</h2>
          <p>Questo sito è gestito da <strong>Herocasa</strong> — P.IVA 02668020205 (di seguito &quot;Herocasa&quot;). Per qualsiasi comunicazione: {mail}.</p>
          <h2>2. Oggetto</h2>
          <p>Le presenti condizioni disciplinano l&apos;uso del sito herocasa.it, che presenta i servizi di gestione di affitti brevi offerti da Herocasa ai proprietari di seconde case sul Lago di Garda.</p>
          <p>Il sito non è un servizio di prenotazione turistica. I servizi di gestione, i corrispettivi e le condizioni contrattuali sono disciplinati da accordi scritti tra Herocasa e ciascun proprietario.</p>
          <h2>3. Richiesta di valutazione o di chiamata</h2>
          <p>La compilazione dei moduli del sito non costituisce un contratto né un impegno reciproco: è una richiesta di essere ricontattati. La stima mostrata sul sito è prudenziale, indicativa e non vincolante; la valutazione completa viene presentata entro 48 ore lavorative.</p>
          <h2>4. Contenuti del sito</h2>
          <p>I contenuti (testi, immagini, dati numerici, loghi) sono di proprietà di Herocasa o dei rispettivi titolari e sono protetti dalle norme sul diritto d&apos;autore. Non è consentita la riproduzione, anche parziale, senza autorizzazione scritta.</p>
          <p>I dati statistici (occupazione, rendimenti, numero di immobili in gestione) sono indicativi e riferiti al portafoglio Herocasa alla data dell&apos;ultimo aggiornamento del sito. I risultati passati non garantiscono risultati futuri.</p>
          <h2>5. Limitazioni di responsabilità</h2>
          <p>Herocasa cura la correttezza delle informazioni pubblicate, ma non garantisce che siano prive di errori, complete o costantemente aggiornate, e non risponde di interruzioni tecniche del sito o di danni derivanti da un uso improprio.</p>
          <h2>6. Foro competente</h2>
          <p>Per qualsiasi controversia relativa all&apos;uso del sito è competente il Foro di Verona, salvo diverse norme inderogabili a tutela del consumatore.</p>
          <h2>7. Modifiche</h2>
          <p>Herocasa può modificare in qualsiasi momento le presenti condizioni, dandone comunicazione tramite pubblicazione sul sito.</p>
        </>
      ),
    },
    en: {
      eyebrow: 'Terms of use',
      title: <>The {gold('ground rules.')}</>,
      lede: 'The terms that govern the use of this website. They are here for clarity, not formality.',
      updated: '21 October 2026',
      body: (
        <>
          <h2>1. Website owner</h2>
          <p>This website is run by <strong>Herocasa</strong> — VAT no. IT02668020205 (&quot;Herocasa&quot;). For any request: {mail}.</p>
          <h2>2. Purpose</h2>
          <p>These terms govern the use of herocasa.it, which presents the short-term rental management services Herocasa offers to owners of second homes on Lake Garda.</p>
          <p>The website is not a holiday booking service. Management services, fees and contract terms are governed by written agreements between Herocasa and each owner.</p>
          <h2>3. Valuation or call requests</h2>
          <p>Filling in the forms on this website is neither a contract nor a mutual commitment: it is a request to be contacted. The estimate shown on the site is conservative, indicative and non-binding; the full valuation is presented within 48 working hours.</p>
          <h2>4. Website content</h2>
          <p>The content (texts, images, figures, logos) belongs to Herocasa or the respective owners and is protected by copyright. It may not be reproduced, even in part, without written permission.</p>
          <p>Statistics (occupancy, returns, number of properties managed) are indicative and refer to the Herocasa portfolio at the date of the latest website update. Past results do not guarantee future results.</p>
          <h2>5. Limitation of liability</h2>
          <p>Herocasa takes care to publish accurate information but does not guarantee it is error-free, complete or always up to date, and is not liable for technical interruptions of the website or damage arising from improper use.</p>
          <h2>6. Jurisdiction</h2>
          <p>Any dispute relating to the use of this website falls under the jurisdiction of the Court of Verona, without prejudice to mandatory consumer-protection rules.</p>
          <h2>7. Changes</h2>
          <p>Herocasa may change these terms at any time by publishing the new version on this website.</p>
        </>
      ),
    },
    de: {
      eyebrow: 'Nutzungsbedingungen',
      title: <>Die {gold('Spielregeln.')}</>,
      lede: 'Die Bedingungen für die Nutzung dieser Website. Sie dienen der Klarheit, nicht der Förmlichkeit.',
      updated: '21. Oktober 2026',
      body: (
        <>
          <h2>1. Betreiber der Website</h2>
          <p>Diese Website wird von <strong>Herocasa</strong> betrieben — USt-IdNr. IT02668020205 („Herocasa“). Für alle Anliegen: {mail}.</p>
          <h2>2. Gegenstand</h2>
          <p>Diese Bedingungen regeln die Nutzung von herocasa.it. Die Website stellt die Dienstleistungen zur Verwaltung von Ferienvermietungen vor, die Herocasa Eigentümern von Zweitwohnsitzen am Gardasee anbietet.</p>
          <p>Die Website ist kein Buchungsportal für Urlauber. Verwaltungsleistungen, Vergütung und Vertragsbedingungen werden in schriftlichen Vereinbarungen zwischen Herocasa und dem jeweiligen Eigentümer geregelt.</p>
          <h2>3. Bewertungs- oder Rückrufanfragen</h2>
          <p>Das Ausfüllen der Formulare ist weder ein Vertrag noch eine gegenseitige Verpflichtung, sondern eine Bitte um Kontaktaufnahme. Die auf der Website angezeigte Schätzung ist vorsichtig, unverbindlich und dient nur der Orientierung; die vollständige Bewertung erhalten Sie innerhalb von 48 Arbeitsstunden.</p>
          <h2>4. Inhalte der Website</h2>
          <p>Die Inhalte (Texte, Bilder, Zahlen, Logos) gehören Herocasa oder den jeweiligen Rechteinhabern und sind urheberrechtlich geschützt. Eine auch nur teilweise Vervielfältigung ist ohne schriftliche Genehmigung nicht gestattet.</p>
          <p>Statistische Angaben (Auslastung, Erträge, Anzahl verwalteter Immobilien) sind Richtwerte und beziehen sich auf das Herocasa-Portfolio zum Zeitpunkt der letzten Aktualisierung der Website. Vergangene Ergebnisse garantieren keine künftigen.</p>
          <h2>5. Haftungsbeschränkung</h2>
          <p>Herocasa achtet auf korrekte Informationen, garantiert jedoch nicht, dass sie fehlerfrei, vollständig oder stets aktuell sind, und haftet nicht für technische Unterbrechungen der Website oder Schäden aus unsachgemäßer Nutzung.</p>
          <h2>6. Gerichtsstand</h2>
          <p>Für Streitigkeiten im Zusammenhang mit der Nutzung der Website ist das Gericht Verona zuständig, unbeschadet zwingender Verbraucherschutzvorschriften.</p>
          <h2>7. Änderungen</h2>
          <p>Herocasa kann diese Bedingungen jederzeit ändern; die neue Fassung wird auf der Website veröffentlicht.</p>
        </>
      ),
    },
  })[locale] ?? COPY('it');

export default async function TerminiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY(locale);

  return (
    <PolicyLayout locale={locale} eyebrow={c.eyebrow} title={c.title} lede={c.lede} lastUpdated={c.updated}>
      {c.body}
    </PolicyLayout>
  );
}
