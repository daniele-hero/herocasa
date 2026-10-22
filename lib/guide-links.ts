/**
 * Published owner guides (Italian only), with the short label used in links.
 * A guide listed here is live: indexed, in the sitemap, linked from the footer
 * and from the other guides; one missing from the list stays a noindex draft.
 * Kept apart from lib/articles.tsx so client components (Footer) don't bundle
 * the article bodies.
 */
export const GUIDE_LINKS = [
  { slug: 'gestire-da-soli-o-con-un-gestore', label: 'Gestire da soli o con un gestore?' },
  { slug: 'quanto-rende-casa-lago-di-garda', label: 'Quanto rende una casa sul Garda' },
  { slug: 'cin-suap-affitti-brevi', label: 'CIN e SUAP: cosa serve' },
] as const;

export const isPublishedGuide = (slug: string) => GUIDE_LINKS.some((g) => g.slug === slug);
