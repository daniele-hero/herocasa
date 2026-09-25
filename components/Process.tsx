'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

type Step = { title: string; body: string; duration: string };

export default function Process() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as Step[];

  return (
    <section id="processo" className="bg-[var(--olive)] text-[var(--paper)]">
      <div className="container-x section-y">
        <Reveal>
          <div className="max-w-[640px] mb-20">
            <div className="eyebrow" style={{ color: 'var(--sage)' }}>{t('eyebrow')} · iii.</div>
            <h2 className="serif mt-4 text-[var(--paper)]" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{t('titleTwo')}</em>
            </h2>
            <p className="mt-6" style={{ color: 'var(--paper-70)' }}>{t('intro')}</p>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-4 md:gap-8">
          {steps.map((s, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div className="border-t border-[var(--paper-40)] pt-5 flex flex-col gap-3 h-full">
                <div className="serif italic text-[40px] leading-none text-[var(--gold)] mb-1">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="serif font-medium text-[22px] text-[var(--paper)]">{s.title}</h3>
                <p className="text-[14px] leading-[1.6]" style={{ color: 'var(--paper-70)' }}>{s.body}</p>
                <div className="mt-2 text-[11px] tracking-[0.14em] uppercase" style={{ color: 'var(--sage)' }}>{s.duration}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
