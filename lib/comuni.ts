import { routing } from './routing';

/** Comuni with a dedicated landing page: slug → display name + hero photo. */
export const COMUNI = {
  'peschiera-del-garda': { name: 'Peschiera del Garda', photo: '/immobili/villa-giardino.jpg' },
  lazise: { name: 'Lazise', photo: '/immobili/vista-aerea-piscina.jpg' },
  'castelnuovo-del-garda': { name: 'Castelnuovo del Garda', photo: '/immobili/villa-giardino.jpg' },
  bardolino: { name: 'Bardolino', photo: '/immobili/interno-soggiorno.jpg' },
  sirmione: { name: 'Sirmione', photo: '/immobili/dettaglio-bagno-spa.jpg' },
  'desenzano-del-garda': { name: 'Desenzano del Garda', photo: '/immobili/interno-soggiorno.jpg' },
  'padenghe-sul-garda': { name: 'Padenghe sul Garda', photo: '/immobili/vista-aerea-piscina.jpg' },
  garda: { name: 'Garda', photo: '/immobili/villa-aerea-tetto.jpg' },
  'torri-del-benaco': { name: 'Torri del Benaco', photo: '/immobili/interno-soggiorno.jpg' },
  malcesine: { name: 'Malcesine', photo: '/immobili/vista-aerea-piscina.jpg' },
  salo: { name: 'Salò', photo: '/immobili/dettaglio-bagno-spa.jpg' },
  'manerba-del-garda': { name: 'Manerba del Garda', photo: '/immobili/villa-giardino.jpg' },
  'moniga-del-garda': { name: 'Moniga del Garda', photo: '/immobili/villa-aerea-tetto.jpg' },
  'soiano-del-lago': { name: 'Soiano del Lago', photo: '/immobili/vista-aerea-piscina.jpg' },
  'lonato-del-garda': { name: 'Lonato del Garda', photo: '/immobili/villa-giardino.jpg' },
  'valeggio-sul-mincio': { name: 'Valeggio sul Mincio', photo: '/immobili/interno-soggiorno.jpg' },
  pozzolengo: { name: 'Pozzolengo', photo: '/immobili/villa-aerea-tetto.jpg' },
} as const;

export type ComuneSlug = keyof typeof COMUNI;

export const COMUNE_SLUGS = Object.keys(COMUNI) as ComuneSlug[];

export const isComuneSlug = (s: string): s is ComuneSlug => s in COMUNI;

/** German owners search in German, so the DE pages get a German URL segment. */
export const COMUNE_SEGMENT: Record<string, string> = {
  it: 'gestione-affitti-brevi',
  en: 'gestione-affitti-brevi',
  de: 'ferienhaus-verwaltung',
};

export const comunePath = (locale: string, slug: string) => `/${locale}/${COMUNE_SEGMENT[locale] ?? COMUNE_SEGMENT.it}/${slug}`;

/** Static params for the locales whose comune URL segment is `segment`. */
export const comuneParams = (segment: string) =>
  routing.locales.filter((l) => COMUNE_SEGMENT[l] === segment).flatMap((locale) => COMUNE_SLUGS.map((comune) => ({ locale, comune })));
