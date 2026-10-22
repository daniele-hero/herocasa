import { Cormorant_Garamond, Manrope } from 'next/font/google';

// Downloaded at build time and served from herocasa.it: no render-blocking
// request to Google on first paint, and no visitor IPs sent to Google.
// Shared by app/[locale]/layout.tsx and app/not-found.tsx.
export const serif = Cormorant_Garamond({ subsets: ['latin'], style: ['normal', 'italic'], display: 'swap', variable: '--font-cormorant' });
export const sans = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
