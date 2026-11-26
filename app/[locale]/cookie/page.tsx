import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import { setRequestLocale } from 'next-intl/server';
import { policyMetadata } from '@/lib/policy-metadata';

type Copy = { eyebrow: string; title: ReactNode; lede: string; updated: string; body: ReactNode };

const gold = (t: string) => <em className="italic text-[var(--gold-dark)]">{t}</em>;
const metaLink = (label: string) => (
  <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
    {label}
  </a>
);

const googleLink = (label: string) => (
  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
    {label}
  </a>
);

const COPY = (locale: string): Copy =>
  ({
    it: {
      eyebrow: 'Cookie policy',
      title: <>Cookie: {gold('cosa sono e cosa usiamo.')}</>,
      lede: 'Usiamo solo i cookie strettamente necessari al funzionamento del sito e, se ci autorizzate, il Meta Pixel e il tag di Google Ads per misurare le nostre campagne. Nessuna casella è pre-selezionata: decidete voi.',
      updated: '26 novembre 2026',
      body: (
        <>
          <h2>1. Cosa sono i cookie</h2>
          <p>I cookie e le tecnologie simili (come il local storage del browser) sono piccoli file che i siti salvano sul vostro dispositivo per funzionare, ricordare le vostre preferenze o raccogliere statistiche.</p>

          <h2>2. Quali cookie usa questo sito</h2>
          <h3>Tecnici (sempre attivi)</h3>
          <p>Necessari al funzionamento del sito, non richiedono consenso:</p>
          <ul>
            <li>memoria della vostra scelta sui cookie</li>
            <li>preferenza di lingua (IT / EN / DE)</li>
            <li>cookie di sicurezza che il nostro fornitore di hosting, Cloudflare, può impostare per proteggere il sito da traffico malevolo</li>
          </ul>

          <h3>Analitici (con consenso)</h3>
          <p>Al momento il sito non utilizza cookie analitici. Se in futuro li attiveremo, verranno caricati solo dopo il vostro consenso.</p>

          <h3>Marketing (con consenso)</h3>
          <p>
            Con il vostro consenso carichiamo il Meta Pixel (Facebook/Instagram) per misurare l&apos;efficacia delle nostre campagne pubblicitarie. Se inviate
            un modulo dopo aver accettato questi cookie, comunichiamo a Meta anche l&apos;avvenuta richiesta, con email e telefono in forma cifrata (hash). Senza
            consenso il Pixel non viene caricato e nessun dato viene inviato a Meta. Per sapere come Meta tratta questi dati consultate l&apos;
            {metaLink('informativa privacy di Meta')}.
          </p>
          <p>
            Con lo stesso consenso carichiamo anche il tag di Google Ads (Google Ireland Ltd.), per sapere quante richieste arrivano dai nostri annunci su
            Google: registra quando inviate un modulo o ci contattate via WhatsApp o telefono. A Google non inviamo i dati che scrivete nel modulo e non
            usiamo il tag per mostrarvi pubblicità personalizzata. Senza consenso il tag non viene caricato. Per sapere come Google tratta questi dati
            consultate le {googleLink('norme sulla privacy di Google')}.
          </p>

          <h2>3. Come gestire i cookie</h2>
          <p>
            Al primo accesso potete accettare tutti i cookie, rifiutarli o scegliere quali attivare con «Personalizza». Potete cambiare idea in qualsiasi momento
            dal link «Preferenze cookie» in fondo a ogni pagina, oppure dalle impostazioni del vostro browser.
          </p>

          <h2>4. Aggiornamenti</h2>
          <p>Questa cookie policy può essere aggiornata per riflettere modifiche tecniche o normative. La versione in vigore è sempre quella pubblicata su questa pagina.</p>
        </>
      ),
    },
    en: {
      eyebrow: 'Cookie policy',
      title: <>Cookies: {gold('what they are and what we use.')}</>,
      lede: 'We only use the cookies strictly needed for the site to work and, if you allow it, the Meta Pixel and the Google Ads tag to measure our ads. Nothing is pre-ticked: you decide.',
      updated: '26 November 2026',
      body: (
        <>
          <h2>1. What cookies are</h2>
          <p>Cookies and similar technologies (such as the browser&apos;s local storage) are small files that websites save on your device to work, remember your preferences or collect statistics.</p>

          <h2>2. Which cookies this website uses</h2>
          <h3>Technical (always active)</h3>
          <p>Needed for the site to work; they do not require consent:</p>
          <ul>
            <li>remembering your cookie choice</li>
            <li>language preference (IT / EN / DE)</li>
            <li>security cookies our hosting provider, Cloudflare, may set to protect the site from malicious traffic</li>
          </ul>

          <h3>Analytics (with consent)</h3>
          <p>The site does not currently use analytics cookies. If we enable them in the future, they will only load after your consent.</p>

          <h3>Marketing (with consent)</h3>
          <p>
            With your consent we load the Meta Pixel (Facebook/Instagram) to measure the effectiveness of our ads. If you submit a form after accepting these
            cookies, we also inform Meta that a request was made, with your email and phone in encrypted (hashed) form. Without consent the Pixel is not
            loaded and no data is sent to Meta. To learn how Meta handles this data, see {metaLink("Meta's privacy policy")}.
          </p>
          <p>
            With the same consent we also load the Google Ads tag (Google Ireland Ltd.), to know how many requests come from our Google ads: it records when
            you submit a form or contact us on WhatsApp or by phone. We do not send Google the details you type in the form, and we do not use the tag to
            show you personalised ads. Without consent the tag is not loaded. To learn how Google handles this data, see {googleLink("Google's privacy policy")}.
          </p>

          <h2>3. Managing cookies</h2>
          <p>
            On your first visit you can accept all cookies, reject them or choose which to allow with “Customise”. You can change your mind at any time from
            the “Cookie preferences” link at the bottom of every page, or in your browser settings.
          </p>

          <h2>4. Updates</h2>
          <p>This cookie policy may be updated to reflect technical or legal changes. The version in force is always the one published on this page.</p>
        </>
      ),
    },
    de: {
      eyebrow: 'Cookie-Richtlinie',
      title: <>Cookies: {gold('was sie sind und was wir nutzen.')}</>,
      lede: 'Wir verwenden nur die für den Betrieb der Website notwendigen Cookies und, wenn Sie zustimmen, das Meta-Pixel und das Google-Ads-Tag zur Messung unserer Werbung. Nichts ist vorausgewählt: Sie entscheiden.',
      updated: '26. November 2026',
      body: (
        <>
          <h2>1. Was Cookies sind</h2>
          <p>Cookies und ähnliche Technologien (etwa der lokale Speicher des Browsers) sind kleine Dateien, die Websites auf Ihrem Gerät speichern, um zu funktionieren, Ihre Einstellungen zu speichern oder Statistiken zu erheben.</p>

          <h2>2. Welche Cookies diese Website verwendet</h2>
          <h3>Technisch notwendig (immer aktiv)</h3>
          <p>Für den Betrieb der Website erforderlich, keine Einwilligung nötig:</p>
          <ul>
            <li>Speicherung Ihrer Cookie-Auswahl</li>
            <li>Spracheinstellung (IT / EN / DE)</li>
            <li>Sicherheits-Cookies, die unser Hosting-Anbieter Cloudflare zum Schutz vor schädlichem Datenverkehr setzen kann</li>
          </ul>

          <h3>Analyse (mit Einwilligung)</h3>
          <p>Derzeit verwendet die Website keine Analyse-Cookies. Sollten wir sie künftig aktivieren, werden sie erst nach Ihrer Einwilligung geladen.</p>

          <h3>Marketing (mit Einwilligung)</h3>
          <p>
            Mit Ihrer Einwilligung laden wir das Meta-Pixel (Facebook/Instagram), um die Wirksamkeit unserer Werbung zu messen. Wenn Sie nach der Zustimmung
            ein Formular absenden, teilen wir Meta außerdem mit, dass eine Anfrage erfolgt ist – mit E-Mail und Telefonnummer in verschlüsselter (gehashter)
            Form. Ohne Einwilligung wird das Pixel nicht geladen und es werden keine Daten an Meta gesendet. Wie Meta diese Daten verarbeitet, lesen Sie in
            der {metaLink('Datenschutzrichtlinie von Meta')}.
          </p>
          <p>
            Mit derselben Einwilligung laden wir auch das Google-Ads-Tag (Google Ireland Ltd.), um zu wissen, wie viele Anfragen über unsere Google-Anzeigen
            kommen: Es erfasst, wenn Sie ein Formular absenden oder uns per WhatsApp oder Telefon kontaktieren. Die Angaben aus dem Formular senden wir nicht
            an Google, und wir nutzen das Tag nicht für personalisierte Werbung. Ohne Einwilligung wird das Tag nicht geladen. Wie Google diese Daten
            verarbeitet, lesen Sie in der {googleLink('Datenschutzerklärung von Google')}.
          </p>

          <h2>3. Cookies verwalten</h2>
          <p>
            Beim ersten Besuch können Sie alle Cookies akzeptieren, ablehnen oder über „Anpassen“ selbst auswählen. Sie können Ihre Entscheidung jederzeit
            über den Link „Cookie-Einstellungen“ unten auf jeder Seite oder in Ihren Browsereinstellungen ändern.
          </p>

          <h2>4. Aktualisierungen</h2>
          <p>Diese Cookie-Richtlinie kann aufgrund technischer oder rechtlicher Änderungen aktualisiert werden. Es gilt stets die auf dieser Seite veröffentlichte Fassung.</p>
        </>
      ),
    },
  })[locale] ?? COPY('it');

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY(locale);
  return policyMetadata(locale, 'cookie', c.eyebrow, c.lede);
}

export default async function CookiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY(locale);

  return (
    <PolicyLayout locale={locale} eyebrow={c.eyebrow} title={c.title} lede={c.lede} lastUpdated={c.updated}>
      {c.body}
    </PolicyLayout>
  );
}
