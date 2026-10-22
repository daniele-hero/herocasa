import { routing, type Locale } from './routing';

/** URL segment of the guides per locale: German owners search in German. */
export const GUIDE_SEGMENT: Record<Locale, string> = { it: 'guide', en: 'guide', de: 'ratgeber' };

/**
 * Owner guides: id, slug and short link label per locale. `published: false` keeps a
 * guide as a noindex draft, reachable only by URL; published ones are in the sitemap
 * and linked from the footer and from the other guides. Kept apart from
 * lib/articles.tsx so client components (Footer, Nav) don't bundle the article bodies.
 */
export const GUIDES = [
  {
    id: 'gestore',
    published: true,
    slug: { it: 'gestire-da-soli-o-con-un-gestore', en: 'self-manage-or-property-manager', de: 'selbst-vermieten-oder-verwalter' },
    label: { it: 'Gestire da soli o con un gestore?', en: 'Self-manage or hire a manager?', de: 'Selbst vermieten oder Verwalter?' },
  },
  {
    id: 'rendita',
    published: true,
    slug: { it: 'quanto-rende-casa-lago-di-garda', en: 'how-much-lake-garda-home-earns', de: 'was-bringt-ferienhaus-gardasee' },
    label: { it: 'Quanto rende una casa sul Garda', en: 'What a Lake Garda home earns', de: 'Was ein Ferienhaus am Garda bringt' },
  },
  {
    id: 'cin',
    published: true,
    slug: { it: 'cin-suap-affitti-brevi', en: 'cin-suap-short-term-rentals-italy', de: 'cin-suap-ferienvermietung-italien' },
    label: { it: 'CIN e SUAP: cosa serve', en: 'CIN and SUAP: what you need', de: 'CIN und SUAP: was Sie brauchen' },
  },
] as const;

export type Guide = (typeof GUIDES)[number];
export type GuideId = Guide['id'];

const isLocale = (l: string): l is Locale => (routing.locales as readonly string[]).includes(l);

export const guidePath = (locale: Locale, guide: Guide) => `/${locale}/${GUIDE_SEGMENT[locale]}/${guide.slug[locale]}`;

export const findGuide = (locale: string, slug: string): Guide | undefined =>
  isLocale(locale) ? GUIDES.find((g) => g.slug[locale] === slug) : undefined;

export const PUBLISHED_GUIDES = GUIDES.filter((g) => g.published);

/** Static params for the locales whose guide URL segment is `segment`. */
export const guideParams = (segment: string) =>
  routing.locales.filter((l) => GUIDE_SEGMENT[l] === segment).flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug[locale] })));
