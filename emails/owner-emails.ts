/**
 * Emails sent to owners after a form: the immediate confirmation and the three
 * follow-ups (day 2, 7, 16), in IT/EN/DE. Used by functions/api/valuation-request.ts.
 *
 * The follow-ups are generic on purpose: they may land before or after the call,
 * the valuation or a site visit, and the team doesn't stop them by hand.
 * Testimonials come from the site copy (messages/*.json) so they stay in sync.
 */
import it from '../messages/it.json';
import en from '../messages/en.json';
import de from '../messages/de.json';

export type EmailLocale = 'it' | 'en' | 'de';
export const emailLocale = (l?: string): EmailLocale => (l === 'en' || l === 'de' ? l : 'it');

export type OwnerLead = {
  name?: string;
  phone?: string;
  zone?: string;
  type?: string;
  rooms?: string | number;
  features?: string[];
  estimatedRange?: { min: number; max: number };
  locale?: string;
};

export type Email = { subject: string; html: string };

const SITE = 'https://herocasa.it';
const PHONE = '+39 366 369 5252';
const MAIL = 'info@herocasa.it';
const C = { olive: '#1E4D42', paper: '#F6F1E4', marble: '#EAE3D0', gold: '#B8925A', goldDark: '#8B6F44', stone: '#6B6A5C', line: '#D9D2BE' };
const SANS = 'Arial,Helvetica,sans-serif';
// Single quotes inside: these strings go into style="..." attributes.
const SERIF = "Georgia,'Times New Roman',serif";

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const firstName = (lead: OwnerLead) => esc((lead.name || '').trim().split(/\s+/)[0] || '');

// ---------- building blocks (tables + inline styles: what email clients understand) ----------

const h1 = (t: string) => `<h1 style="font-family:${SERIF};font-weight:normal;font-size:28px;line-height:1.2;color:${C.olive};margin:0 0 18px">${t}</h1>`;
const h2 = (t: string) => `<h2 style="font-family:${SERIF};font-weight:normal;font-size:21px;line-height:1.3;color:${C.olive};margin:30px 0 12px">${t}</h2>`;
const p = (t: string, extra = '') => `<p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${C.olive};margin:0 0 14px;${extra}">${t}</p>`;
const small = (t: string) => `<p style="font-family:${SANS};font-size:12px;line-height:1.6;color:${C.stone};margin:0 0 8px">${t}</p>`;
// Herocasa green: dark enough that Gmail's dark mode leaves it alone (the gold button
// turned dull brown with dark text there); white text, 9.6:1.
const btn = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px"><tr><td bgcolor="${C.olive}" style="background:${C.olive};border-radius:3px"><a href="${href}" style="display:inline-block;padding:14px 24px;font-family:${SANS};font-size:14px;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:#FFFFFF;text-decoration:none">${label}</a></td></tr></table>`;
const link = (href: string, label: string) => `<a href="${href}" style="color:${C.goldDark};text-decoration:underline">${label}</a>`;

