/** Comuni with a dedicated landing page: slug → display name + hero photo. */
export const COMUNI = {
  'peschiera-del-garda': { name: 'Peschiera del Garda', photo: '/immobili/villa-giardino.jpg' },
  lazise: { name: 'Lazise', photo: '/immobili/vista-aerea-piscina.jpg' },
  'castelnuovo-del-garda': { name: 'Castelnuovo del Garda', photo: '/immobili/villa-giardino.jpg' },
  bardolino: { name: 'Bardolino', photo: '/immobili/interno-soggiorno.jpg' },
  sirmione: { name: 'Sirmione', photo: '/immobili/dettaglio-bagno-spa.jpg' },
  'desenzano-del-garda': { name: 'Desenzano del Garda', photo: '/immobili/interno-soggiorno.jpg' },
  'padenghe-sul-garda': { name: 'Padenghe sul Garda', photo: '/immobili/vista-aerea-piscina.jpg' },
} as const;

export type ComuneSlug = keyof typeof COMUNI;

export const COMUNE_SLUGS = Object.keys(COMUNI) as ComuneSlug[];

export const isComuneSlug = (s: string): s is ComuneSlug => s in COMUNI;
