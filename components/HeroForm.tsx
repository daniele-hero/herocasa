'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ValuationForm from './ValuationForm';
import { trackStep } from './CookieBanner';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * Hero lead-magnet: a single CTA that opens the same two-step valuation form
 * used further down the page, in a card right under the headline.
 */
export default function HeroForm({ presetZone }: { presetZone?: string }) {
  const tHero = useTranslations('hero');
  const tEst = useTranslations('estimator');
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const open = () => {
    setExpanded(true);
    trackStep('ValuationFormOpen', { source: 'hero' });
  };

  return (
    <div className="flex flex-col gap-3.5">
      <AnimatePresence mode="wait" initial={false}>
        {!expanded ? (
          <motion.button
            key="cta"
            type="button"
            onClick={open}
            className="btn gold self-start"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tHero('primaryCta')}
          </motion.button>
        ) : (
          <motion.div
            key="form"
            className="bg-[var(--paper)] border border-[var(--olive-15)] shadow-[0_16px_48px_rgba(15,47,39,0.10)] px-6 sm:px-7 pt-5 pb-6 max-w-[560px]"
            initial={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--olive-15)]">
              <span className="eyebrow">{tEst('eyebrow')}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label={tHero('closeForm')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[22px] leading-none text-[var(--stone)] transition-colors hover:bg-[var(--marble)] hover:text-[var(--olive)]"
              >
                ×
              </button>
            </div>
            <ValuationForm variant="light" source="hero-form" presetZone={presetZone} />
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <div className="flex items-center gap-6 flex-wrap text-[12px] max-sm:text-[13px] text-[var(--stone)]">
          {/* Each item stays on one line; wraps happen only between items. */}
          <span className="leading-[1.6]">
            {tHero('trust')
              .split(' · ')
              .map((item, i, all) => (
                <span key={item}>
                  <span className="whitespace-nowrap">{i < all.length - 1 ? `${item} ·` : item}</span>
                  {i < all.length - 1 ? ' ' : ''}
                </span>
              ))}
          </span>
          <a href="#processo" className="btn-arrow" style={{ fontSize: 12 }}>
            {tHero('secondaryCta')} <span className="arrow" />
          </a>
        </div>
      )}
    </div>
  );
}