const bullets = (items: string[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px">${items
    .map(
      (it) =>
        `<tr><td valign="top" style="width:20px;font-family:${SERIF};font-size:18px;line-height:1.4;color:${C.gold}">·</td><td style="font-family:${SANS};font-size:15px;line-height:1.6;color:${C.olive};padding:0 0 8px">${it}</td></tr>`,
    )
    .join('')}</table>`;

const steps = (items: string[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px">${items
    .map(
      (it, i) =>
        `<tr><td valign="top" style="width:34px;font-family:${SERIF};font-style:italic;font-size:22px;line-height:1.2;color:${C.gold}">${String(i + 1).padStart(2, '0')}</td><td style="font-family:${SANS};font-size:15px;line-height:1.6;color:${C.olive};padding:0 0 12px">${it}</td></tr>`,
    )
    .join('')}</table>`;

/** Two-column recap of what the owner entered (only the fields they filled in). */
const summary = (rows: Array<[string, string]>) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${C.marble};margin:4px 0 16px">${rows
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:${i ? 8 : 16}px 18px ${i === rows.length - 1 ? 16 : 8}px;font-family:${SANS};font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${C.stone};width:38%;vertical-align:top">${k}</td><td style="padding:${i ? 8 : 16}px 18px ${i === rows.length - 1 ? 16 : 8}px 0;font-family:${SANS};font-size:15px;color:${C.olive}">${v}</td></tr>`,
    )
    .join('')}</table>`;

const quote = (text: string, who: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 18px"><tr><td style="border-left:3px solid ${C.gold};padding:2px 0 2px 16px"><p style="font-family:${SERIF};font-style:italic;font-size:17px;line-height:1.55;color:${C.olive};margin:0 0 8px">“${esc(text)}”</p><p style="font-family:${SANS};font-size:12px;letter-spacing:.04em;color:${C.stone};margin:0">${esc(who)}</p></td></tr></table>`;

const qa = (q: string, a: string) =>
  `<p style="font-family:${SERIF};font-size:18px;line-height:1.35;color:${C.olive};margin:22px 0 6px">${q}</p>${p(a)}`;

// ---------- copy ----------

const GUIDES: Record<EmailLocale, Array<[string, string]>> = {
  // Same URLs as lib/guide-links.ts (not imported: it pulls next-intl into the worker).
  it: [
    ['Quanto rende una casa sul Lago di Garda', `${SITE}/it/guide/quanto-rende-casa-lago-di-garda`],
    ['Gestire da soli o affidarsi a un gestore?', `${SITE}/it/guide/gestire-da-soli-o-con-un-gestore`],
  ],
  en: [
    ['How much can a Lake Garda home earn?', `${SITE}/en/guide/how-much-lake-garda-home-earns`],
    ['Self-manage or hire a property manager?', `${SITE}/en/guide/self-manage-or-property-manager`],
  ],
  de: [
    ['Was bringt ein Ferienhaus am Gardasee?', `${SITE}/de/ratgeber/was-bringt-ferienhaus-gardasee`],
    ['Selbst vermieten oder einen Verwalter beauftragen?', `${SITE}/de/ratgeber/selbst-vermieten-oder-verwalter`],
  ],
};

const TESTIMONIALS: Record<EmailLocale, Array<{ quote: string; author: string; role: string }>> = {
  it: it.testimonials,
  en: en.testimonials,
  de: de.testimonials,
};

const COMMON = {
  it: {
    signoff: 'A presto,<br>il team Herocasa',
    tagline: 'Gestione affitti brevi · Lago di Garda',
    contactsTitle: 'Per qualsiasi cosa',
    phoneLabel: 'Telefono e WhatsApp',
    hours: 'Lun–Ven 9:00–18:00 · Sab 9:00–17:00',
    footer: 'Hai ricevuto questa email perché hai chiesto una valutazione su herocasa.it.',
    stop: 'Non voglio ricevere altre email su questa richiesta',
    wa: 'Scrivici su WhatsApp',
    waText: 'Ciao, ho compilato il modulo sul sito Herocasa',
  },
  en: {
    signoff: 'Speak soon,<br>the Herocasa team',
    tagline: 'Short-term rental management · Lake Garda',
    contactsTitle: 'For anything at all',
    phoneLabel: 'Phone and WhatsApp',
    hours: 'Mon–Fri 9:00–18:00 · Sat 9:00–17:00 (Italian time)',
    footer: 'You received this email because you asked for a valuation on herocasa.it.',
    stop: 'I do not want further emails about this request',
    wa: 'Message us on WhatsApp',
    waText: 'Hi, I filled in the form on the Herocasa website',
  },
  de: {
    signoff: 'Bis bald,<br>Ihr Herocasa-Team',
    tagline: 'Ferienhaus-Verwaltung · Gardasee',
    contactsTitle: 'Für alle Fragen',
    phoneLabel: 'Telefon und WhatsApp',
    hours: 'Mo–Fr 9:00–18:00 · Sa 9:00–17:00 (italienische Zeit)',
    footer: 'Sie erhalten diese E-Mail, weil Sie auf herocasa.it eine Bewertung angefragt haben.',
    stop: 'Ich möchte keine weiteren E-Mails zu dieser Anfrage',
    wa: 'Auf WhatsApp schreiben',
    waText: 'Hallo, ich habe das Formular auf der Herocasa-Website ausgefüllt',
  },
} as const;

