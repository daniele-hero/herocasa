'use client';

import { trackLead } from './CookieBanner';

const WHATSAPP_NUMBER = '393663695252';
const DEFAULT_MESSAGE = 'Ciao, vorrei una valutazione per la mia casa sul Garda';

/**
 * Floating WhatsApp CTA — fixed bottom-right on every breakpoint.
 * Separate from the inline WhatsApp link in the Contact section: this one
 * is always reachable while scrolling, which is what a proprietor skimming
 * the page on mobile actually needs.
 */
export default function WhatsAppFloat() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrivici su WhatsApp"
      onClick={() => trackLead('whatsapp-float')}
      className="fixed z-[150] bottom-5 right-5 w-14 h-14 rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(15,47,39,0.35)] flex items-center justify-center transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.83 14.04c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.05.24-3.55-.74-3.01-1.19-4.94-4.27-5.09-4.47-.15-.2-1.22-1.63-1.22-3.1 0-1.48.78-2.2 1.05-2.5.28-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.62.85 2.15.92 2.3.08.16.13.34.02.55-.1.2-.16.33-.31.5-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.19.32.84 1.4 1.82 2.27 1.25 1.11 2.3 1.46 2.62 1.62.32.16.51.14.7-.08.19-.22.81-.95 1.03-1.28.21-.32.42-.27.7-.16.29.1 1.83.87 2.14 1.02.32.16.53.24.6.37.08.13.08.75-.16 1.43Z" />
      </svg>
    </a>
  );
}
