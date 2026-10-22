import { routing } from './routing';

/** Comuni with a dedicated landing page: slug → display name, hero photo, approximate [lat, lon] (for nearby links). */
export const COMUNI = {
  'peschiera-del-garda': { name: 'Peschiera del Garda', photo: '/immobili/villa-giardino.jpg', pos: [45.439, 10.692] },
  lazise: { name: 'Lazise', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.505, 10.733] },
  'castelnuovo-del-garda': { name: 'Castelnuovo del Garda', photo: '/immobili/villa-giardino.jpg', pos: [45.437, 10.763] },
  bardolino: { name: 'Bardolino', photo: '/immobili/interno-soggiorno.jpg', pos: [45.548, 10.722] },
  sirmione: { name: 'Sirmione', photo: '/immobili/dettaglio-bagno-spa.jpg', pos: [45.492, 10.608] },
  'desenzano-del-garda': { name: 'Desenzano del Garda', photo: '/immobili/interno-soggiorno.jpg', pos: [45.471, 10.537] },
  'padenghe-sul-garda': { name: 'Padenghe sul Garda', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.508, 10.508] },
  garda: { name: 'Garda', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.575, 10.708] },
  'torri-del-benaco': { name: 'Torri del Benaco', photo: '/immobili/interno-soggiorno.jpg', pos: [45.61, 10.686] },
  malcesine: { name: 'Malcesine', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.764, 10.809] },
  salo: { name: 'Salò', photo: '/immobili/dettaglio-bagno-spa.jpg', pos: [45.606, 10.521] },
  'manerba-del-garda': { name: 'Manerba del Garda', photo: '/immobili/villa-giardino.jpg', pos: [45.55, 10.551] },
  'moniga-del-garda': { name: 'Moniga del Garda', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.528, 10.538] },
  'soiano-del-lago': { name: 'Soiano del Lago', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.528, 10.512] },
  'lonato-del-garda': { name: 'Lonato del Garda', photo: '/immobili/villa-giardino.jpg', pos: [45.461, 10.484] },
  'valeggio-sul-mincio': { name: 'Valeggio sul Mincio', photo: '/immobili/interno-soggiorno.jpg', pos: [45.354, 10.735] },
  pozzolengo: { name: 'Pozzolengo', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.405, 10.633] },
  'brenzone-sul-garda': { name: 'Brenzone sul Garda', photo: '/immobili/interno-soggiorno.jpg', pos: [45.7, 10.765] },
  'costermano-sul-garda': { name: 'Costermano sul Garda', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.586, 10.739] },
  'cavaion-veronese': { name: 'Cavaion Veronese', photo: '/immobili/villa-giardino.jpg', pos: [45.54, 10.771] },
  affi: { name: 'Affi', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.553, 10.775] },
  'caprino-veronese': { name: 'Caprino Veronese', photo: '/immobili/dettaglio-bagno-spa.jpg', pos: [45.605, 10.796] },
  'san-zeno-di-montagna': { name: 'San Zeno di Montagna', photo: '/immobili/interno-soggiorno.jpg', pos: [45.637, 10.732] },
  pastrengo: { name: 'Pastrengo', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.495, 10.799] },
  sommacampagna: { name: 'Sommacampagna', photo: '/immobili/villa-giardino.jpg', pos: [45.405, 10.846] },
  'san-felice-del-benaco': { name: 'San Felice del Benaco', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.586, 10.551] },
  'puegnago-del-garda': { name: 'Puegnago del Garda', photo: '/immobili/dettaglio-bagno-spa.jpg', pos: [45.566, 10.511] },
  'polpenazze-del-garda': { name: 'Polpenazze del Garda', photo: '/immobili/interno-soggiorno.jpg', pos: [45.551, 10.505] },
  'gardone-riviera': { name: 'Gardone Riviera', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.622, 10.56] },
  'toscolano-maderno': { name: 'Toscolano-Maderno', photo: '/immobili/villa-giardino.jpg', pos: [45.64, 10.607] },
  gargnano: { name: 'Gargnano', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.689, 10.663] },
  tignale: { name: 'Tignale', photo: '/immobili/dettaglio-bagno-spa.jpg', pos: [45.737, 10.719] },
  'tremosine-sul-garda': { name: 'Tremosine sul Garda', photo: '/immobili/interno-soggiorno.jpg', pos: [45.773, 10.758] },
  'limone-sul-garda': { name: 'Limone sul Garda', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.813, 10.792] },
  'calvagese-della-riviera': { name: 'Calvagese della Riviera', photo: '/immobili/villa-giardino.jpg', pos: [45.534, 10.448] },
  'castiglione-delle-stiviere': { name: 'Castiglione delle Stiviere', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.39, 10.488] },
  carpenedolo: { name: 'Carpenedolo', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.364, 10.432] },
  montichiari: { name: 'Montichiari', photo: '/immobili/interno-soggiorno.jpg', pos: [45.413, 10.393] },
  // Trentino shore (Alto Garda)
  'riva-del-garda': { name: 'Riva del Garda', photo: '/immobili/villa-piscina.jpg', pos: [45.886, 10.842] },
  'nago-torbole': { name: 'Nago-Torbole', photo: '/immobili/vista-aerea-piscina.jpg', pos: [45.871, 10.874] },
  arco: { name: 'Arco', photo: '/immobili/villa-giardino.jpg', pos: [45.918, 10.886] },
  tenno: { name: 'Tenno', photo: '/immobili/interno-soggiorno.jpg', pos: [45.917, 10.832] },
  ledro: { name: 'Ledro', photo: '/immobili/villa-aerea-tetto.jpg', pos: [45.888, 10.733] },
  dro: { name: 'Dro', photo: '/immobili/dettaglio-bagno-spa.jpg', pos: [45.962, 10.911] },
  drena: { name: 'Drena', photo: '/immobili/villa-giardino.jpg', pos: [45.968, 10.946] },
} as const;

export type ComuneSlug = keyof typeof COMUNI;

export const COMUNE_SLUGS = Object.keys(COMUNI) as ComuneSlug[];

/**
 * The comuni named on the site (home list, form menus); every other comune
 * keeps its landing page but appears only as "zone limitrofe" / nearby links.
 */
export const MAIN_COMUNI: ComuneSlug[] = [
  'peschiera-del-garda',
  'lazise',
  'castelnuovo-del-garda',
  'bardolino',
  'sirmione',
  'desenzano-del-garda',
  'padenghe-sul-garda',
  'garda',
  'torri-del-benaco',
  'malcesine',
  'manerba-del-garda',
  'salo',
  'limone-sul-garda',
  'riva-del-garda',
];

/** The `count` comuni closest to `slug` (straight-line, good enough at lake scale). */
export const nearbyComuni = (slug: ComuneSlug, count = 6): ComuneSlug[] => {
  const [la, lo] = COMUNI[slug].pos;
  const dist = (s: ComuneSlug) => (COMUNI[s].pos[0] - la) ** 2 + ((COMUNI[s].pos[1] - lo) * 0.7) ** 2;
  return COMUNE_SLUGS.filter((s) => s !== slug).sort((a, b) => dist(a) - dist(b)).slice(0, count);
};

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
