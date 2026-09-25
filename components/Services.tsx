'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

type ServiceItem = { title: string; body: string; link: string };
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

export default function Services() {
  const t = useTranslations('services');
  const list = t.raw('list') as ServiceItem[];

  return (
    <section id="servizi" className="container-x section-y">
      <Reveal>
        <div className="flex justify-between items-end gap-6 mb-16 flex-wrap">
          <div>
            <div className="eyebrow">{t('eyebrow')} · ii.</div>
            <h2 className="serif mt-3.5" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em className="gold-italic">{t('titleTwo')}</em>
            </h2>
          </div>
          <p className="max-w-[40ch]" style={{ color: 'var(--olive-90)' }}>{t('intro')}</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--olive-15)] border border-[var(--olive-15)]">
        {list.map((s, i) => (
          <Reveal key={i} delay={0.05 * i}>
            <a
              href="#valutazione"
              className="bg-[var(--paper)] p-10 flex flex-col gap-3.5 h-full transition-colors duration-300 hover:bg-[var(--marble)] group no-underline"
            >
              <div className="serif italic text-[18px] text-[var(--gold-dark)]">{LETTERS[i]}.</div>
              <h3 className="serif font-medium" style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1.2 }}>{s.title}</h3>
              <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--olive-70)' }}>{s.body}</p>
              <div className="mt-auto pt-5 text-[12px] tracking-[0.14em] uppercase text-[var(--stone)] group-hover:text-[var(--gold-ink)] transition-colors flex items-center gap-2">
                {s.link} →
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
