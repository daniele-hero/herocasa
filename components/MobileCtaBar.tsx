'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { trackContact, trackStep } from './CookieBanner';

const WHATSAPP_HREF = `https://wa.me/393663695252?text=${encodeURIComponent('Ciao, vorrei una valutazione per la mia casa sul Garda')}`;

/**
 * Phone-only sticky bar: the two actions an owner can take at any scroll
 * depth. Hidden while the valuation form or the contact section is on screen,
 * so it never covers the form it points to.
 */
export default function MobileCtaBar() {
  const t = useTranslations('mobileBar');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = ['valutazione', 'contatti'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
        setHidden(visible.size > 0);
      },
      { threshold: 0.15 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Spacer so the bar never covers the end of the footer. */}
      <div className="h-[72px] md:hidden" aria-hidden="true" />
      <div
        className="md:hidden fixed z-[150] inset-x-0 bottom-0 grid grid-cols-[1fr_auto] gap-2 px-3 pt-2.5 bg-[var(--paper)] border-t border-[var(--olive-15)] shadow-[0_-8px_24px_rgba(15,47,39,0.10)] transition-transform duration-300"
        style={{
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          transform: hidden ? 'translateY(110%)' : 'translateY(0)',
        }}
        aria-hidden={hidden}
      >
        <a
          href="#valutazione"
          onClick={() => trackStep('MobileBarValuation')}
          className="btn gold justify-center py-3.5 text-[13px]"
          tabIndex={hidden ? -1 : 0}
        >
          {t('valuate')}
        </a>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContact('mobile-bar-whatsapp')}
          className="flex items-center justify-center gap-2 px-4 bg-[#25D366] text-white text-[13px] font-semibold tracking-[0.04em]"
          tabIndex={hidden ? -1 : 0}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.83 14.04c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.05.24-3.55-.74-3.01-1.19-4.94-4.27-5.09-4.47-.15-.2-1.22-1.63-1.22-3.1 0-1.48.78-2.2 1.05-2.5.28-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.62.85 2.15.92 2.3.08.16.13.34.02.55-.1.2-.16.33-.31.5-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.19.32.84 1.4 1.82 2.27 1.25 1.11 2.3 1.46 2.62 1.62.32.16.51.14.7-.08.19-.22.81-.95 1.03-1.28.21-.32.42-.27.7-.16.29.1 1.83.87 2.14 1.02.32.16.53.24.6.37.08.13.08.75-.16 1.43Z" />
          </svg>
          {t('whatsapp')}
        </a>
      </div>
    </>
  );
}
