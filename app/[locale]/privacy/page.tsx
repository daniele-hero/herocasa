import type { ReactNode } from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import { setRequestLocale } from 'next-intl/server';

type Copy = { eyebrow: string; title: ReactNode; lede: string; updated: string; body: ReactNode };

const gold = (t: string) => <em className="italic text-[var(--gold-dark)]">{t}</em>;
const mail = <a href="mailto:info@herocasa.it">info@herocasa.it</a>;

const COPY = (locale: string): Copy =>
  ({
    it: {
      eyebrow: 'Informativa privacy · art. 13 GDPR',
      title: <>Come trattiamo {gold('i vostri dati.')}</>,
      lede: 'In poche parole: raccogliamo solo ciò che serve a ricontattarvi, non lo vendiamo, potete chiedercelo indietro o farlo cancellare quando volete.',
      updated: '21 ottobre 2026',
      body: (
        <>
          <h2>1. Titolare del trattamento</h2>
          <p>Il titolare del trattamento dei dati personali raccolti tramite questo sito è <strong>Herocasa</strong> — P.IVA 02668020205. Per qualsiasi comunicazione: {mail}.</p>

          <h2>2. Dati che raccogliamo</h2>
          <p>Tramite i moduli del sito raccogliamo solo i dati necessari a ricontattarvi e a valutare il vostro immobile:</p>
          <ul>
            <li>nome e cognome</li>
            <li>numero di telefono</li>
            <li>indirizzo email (facoltativo)</li>
            <li>informazioni sull&apos;immobile (comune, tipologia, camere, servizi, note libere)</li>
            <li>eventuali comunicazioni successive che ci inviate via email, telefono o WhatsApp</li>
          </ul>

          <h2>3. Finalità e base giuridica</h2>
          <ul>
            <li>ricontattarvi e rispondere alla vostra richiesta di valutazione o di chiamata (misure precontrattuali, art. 6(1)(b) GDPR)</li>
            <li>inviarvi, se avete indicato l&apos;email, una conferma automatica della richiesta (art. 6(1)(b) GDPR)</li>
            <li>inviarvi, se avete indicato l&apos;email, al massimo tre email di follow-up sulla vostra richiesta nelle settimane successive (interesse legittimo, art. 6(1)(f) GDPR): ogni email contiene il link per non riceverne altre</li>
            <li>gestire il rapporto contrattuale, qualora decidiate di affidarci l&apos;immobile (art. 6(1)(b) GDPR)</li>
            <li>adempiere agli obblighi di legge fiscali e di comunicazione alle autorità (art. 6(1)(c) GDPR)</li>
            <li>
              solo se avete accettato i cookie di marketing: comunicare a Meta Platforms Ireland Ltd. l&apos;avvenuta richiesta, con email e telefono
              in forma cifrata (hash), per misurare l&apos;efficacia delle nostre campagne pubblicitarie (consenso, art. 6(1)(a) GDPR). Senza questo
              consenso nessun dato del modulo viene inviato a Meta.
            </li>
          </ul>
          <p>Non usiamo i vostri dati per inviarvi comunicazioni promozionali senza il vostro consenso esplicito.</p>

          <h2>4. Conservazione</h2>
          <p>Conserviamo i dati per il tempo necessario alle finalità sopra descritte e comunque non oltre 24 mesi dall&apos;ultima interazione, salvo obblighi di legge più lunghi (fatturazione, adempimenti fiscali).</p>

          <h2>5. Fornitori e trasferimenti</h2>
          <p>I vostri dati non vengono venduti né ceduti. Li trattano solo i fornitori tecnici indispensabili, in qualità di responsabili del trattamento:</p>
          <ul>
            <li>Cloudflare, Inc. — hosting del sito e gestione dei moduli</li>
            <li>Resend, Inc. — invio delle email di notifica e di conferma</li>
            <li>Aruba S.p.A. — casella di posta elettronica</li>
            <li>Meta Platforms Ireland Ltd. — solo con il consenso ai cookie di marketing (vedi punto 3)</li>
          </ul>
          <p>Alcuni di questi fornitori hanno sede negli Stati Uniti: il trasferimento avviene sulla base del Data Privacy Framework UE-USA o delle clausole contrattuali standard approvate dalla Commissione europea.</p>

          <h2>6. I vostri diritti</h2>
          <p>In qualsiasi momento potete esercitare i diritti previsti dagli articoli 15-22 del GDPR: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca del consenso. Scriveteci a {mail}: vi rispondiamo entro 30 giorni.</p>
          <p>Avete inoltre il diritto di presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</p>

          <h2>7. Cookie</h2>
          <p>Per le informazioni sui cookie utilizzati da questo sito consultate la <a href="/it/cookie">Cookie Policy</a>.</p>
        </>
      ),
    },
    en: {
      eyebrow: 'Privacy notice · Art. 13 GDPR',
      title: <>How we handle {gold('your data.')}</>,
      lede: 'In short: we only collect what we need to get back to you, we never sell it, and you can ask for a copy or have it deleted whenever you like.',
      updated: '21 October 2026',
      body: (
        <>
          <h2>1. Data controller</h2>
          <p>The controller of the personal data collected through this website is <strong>Herocasa</strong> — VAT no. IT02668020205. For any request: {mail}.</p>

          <h2>2. Data we collect</h2>
          <p>Through the forms on this website we only collect what we need to contact you and assess your property:</p>
          <ul>
            <li>first and last name</li>
            <li>phone number</li>
            <li>email address (optional)</li>
            <li>information about the property (town, type, bedrooms, amenities, free notes)</li>
            <li>any later messages you send us by email, phone or WhatsApp</li>
          </ul>

          <h2>3. Purposes and legal basis</h2>
          <ul>
            <li>contacting you and answering your valuation or call request (pre-contractual steps, Art. 6(1)(b) GDPR)</li>
            <li>sending you, if you gave us your email, an automatic confirmation of your request (Art. 6(1)(b) GDPR)</li>
            <li>sending you, if you gave us your email, up to three follow-up emails about your request over the following weeks (legitimate interest, Art. 6(1)(f) GDPR): each one contains a link to stop further emails</li>
            <li>managing the contract, should you decide to entrust us with your property (Art. 6(1)(b) GDPR)</li>
            <li>complying with tax and reporting obligations (Art. 6(1)(c) GDPR)</li>
            <li>
              only if you accepted marketing cookies: informing Meta Platforms Ireland Ltd. that a request was made, with your email and phone in
              encrypted (hashed) form, to measure the effectiveness of our ads (consent, Art. 6(1)(a) GDPR). Without that consent, no form data is
              sent to Meta.
            </li>
          </ul>
          <p>We do not use your data to send you promotional messages without your explicit consent.</p>

          <h2>4. Retention</h2>
          <p>We keep your data for as long as needed for the purposes above and in any case no longer than 24 months after our last contact, unless the law requires longer (invoicing, tax obligations).</p>

          <h2>5. Providers and transfers</h2>
          <p>Your data is never sold or passed on. It is processed only by the technical providers we need, acting as data processors:</p>
          <ul>
            <li>Cloudflare, Inc. — website hosting and form handling</li>
            <li>Resend, Inc. — sending notification and confirmation emails</li>
            <li>Aruba S.p.A. — email mailbox</li>
            <li>Meta Platforms Ireland Ltd. — only with your consent to marketing cookies (see section 3)</li>
          </ul>
          <p>Some of these providers are based in the United States: transfers rely on the EU-US Data Privacy Framework or on the Standard Contractual Clauses approved by the European Commission.</p>

          <h2>6. Your rights</h2>
          <p>At any time you can exercise your rights under Articles 15-22 GDPR: access, rectification, erasure, restriction, portability, objection and withdrawal of consent. Write to {mail}: we reply within 30 days.</p>
          <p>You also have the right to lodge a complaint with the Italian Data Protection Authority (garanteprivacy.it).</p>

          <h2>7. Cookies</h2>
          <p>For information on the cookies used by this website, see our <a href="/en/cookie">Cookie Policy</a>.</p>
        </>
      ),
    },
    de: {
      eyebrow: 'Datenschutzerklärung · Art. 13 DSGVO',
      title: <>Wie wir mit {gold('Ihren Daten umgehen.')}</>,
      lede: 'Kurz gesagt: Wir erheben nur, was wir brauchen, um Sie zu kontaktieren, wir verkaufen nichts, und Sie können Ihre Daten jederzeit einsehen oder löschen lassen.',
      updated: '21. Oktober 2026',
      body: (
        <>
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlich für die über diese Website erhobenen personenbezogenen Daten ist <strong>Herocasa</strong> — USt-IdNr. IT02668020205. Für alle Anliegen: {mail}.</p>

          <h2>2. Welche Daten wir erheben</h2>
          <p>Über die Formulare dieser Website erheben wir nur die Daten, die wir benötigen, um Sie zu kontaktieren und Ihre Immobilie zu bewerten:</p>
          <ul>
            <li>Vor- und Nachname</li>
            <li>Telefonnummer</li>
            <li>E-Mail-Adresse (optional)</li>
            <li>Angaben zur Immobilie (Gemeinde, Art, Schlafzimmer, Ausstattung, freie Anmerkungen)</li>
            <li>spätere Nachrichten, die Sie uns per E-Mail, Telefon oder WhatsApp senden</li>
          </ul>

          <h2>3. Zwecke und Rechtsgrundlage</h2>
          <ul>
            <li>Kontaktaufnahme und Beantwortung Ihrer Bewertungs- oder Rückrufanfrage (vorvertragliche Maßnahmen, Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>automatische Bestätigung Ihrer Anfrage, sofern Sie eine E-Mail-Adresse angegeben haben (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>bis zu drei Folge-E-Mails zu Ihrer Anfrage in den Wochen danach, sofern Sie eine E-Mail-Adresse angegeben haben (berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO): Jede E-Mail enthält einen Link, um keine weiteren zu erhalten</li>
            <li>Abwicklung des Vertrags, falls Sie uns Ihre Immobilie anvertrauen (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Erfüllung steuerlicher und behördlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO)</li>
            <li>
              nur wenn Sie Marketing-Cookies akzeptiert haben: Mitteilung an Meta Platforms Ireland Ltd., dass eine Anfrage erfolgt ist, mit E-Mail
              und Telefonnummer in verschlüsselter (gehashter) Form, um die Wirksamkeit unserer Werbung zu messen (Einwilligung, Art. 6 Abs. 1 lit. a
              DSGVO). Ohne diese Einwilligung werden keine Formulardaten an Meta übermittelt.
            </li>
          </ul>
          <p>Ohne Ihre ausdrückliche Einwilligung nutzen wir Ihre Daten nicht für Werbenachrichten.</p>

          <h2>4. Speicherdauer</h2>
          <p>Wir speichern die Daten so lange, wie es für die genannten Zwecke erforderlich ist, höchstens jedoch 24 Monate nach dem letzten Kontakt, sofern keine längeren gesetzlichen Fristen gelten (Rechnungsstellung, Steuerpflichten).</p>

          <h2>5. Dienstleister und Übermittlungen</h2>
          <p>Ihre Daten werden weder verkauft noch weitergegeben. Sie werden nur von den notwendigen technischen Dienstleistern als Auftragsverarbeiter verarbeitet:</p>
          <ul>
            <li>Cloudflare, Inc. — Hosting der Website und Verarbeitung der Formulare</li>
            <li>Resend, Inc. — Versand der Benachrichtigungs- und Bestätigungs-E-Mails</li>
            <li>Aruba S.p.A. — E-Mail-Postfach</li>
            <li>Meta Platforms Ireland Ltd. — nur mit Ihrer Einwilligung in Marketing-Cookies (siehe Punkt 3)</li>
          </ul>
          <p>Einige dieser Dienstleister haben ihren Sitz in den USA: Die Übermittlung erfolgt auf Grundlage des EU-US Data Privacy Framework oder der Standardvertragsklauseln der Europäischen Kommission.</p>

          <h2>6. Ihre Rechte</h2>
          <p>Sie können jederzeit Ihre Rechte nach Art. 15-22 DSGVO ausüben: Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Widerruf der Einwilligung. Schreiben Sie an {mail}: Wir antworten innerhalb von 30 Tagen.</p>
          <p>Sie haben außerdem das Recht, sich bei der italienischen Datenschutzbehörde (garanteprivacy.it) zu beschweren.</p>

          <h2>7. Cookies</h2>
          <p>Informationen zu den auf dieser Website verwendeten Cookies finden Sie in unserer <a href="/de/cookie">Cookie-Richtlinie</a>.</p>
        </>
      ),
    },
  })[locale] ?? COPY('it');

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY(locale);

  return (
    <PolicyLayout locale={locale} eyebrow={c.eyebrow} title={c.title} lede={c.lede} lastUpdated={c.updated}>
      {c.body}
    </PolicyLayout>
  );
}
