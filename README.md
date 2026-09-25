# HEROCASA — Sito Property Management sul Lago di Garda

Landing page premium (single-page) per **HEROCASA**, agenzia di property management per proprietari di seconde case sul Lago di Garda. Costruita per convertire proprietari qualificati tramite valutazione gratuita dell'immobile.

Sede: **Castelnuovo del Garda (VR), Italia**.

---

## Stack

- **Next.js 15** — App Router, React Server Components, generazione statica per lingua
- **React 19**
- **Tailwind CSS 4** — token editoriali brand HEROCASA (oliva, oro, sabbia)
- **Motion** (Framer Motion) — animazioni fluide, `prefers-reduced-motion` rispettato
- **next-intl 3** — internazionalizzazione IT / EN / DE con routing prefissato (`/it`, `/en`, `/de`)
- **TypeScript** stretto

---

## Struttura

```
herocasa-garda/
├── app/
│   ├── layout.tsx                    # Root layout (obbligatorio)
│   ├── globals.css                   # Tailwind + design tokens
│   ├── [locale]/
│   │   ├── layout.tsx                # Locale layout (html, body, provider)
│   │   └── page.tsx                  # Home page
│   └── api/
│       └── valuation-request/
│           └── route.ts              # Endpoint POST del form valutazione
├── components/
│   ├── LandingPage.tsx               # Composizione della landing
│   ├── Nav.tsx                       # Nav sticky con lang switcher e CTA
│   ├── Hero.tsx                      # Hero editoriale split + parallax
│   ├── TrustBar.tsx                  # Contatori animati (8+, 180, 97%, €3.2M)
│   ├── Manifesto.tsx                 # Chi siamo editoriale
│   ├── Services.tsx                  # Griglia 6 servizi
│   ├── Process.tsx                   # 04 passi su fondo oliva
│   ├── Testimonial.tsx               # Blockquote editoriale
│   ├── Properties.tsx                # Griglia asimmetrica proprieta'
│   ├── Zones.tsx                     # Zone coperte
│   ├── Estimator.tsx                 # Form valutazione con stima live
│   ├── Faq.tsx                       # Accordion domande frequenti
│   ├── Contact.tsx                   # Contatti + card chiamata conoscitiva
│   ├── Footer.tsx                    # Footer con navigazione secondaria
│   └── Reveal.tsx                    # Utility motion reveal on scroll
├── lib/
│   ├── routing.ts                    # Config locali next-intl
│   └── i18n.ts                       # Request config
├── messages/
│   ├── it.json                       # Contenuti italiani
│   ├── en.json                       # Contenuti inglesi
│   └── de.json                       # Contenuti tedeschi
├── middleware.ts                     # Locale detection + redirect
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── preview.html                      # Preview HTML statico (senza Node)
└── README.md
```

---

## Setup e sviluppo

### Prerequisiti

