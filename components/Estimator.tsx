'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';
import ValuationForm from './ValuationForm';

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.'];

/** Full valuation section (id="valutazione"); comune pages pre-select their town. */
export default function Estimator({ presetZone, sectionNumber = 'vi.' }: { presetZone?: string; sectionNumber?: string }) {
  const t = useTranslations('estimator');
  const side = t.raw('side') as {
    eyebrow: string;
    titleOne: string;
    titleTwo: string;
    items: Array<{ title: string; body: string }>;
  };

  return (
    <section
      id="valutazione"
      className="relative overflow-hidden bg-[var(--olive)] text-[var(--paper)]"
      style={{
        backgroundImage:
          'radial-gradient(1200px 400px at 15% 20%, rgba(184,146,90,0.15), transparent 60%), radial-gradient(800px 600px at 85% 80%, rgba(142,178,164,0.08), transparent 60%)',
      }}
    >
      <div className="container-x section-y relative z-10">
        <Reveal>
          <div className="max-w-[780px] mb-16">
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>{t('eyebrow')} · {sectionNumber}</div>
            <h2 className="serif mt-4 text-[var(--paper)]" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{t('titleTwo')}</em>
            </h2>
            <p className="mt-6" style={{ color: 'var(--paper-70)' }}>{t('intro')}</p>
          </div>
        </Reveal>

        <div className="grid gap-15 items-start md:grid-cols-[6fr_5fr] md:gap-24">
          <Reveal>
            <div className="p-6 sm:p-10 border border-[var(--paper-40)]" style={{ background: 'rgba(246,241,228,0.04)' }}>
              <ValuationForm variant="dark" source="estimator-form" presetZone={presetZone} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <aside className="pt-2">
              <div className="eyebrow" style={{ color: 'var(--gold)' }}>{side.eyebrow}</div>
              <h3 className="serif mt-3 text-[26px] text-[var(--paper)]">
                {side.titleOne}<br />{side.titleTwo}
              </h3>
              <ul className="list-none flex flex-col gap-5 mt-6 pt-6 border-t border-[var(--paper-40)]">
                {side.items.map((it, i) => (
                  <li key={i} className="flex gap-3.5 items-start">
                    <span className="serif italic text-[22px] leading-none min-w-[20px]" style={{ color: 'var(--gold)' }}>{ROMAN[i]}</span>
                    <div>
                      <strong className="serif text-[18px] font-medium text-[var(--paper)] block mb-1">{it.title}</strong>
                      <p className="text-[14px] leading-[1.55]" style={{ color: 'var(--paper-70)' }}>{it.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
