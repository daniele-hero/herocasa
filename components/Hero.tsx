'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Photo from './Photo';
import HeroForm from './HeroForm';

// Entrance animations are CSS (globals.css, .hero-rise/.hero-line/.hero-unveil), not motion:
// they start on first paint instead of waiting for the JS bundle, so on phones
// the headline and CTA show up immediately rather than after hydration.
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

export default function Hero() {
  const t = useTranslations('hero');
  const reduced = useReducedMotion();
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], [0, 60]);

  return (
    <header
      className="container-x grid gap-10 items-end min-h-[100dvh] pt-32 md:grid-cols-[5fr_7fr] md:gap-[clamp(40px,6vw,96px)] md:pt-36 md:pb-15"
      style={{ paddingBottom: '60px' }}
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="eyebrow -mb-2 hero-rise">{t('eyebrow')}</div>

        <h1 className="h-display font-normal" style={{ fontSize: 'clamp(46px, 7.5vw, 112px)', lineHeight: 0.98, letterSpacing: '-0.015em' }}>
          {[t('lineOne'), t('lineTwo'), t('lineThree')].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span className={`inline-block hero-line ${i === 1 ? 'gold-italic' : ''}`} style={delay(0.05 + i * 0.1)}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="max-w-[44ch] hero-rise"
          style={{ fontSize: 'clamp(17px, 1.25vw, 20px)', lineHeight: 1.55, color: 'var(--olive-90)', ...delay(0.3) }}
        >
          {t('body')}
        </p>

        <div className="mt-2 hero-rise" style={delay(0.4)}>
          <HeroForm />
        </div>
      </div>

      <div
        ref={imgWrapRef}
        style={delay(0.15)}
        // Cap + sticky: when the HeroForm expands the left column grows ~450px; without
        // the cap the photo stretched with it into a huge crop and the layout jumped.
        className="relative self-stretch min-h-[60vh] md:max-h-[max(900px,calc(100dvh-204px))] md:sticky md:top-28 hero-unveil"
      >
        <div className="relative h-full min-h-[68vh] overflow-hidden bg-[var(--marble)]">
          <motion.div style={{ y: reduced ? 0 : imgY }} className="h-full w-full">
            <Photo
              src="/immobili/villa-piscina.jpg"
              alt="Villa con piscina gestita da Herocasa sul Lago di Garda"
              priority
              className="object-cover object-[38%_center] scale-[1.08]"
            />
          </motion.div>
        </div>
        {/* Compact on phones (no explanation line) so the card leaves the pool in view. */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 backdrop-blur-sm px-5 py-4 md:p-6 max-w-[320px]" style={{ background: 'rgba(246, 241, 228, 0.94)' }}>
          <div className="text-[11px] tracking-[0.16em] uppercase text-[var(--stone)] mb-1.5">{t('statLabel')}</div>
          <div className="serif text-[34px] md:text-[40px] leading-none text-[var(--olive)]">
            <span className="gold-italic">{t('statValue')}</span>
          </div>
          <div className="hidden md:block text-[13px] text-[var(--olive-70)] mt-2 leading-[1.5]">{t('statMeta')}</div>
        </div>
      </div>
    </header>
  );
}