- **Node.js 20 o superiore** ([nodejs.org](https://nodejs.org))
- npm (incluso in Node) o pnpm

### Installazione

```bash
cd herocasa-garda
npm install
```

### Sviluppo locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) — verra' reindirizzato a `/it` (locale di default).

Le altre lingue sono a `/en` e `/de`.

### Build di produzione

```bash
npm run build
npm start
```

---

## Preview senza Node

Il file **`preview.html`** e' una versione self-contained (single-file) del sito, utile per:

- Mostrare il design a chi non ha ambiente Node installato
- Validare rapidamente colori, tipografia, layout
- Test veloci di modifiche UI da parte di non-sviluppatori

Basta aprirlo in un browser (doppio click). Include animazioni, form estimator funzionante (calcolo lato client), accordion FAQ.

**Non** e' un ambiente di sviluppo: il preview e' statico e non usa i18n. E' un mockup di riferimento.

---

## Design tokens

I colori del brand sono definiti come CSS variables in [`app/globals.css`](app/globals.css) e come Tailwind tokens in `@theme`:

| Token             | Hex        | Uso                                             |
|-------------------|------------|-------------------------------------------------|
| `--color-paper`   | `#F6F1E4`  | Sfondo principale (crema caldo)                 |
| `--color-marble`  | `#EAE3D0`  | Sfondi di sezione secondaria                    |
| `--color-olive`   | `#3D3E28`  | Colore brand, testo, sezioni scure              |
| `--color-shadow`  | `#2A2B1D`  | Footer (piu' scuro dell'oliva)                  |
| `--color-gold`    | `#B8925A`  | Oro antico — accento, CTA                       |
| `--color-gold-dark` | `#8B6F44`| Hover/depth per oro                             |
| `--color-sage`    | `#8EB2A4`  | Verde salvia dal logo (accento secondario)      |
| `--color-stone`   | `#6B6A5C`  | Testo secondario, dividers, meta                |

**Tipografia**:
- Display: **Cormorant Garamond** (serif editoriale)
- Body/UI: **Inter** (sans-serif)

Font caricati da Google Fonts nel `<head>` del layout locale.

---

## Backend / lead handling

Il form Estimator invia un POST a `/api/valuation-request` con:
- Nome, email, telefono
- Comune, tipologia, camere
- Servizi selezionati (array)
- Note libere
- Stima calcolata (range min-max)

**Prima del go-live** modificare [`app/api/valuation-request/route.ts`](app/api/valuation-request/route.ts) per:
1. **Notifica email** al team commerciale HEROCASA (Resend / Postmark / SMTP)
2. **CRM** (HubSpot, Pipedrive, Notion, Airtable...) per il follow-up
3. **Email di conferma** al lead con riepilogo dei dati inviati

Alternativa low-code: webhook Make.com o Zapier con dispatch a Gmail + Notion.

---

## Internazionalizzazione

I contenuti sono tutti in `messages/{it,en,de}.json`. Per modificare un testo:

1. Aprire il file JSON della lingua
2. Trovare la chiave
3. Modificare il valore
4. Il rebuild automatico in `dev` recupera le modifiche

Per aggiungere una lingua:
1. Aggiungere il locale in `lib/routing.ts` (es. `'fr'`)
2. Creare `messages/fr.json` con la stessa struttura
3. Aggiungere la lingua nello switcher in `components/Nav.tsx`

---

## Deploy consigliato

**Vercel** (raccomandato, free tier sufficiente):
1. Push su GitHub
2. Import repository su [vercel.com](https://vercel.com)
3. Deploy automatico

Alternative: Netlify, Cloudflare Pages, o VPS con Node.js (PM2 + Nginx reverse proxy).

Dominio consigliato: `herocasa.it` (o `www.herocasa.it`). Configurare redirect da `http` a `https`.

---

## Performance & SEO

- Tutte le immagini sono servite via `next/image` con lazy-loading e responsive `sizes`.
- Font Google caricati con `preconnect` e `display=swap` per evitare FOIT.
- L'hero image e' `priority` per LCP ottimale.
- Static Site Generation (SSG) per ogni locale — nessun render server-side ad ogni richiesta.
- Metadata SEO differenziati per lingua (title/description tradotti).

Aggiungere prima del go-live:
- OpenGraph image dedicata (1200x630) in `/public/og-image.jpg`
- `robots.txt` e `sitemap.xml` (Next.js li genera automaticamente con `app/robots.ts` e `app/sitemap.ts`)
- Google Search Console + Analytics 4 (o Plausible)

---

## Immagini placeholder

Il preview e la landing usano immagini Unsplash come placeholder. **Prima del go-live** sostituire con foto professionali degli immobili in gestione:

- Hero: villa con vista lago, orientamento verticale, ~1600x2000px
- Griglia proprieta': 4 immobili in ratio 3:4 e 4:3 alternati, ~1200x1600px

Consigliato: shooting professionale (Herocasa gia' ne organizza uno per ogni onboarding — riusare quelle foto).

---

## Prossimi step consigliati

1. **Copywriting review**: il testo attuale e' un draft ottimizzato per conversione. Da rileggere con il team HEROCASA (soprattutto FAQ, sezione servizi, testimonial reali).
2. **Foto reali** degli immobili in gestione (in primis 4 per la sezione "Immobili in gestione").
3. **Traduzioni review**: EN e DE sono traduzioni professionali del contenuto italiano ma vanno riviste da un madrelingua.
4. **Backend integrazione**: mail transazionale + CRM (~2 ore di lavoro).
5. **GTM / Analytics + banner cookie GDPR**.
6. **Testimonial reali** da chiedere a 2-3 proprietari attivi.
7. **Booking system integrazione** (opzionale, fase 2): Calendly o Cal.com per la chiamata conoscitiva.

---

## Attribuzione

Design e sviluppo: sito costruito per **HEROCASA S.r.l.** — Castelnuovo del Garda (VR).
