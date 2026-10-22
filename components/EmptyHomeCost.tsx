'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

type Item = { title: string; body: string };

/** "A closed home still costs": closing argument right before the valuation form. No tax topics (owner's choice). */
export default function EmptyHomeCost({ numeral }: { numeral: string }) {
  const t = useTranslations('emptyHome');
  const items = t.raw('items') as Item[];

  return (
    <section id="casa-chiusa">
      <div className="container-x section-y">
        <Reveal>
          <div className="flex justify-between items-end gap-6 mb-14 flex-wrap">
            <div>
              <div className="eyebrow">{t('eyebrow')} · {numeral}</div>
              <h2 className="serif mt-3.5" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
                {t('titleOne')}<br />
                <em className="gold-italic">{t('titleTwo')}</em>
              </h2>
            </div>
            <p className="max-w-[40ch]" style={{ color: 'var(--olive-90)' }}>{t('intro')}</p>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={0.05 * i}>
              <div className="border-t border-[var(--olive-15)] pt-6 flex flex-col gap-3">
                <div className="serif italic text-[18px] text-[var(--gold-dark)]">{['a.', 'b.', 'c.'][i]}</div>
                <h3 className="serif font-medium" style={{ fontSize: 'clamp(22px, 2.2vw, 28px)', lineHeight: 1.2 }}>{it.title}</h3>
                <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--olive-70)' }}>{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 pt-8 border-t border-[var(--olive-15)] flex flex-wrap items-center justify-between gap-6">
            <p className="serif max-w-[46ch] text-[var(--olive)]" style={{ fontSize: 'clamp(20px, 1.8vw, 26px)', lineHeight: 1.35 }}>
              {t('closing')}
            </p>
            <a href="#valutazione" className="btn gold">{t('cta')}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