const waHref = (l: EmailLocale) => `https://wa.me/393663695252?text=${encodeURIComponent(COMMON[l].waText)}`;

/** Full email: preheader, logo, body, signature, contacts box, footer with the optional stop link. */
function layout(l: EmailLocale, preheader: string, body: string, stopHref?: string): string {
  const c = COMMON[l];
  return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>Herocasa</title></head>
<body style="margin:0;padding:0;background:${C.marble}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.marble}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.paper}">
  <tr><td align="center" style="padding:20px 36px 18px;border-bottom:1px solid ${C.line}">
    <!-- logo-email.png: the logo cropped to its content (460px) on a solid paper background,
         so Gmail's dark mode can't put its green text on black -->
    <a href="${SITE}/${l}" style="text-decoration:none"><img src="${SITE}/logo-email.png?v=2" width="230" height="77" alt="Herocasa — Affitti brevi" style="display:block;margin:0 auto;border:0;width:230px;max-width:70%;height:auto"></a>
  </td></tr>
  <tr><td style="padding:32px 36px 12px">
    ${body}
    <p style="font-family:${SERIF};font-size:17px;line-height:1.5;color:${C.olive};margin:26px 0 4px">${c.signoff}</p>
    <p style="font-family:${SANS};font-size:12px;letter-spacing:.06em;color:${C.stone};margin:0 0 24px">${c.tagline}</p>
  </td></tr>
  <tr><td style="padding:24px 36px;background:${C.olive}">
    <p style="font-family:${SERIF};font-size:18px;color:${C.paper};margin:0 0 10px">${c.contactsTitle}</p>
    <p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${C.paper};margin:0">
      ${c.phoneLabel}: <a href="tel:+393663695252" style="color:${C.paper};text-decoration:none">${PHONE}</a><br>
      Email: <a href="mailto:${MAIL}" style="color:${C.paper};text-decoration:none">${MAIL}</a><br>
      <a href="${SITE}/${l}" style="color:${C.gold};text-decoration:none">herocasa.it</a> · <span style="color:#C9D5CF">${c.hours}</span>
    </p>
  </td></tr>
  <tr><td style="padding:18px 36px 26px">
    ${small(c.footer)}
    ${stopHref ? small(link(stopHref, c.stop)) : ''}
    ${small('Herocasa · P.IVA 02668020205')}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ---------- confirmation ----------

const CONFIRMATION = {
  it: {
    subject: 'Abbiamo ricevuto la tua richiesta — Herocasa',
    preheader: 'Ti chiamiamo entro 48 ore. Ecco il riepilogo e i prossimi passi.',
    title: (n: string) => `Grazie${n ? `, ${n}` : ''}.`,
    intro: (z: string) => `Abbiamo ricevuto la tua richiesta${z ? ` per la casa a <strong>${z}</strong>` : ''}. Ecco il riepilogo di quello che ci hai indicato:`,
    labels: { zone: 'Comune', type: 'Tipologia', rooms: 'Camere da letto', features: 'Dotazioni', estimate: 'Stima indicativa' },
    estimate: (x: string) => `fino a <strong>${x} €</strong> all’anno`,
    estimateNote: 'È un primo valore indicativo, calcolato su comune, tipologia e dotazioni. La cifra precisa la costruiamo insieme, con i dati reali di case simili alla tua.',
    nextTitle: 'Cosa succede adesso',
    steps: (phone: string) => [
      `<strong>Ti chiamiamo entro 48 ore</strong>${phone ? ` al numero ${phone}` : ''}, per conoscere la casa e capire come vorresti usarla.`,
      '<strong>Prepariamo la valutazione</strong> con i dati della tua zona: prezzi, occupazione e stagionalità di case simili.',
      '<strong>Se ti convince</strong>, fissiamo un sopralluogo gratuito e ti mandiamo una proposta scritta. Senza impegno.',
    ],
    sooner: 'Vuoi sentirci prima? Scrivici quando vuoi: ti risponde direttamente una persona del nostro team.',
    readTitle: 'Nel frattempo, se ti va di approfondire',
  },
  en: {
    subject: 'We received your request — Herocasa',
    preheader: 'We will call you within 48 hours. Here is your summary and what happens next.',
    title: (n: string) => `Thank you${n ? `, ${n}` : ''}.`,
    intro: (z: string) => `We have received your request${z ? ` for your home in <strong>${z}</strong>` : ''}. Here is a summary of what you told us:`,
    labels: { zone: 'Town', type: 'Property type', rooms: 'Bedrooms', features: 'Features', estimate: 'Indicative estimate' },
    estimate: (x: string) => `up to <strong>€${x}</strong> a year`,
    estimateNote: 'This is a first indicative figure, based on town, property type and features. We will work out the precise figure together, using real data from homes like yours.',
    nextTitle: 'What happens next',
    steps: (phone: string) => [
      `<strong>We call you within 48 hours</strong>${phone ? ` on ${phone}` : ''}, to get to know the home and how you would like to use it.`,
      '<strong>We prepare the valuation</strong> using data from your area: prices, occupancy and seasonality of similar homes.',
      '<strong>If it convinces you</strong>, we arrange a free site visit and send you a written proposal. No obligation.',
    ],
    sooner: 'Would you like to talk sooner? Message us any time: a member of our team will answer you directly.',
    readTitle: 'Meanwhile, if you would like to read more',
  },
  de: {
    subject: 'Wir haben Ihre Anfrage erhalten — Herocasa',
    preheader: 'Wir rufen Sie innerhalb von 48 Stunden an. Hier Ihre Zusammenfassung und die nächsten Schritte.',
    title: (n: string) => `Vielen Dank${n ? `, ${n}` : ''}.`,
    intro: (z: string) => `Wir haben Ihre Anfrage${z ? ` für Ihr Haus in <strong>${z}</strong>` : ''} erhalten. Hier die Zusammenfassung Ihrer Angaben:`,
    labels: { zone: 'Gemeinde', type: 'Objektart', rooms: 'Schlafzimmer', features: 'Ausstattung', estimate: 'Erste Schätzung' },
    estimate: (x: string) => `bis zu <strong>${x} €</strong> im Jahr`,
    estimateNote: 'Das ist ein erster Richtwert auf Basis von Gemeinde, Objektart und Ausstattung. Den genauen Betrag ermitteln wir gemeinsam mit echten Daten vergleichbarer Häuser.',
    nextTitle: 'Wie es jetzt weitergeht',
    steps: (phone: string) => [
      `<strong>Wir rufen Sie innerhalb von 48 Stunden an</strong>${phone ? ` unter ${phone}` : ''}, um Ihr Haus kennenzulernen und zu verstehen, wie Sie es nutzen möchten.`,
      '<strong>Wir erstellen die Bewertung</strong> mit Daten aus Ihrer Gegend: Preise, Auslastung und Saisonverlauf vergleichbarer Häuser.',
      '<strong>Wenn sie Sie überzeugt</strong>, vereinbaren wir eine kostenlose Besichtigung und senden Ihnen ein schriftliches Angebot. Unverbindlich.',
    ],
    sooner: 'Möchten Sie früher sprechen? Schreiben Sie uns jederzeit: Es antwortet Ihnen direkt jemand aus unserem Team.',
    readTitle: 'Falls Sie in der Zwischenzeit mehr lesen möchten',
  },
} as const;

export function confirmationEmail(lead: OwnerLead, stopHref?: string): Email {
  const l = emailLocale(lead.locale);
  const c = CONFIRMATION[l];
  const zone = lead.zone ? esc(lead.zone) : '';
  const max = lead.estimatedRange?.max;
  const rows: Array<[string, string]> = [];
  if (zone) rows.push([c.labels.zone, zone]);
  if (lead.type) rows.push([c.labels.type, esc(lead.type)]);
  if (lead.rooms) rows.push([c.labels.rooms, esc(String(lead.rooms))]);
  if (lead.features?.length) rows.push([c.labels.features, esc(lead.features.join(', '))]);
  if (max) rows.push([c.labels.estimate, c.estimate(max.toLocaleString(l === 'en' ? 'en-GB' : 'it-IT'))]);

  const body =
    h1(c.title(firstName(lead))) +
    p(c.intro(zone)) +
    (rows.length ? summary(rows) : '') +
    (max ? p(c.estimateNote, `font-size:13px;color:${C.stone}`) : '') +
    h2(c.nextTitle) +
    steps(c.steps(lead.phone ? esc(lead.phone) : '')) +
    p(c.sooner) +
    btn(waHref(l), COMMON[l].wa) +
    h2(c.readTitle) +
    bullets(GUIDES[l].map(([label, href]) => link(href, label)));

  return { subject: c.subject, html: layout(l, c.preheader, body, stopHref) };
}

// ---------- follow-ups ----------

export const FOLLOWUP_DAYS = [2, 7, 16] as const;

type FollowUpCopy = { subject: (n: string) => string; preheader: string; body: (n: string, z: string, l: EmailLocale) => string };

const hello = (l: EmailLocale, n: string) => ({ it: `Ciao${n ? ` ${n}` : ''},`, en: `Hi${n ? ` ${n}` : ''},`, de: `Guten Tag${n ? ` ${n}` : ''},` })[l];

const stories = (l: EmailLocale) =>
  [0, 2, 4]
    .map((i) => TESTIMONIALS[l][i])
    .filter(Boolean)
    .map((t) => quote(t.quote, `${t.author} · ${t.role}`))
    .join('');

const FOLLOWUPS: Record<EmailLocale, FollowUpCopy[]> = {
  it: [
    {
      subject: (n) => `${n ? `${n}, ` : ''}cosa dicono i proprietari che ci hanno affidato la casa`,
      preheader: 'Tre proprietari del Garda raccontano com’è andata.',
      body: (n, z, l) =>
        h1('Com’è andata a chi ha fatto il passo') +
        p(hello(l, n)) +
        p(`grazie ancora per averci scritto${z ? ` per la tua casa a ${z}` : ''}. Chi ci contatta di solito ha gli stessi dubbi: potrò usare la casa quando voglio? La tratteranno con cura? Ne vale davvero la pena?`) +
        p('Lasciamo rispondere chi ci ha già affidato la propria:') +
        stories(l) +
        p('Ogni casa è diversa, e la tua merita un ragionamento su misura. Per qualsiasi domanda, rispondi a questa email o scrivici su WhatsApp.') +
        btn(waHref(l), COMMON[l].wa),
    },
    {
      subject: () => 'Le 5 domande che ci fanno tutti i proprietari',
      preheader: 'Costi, uso della casa, burocrazia, danni e pagamenti: le risposte in breve.',
      body: (n, _z, l) =>
        h1('Le domande che ci fanno tutti') +
        p(hello(l, n)) +
        p('queste sono le domande che sentiamo più spesso dai proprietari, con risposte brevi e chiare.') +
        qa('Quanto costa?', 'Una percentuale sui ricavi, che trovi nella proposta prima di firmare. Nessun costo di attivazione e nessun abbonamento: se la casa non guadagna, non guadagniamo nemmeno noi.') +
        qa('Posso usare la casa quando voglio?', 'Sì, la casa resta tua. Ci indichi le date che ti servono e le blocchiamo nel calendario; più anticipo ci dai, più è facile non rinunciare a prenotazioni già arrivate.') +
        qa('Chi si occupa della burocrazia?', 'Noi: CIN, pratiche SUAP, comunicazioni alla Questura, dati ISTAT e tassa di soggiorno. Tu ricevi un riepilogo ogni mese.') +
        qa('E se un ospite rompe qualcosa?', 'Controlliamo la casa dopo ogni partenza. I piccoli danni si coprono con la cauzione, quelli più importanti con le coperture dei portali: la casa torna come l’hai affidata.') +
        qa('Come e quando ricevo i soldi?', 'Ogni mese, entro il 10, ricevi il rendiconto con prenotazioni, ricavi, costi e netto, insieme al bonifico.') +
        p(`Le altre risposte le trovi sul sito, nelle ${link(`${SITE}/it#faq`, 'domande frequenti')}. Per tutto il resto, scrivici:`, 'margin-top:22px') +
        btn(waHref(l), COMMON[l].wa),
    },
    {
      subject: (n) => `${n ? `${n}, ` : ''}siamo qui se hai domande`,
      preheader: 'Numeri, contratto, uso della casa: chiedici quello che vuoi.',
      body: (n, z, l) =>
        h1('Come procede con la tua casa?') +
        p(hello(l, n)) +
        p(`ti scriviamo per sapere come procede con la tua casa${z ? ` a ${z}` : ''}. Affidare la propria casa è una decisione da prendere con calma, e ogni proprietario ha dubbi diversi. Quelli che sentiamo più spesso:`) +
        bullets([
          '<strong>I numeri</strong>: quanto può rendere davvero, al netto dei costi.',
          '<strong>Il contratto</strong>: cosa è incluso, durata e preavviso.',
          '<strong>L’uso personale</strong>: le settimane in cui vuoi goderti la casa.',
          '<strong>La cura della casa</strong>: chi entra, chi controlla, chi interviene se serve.',
        ]) +
        p('Qualunque sia la tua domanda, rispondi a questa email o scrivici su WhatsApp: ti risponde direttamente una persona del nostro team.') +
        btn(waHref(l), COMMON[l].wa) +
        p('Questa è l’ultima email che ti mandiamo in automatico. Se ci siamo già sentiti o hai già deciso, considerala solo un saluto.', `font-size:13px;color:${C.stone}`),
    },
  ],
  en: [
    {
      subject: (n) => `${n ? `${n}, ` : ''}what owners who trusted us with their home say`,
      preheader: 'Three Lake Garda owners tell how it went.',
      body: (n, z, l) =>
        h1('How it went for those who took the step') +
        p(hello(l, n)) +
        p(`thank you again for getting in touch${z ? ` about your home in ${z}` : ''}. People who contact us usually have the same doubts: will I be able to use the home whenever I want? Will it be looked after properly? Is it really worth it?`) +
        p('We will let owners who already trusted us with their homes answer:') +
        stories(l) +
        p('Every home is different, and yours deserves a tailored assessment. For any question, reply to this email or message us on WhatsApp.') +
        btn(waHref(l), COMMON[l].wa),
    },
    {
      subject: () => 'The 5 questions every owner asks us',
      preheader: 'Costs, using the home, paperwork, damage and payments: the short answers.',
      body: (n, _z, l) =>
        h1('The questions everyone asks') +
        p(hello(l, n)) +
        p('these are the questions we hear most often from owners, with short, clear answers.') +
        qa('How much does it cost?', 'A percentage of revenue, stated in the proposal before you sign. No set-up fee and no subscription: if the home earns nothing, neither do we.') +
        qa('Can I use the home whenever I want?', 'Yes, it remains your home. Tell us the dates you need and we block them in the calendar; the more notice you give us, the easier it is not to turn down bookings already received.') +
        qa('Who handles the paperwork?', 'We do: CIN, SUAP permits, police registration, ISTAT data and tourist tax. You receive a summary every month.') +
        qa('What if a guest breaks something?', 'We check the home after every departure. Small damage is covered by the deposit, bigger damage by the platforms’ cover: you get the home back the way you entrusted it to us.') +
        qa('How and when do I get paid?', 'Every month, by the 10th, you receive a statement with bookings, revenue, costs and net amount, together with the bank transfer.') +
        p(`You will find more answers in the ${link(`${SITE}/en#faq`, 'FAQ on our website')}. For anything else, write to us:`, 'margin-top:22px') +
        btn(waHref(l), COMMON[l].wa),
    },
    {
      subject: (n) => `${n ? `${n}, ` : ''}we are here if you have questions`,
      preheader: 'Figures, contract, using the home: ask us anything.',
      body: (n, z, l) =>
        h1('How are things going with your home?') +
        p(hello(l, n)) +
        p(`we are writing to see how things are going with your home${z ? ` in ${z}` : ''}. Entrusting your home to someone is a decision to take calmly, and every owner has different doubts. The ones we hear most often:`) +
        bullets([
          '<strong>The figures</strong>: what it can really earn, net of costs.',
          '<strong>The contract</strong>: what is included, duration and notice.',
          '<strong>Personal use</strong>: the weeks when you want to enjoy the home yourself.',
          '<strong>Care of the home</strong>: who goes in, who checks, who steps in when needed.',
        ]) +
        p('Whatever your question, reply to this email or message us on WhatsApp: a member of our team will answer you directly.') +
        btn(waHref(l), COMMON[l].wa) +
        p('This is the last automatic email we send you. If we have already spoken or you have already decided, please take it simply as a hello.', `font-size:13px;color:${C.stone}`),
    },
  ],
  de: [
    {
      subject: (n) => `${n ? `${n}, ` : ''}was Eigentümer sagen, die uns ihr Haus anvertraut haben`,
      preheader: 'Drei Eigentümer am Gardasee erzählen, wie es gelaufen ist.',
      body: (n, z, l) =>
        h1('Wie es denen ergangen ist, die den Schritt gewagt haben') +
        p(hello(l, n)) +
        p(`vielen Dank noch einmal für Ihre Anfrage${z ? ` zu Ihrem Haus in ${z}` : ''}. Wer uns kontaktiert, hat meist dieselben Fragen: Kann ich das Haus nutzen, wann ich will? Wird es sorgfältig behandelt? Lohnt es sich wirklich?`) +
        p('Wir lassen Eigentümer antworten, die uns ihr Haus bereits anvertraut haben:') +
        stories(l) +
        p('Jedes Haus ist anders, und Ihres verdient eine Einschätzung nach Maß. Bei Fragen antworten Sie auf diese E-Mail oder schreiben Sie uns auf WhatsApp.') +
        btn(waHref(l), COMMON[l].wa),
    },
    {
      subject: () => 'Die 5 Fragen, die uns jeder Eigentümer stellt',
      preheader: 'Kosten, Eigennutzung, Formalitäten, Schäden und Auszahlung: die kurzen Antworten.',
      body: (n, _z, l) =>
        h1('Die Fragen, die uns alle stellen') +
        p(hello(l, n)) +
        p('hier die Fragen, die wir von Eigentümern am häufigsten hören, mit kurzen und klaren Antworten.') +
        qa('Was kostet es?', 'Ein Prozentsatz der Einnahmen, den Sie vor der Unterschrift im Angebot finden. Keine Einrichtungsgebühr und kein Abonnement: Wenn das Haus nichts verdient, verdienen auch wir nichts.') +
        qa('Kann ich das Haus nutzen, wann ich will?', 'Ja, das Haus bleibt Ihres. Sie nennen uns die Termine, die Sie brauchen, und wir sperren sie im Kalender; je früher, desto leichter vermeiden wir, bereits eingegangene Buchungen abzulehnen.') +
        qa('Wer kümmert sich um die Formalitäten?', 'Wir: CIN, SUAP-Verfahren, Meldung an die Polizei, ISTAT-Daten und Kurtaxe. Sie erhalten jeden Monat eine Zusammenfassung.') +
        qa('Und wenn ein Gast etwas beschädigt?', 'Wir kontrollieren das Haus nach jeder Abreise. Kleine Schäden deckt die Kaution, größere die Absicherung der Portale: Sie erhalten das Haus so zurück, wie Sie es uns anvertraut haben.') +
        qa('Wie und wann bekomme ich mein Geld?', 'Jeden Monat bis zum 10. erhalten Sie die Abrechnung mit Buchungen, Einnahmen, Kosten und Nettobetrag, zusammen mit der Überweisung.') +
        p(`Weitere Antworten finden Sie in den ${link(`${SITE}/de#faq`, 'häufigen Fragen auf unserer Website')}. Für alles andere schreiben Sie uns:`, 'margin-top:22px') +
        btn(waHref(l), COMMON[l].wa),
    },
    {
      subject: (n) => `${n ? `${n}, ` : ''}wir sind für Ihre Fragen da`,
      preheader: 'Zahlen, Vertrag, Eigennutzung: Fragen Sie uns, was Sie möchten.',
      body: (n, z, l) =>
        h1('Wie geht es mit Ihrem Haus weiter?') +
        p(hello(l, n)) +
        p(`wir möchten wissen, wie es mit Ihrem Haus${z ? ` in ${z}` : ''} weitergeht. Sein Haus jemandem anzuvertrauen, entscheidet man in Ruhe, und jeder Eigentümer hat andere Fragen. Die häufigsten:`) +
        bullets([
          '<strong>Die Zahlen</strong>: was es nach Abzug der Kosten wirklich einbringen kann.',
          '<strong>Der Vertrag</strong>: was enthalten ist, Laufzeit und Kündigungsfrist.',
          '<strong>Die Eigennutzung</strong>: die Wochen, in denen Sie Ihr Haus selbst genießen möchten.',
          '<strong>Die Pflege des Hauses</strong>: wer hineingeht, wer kontrolliert, wer bei Bedarf eingreift.',
        ]) +
        p('Was auch immer Sie wissen möchten: Antworten Sie auf diese E-Mail oder schreiben Sie uns auf WhatsApp, es antwortet Ihnen direkt jemand aus unserem Team.') +
        btn(waHref(l), COMMON[l].wa) +
        p('Dies ist die letzte automatische E-Mail, die wir Ihnen senden. Wenn wir bereits gesprochen haben oder Sie sich schon entschieden haben, verstehen Sie sie einfach als Gruß.', `font-size:13px;color:${C.stone}`),
    },
  ],
};

/** Follow-up number `index` (0 = day 2, 1 = day 7, 2 = day 16). */
export function followUpEmail(index: number, lead: OwnerLead, stopHref?: string): Email {
  const l = emailLocale(lead.locale);
  const f = FOLLOWUPS[l][index];
  const n = firstName(lead);
  const z = lead.zone ? esc(lead.zone) : '';
  // Subjects are plain text: the unescaped first name, without line breaks.
  const subjectName = (lead.name || '').trim().split(/\s+/)[0]?.replace(/[\r\n]/g, '') || '';
  return { subject: f.subject(subjectName), html: layout(l, f.preheader, f.body(n, z, l), stopHref) };
}
