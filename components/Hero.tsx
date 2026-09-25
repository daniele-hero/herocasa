'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import HeroForm from './HeroForm';

const EASE = [0.2, 0.7, 0.2, 1] as const;

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
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="eyebrow -mb-2"
        >
          {t('eyebrow')}
        </motion.div>

        <h1 className="h-display font-normal" style={{ fontSize: 'clamp(46px, 7.5vw, 112px)', lineHeight: 0.98, letterSpacing: '-0.015em' }}>
          {[t('lineOne'), t('lineTwo'), t('lineThree')].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className={`inline-block ${i === 1 ? 'gold-italic' : ''}`}
                initial={reduced ? undefined : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.15 + i * 0.15, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
          className="max-w-[44ch]"
          style={{ fontSize: 'clamp(17px, 1.25vw, 20px)', lineHeight: 1.55, color: 'var(--olive-90)' }}
        >
          {t('body')}
        </motion.p>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
          className="mt-2"
        >
          <HeroForm />
        </motion.div>
      </div>

      <motion.div
        ref={imgWrapRef}
        initial={reduced ? undefined : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
        animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
        transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
        className="relative self-stretch min-h-[60vh]"
      >
        <div className="relative h-full min-h-[68vh] overflow-hidden bg-[var(--marble)]">
          <motion.div style={{ y: reduced ? 0 : imgY }} className="h-full w-full">
            <Image
              src="/immobili/villa-aerea-tetto.jpg"
              alt="Vista aerea di una villa gestita da Herocasa sul Lago di Garda"
              fill
              priority
              sizes="(min-width: 960px) 58vw, 100vw"
              className="object-cover scale-[1.08]"
            />
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-6 backdrop-blur-sm p-6 max-w-[320px]" style={{ background: 'rgba(246, 241, 228, 0.94)' }}>
          <div className="text-[11px] tracking-[0.16em] uppercase text-[var(--stone)] mb-1.5">{t('statLabel')}</div>
          <div className="serif text-[40px] leading-none text-[var(--olive)]">
            <span className="gold-italic">{t('statValue')}</span>
          </div>
          <div className="text-[13px] text-[var(--olive-70)] mt-2 leading-[1.5]">{t('statMeta')}</div>
        </div>
      </motion.div>
    </header>
  );
}
