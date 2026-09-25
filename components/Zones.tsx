'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

type Zone = { name: string; count: string; highlight?: boolean };

export default function Zones() {
  const t = useTranslations('zones');
  const list = t.raw('list') as Zone[];

  return (
    <section id="zone" className="bg-[var(--marble)] section-y">
      <div className="container-x">
        <Reveal>
          <div className="flex justify-between items-end gap-6 mb-12 flex-wrap">
            <div>
              <div className="eyebrow">{t('eyebrow')} · v.</div>
              <h2 className="serif mt-3.5" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
                {t('titleOne')} <em className="gold-italic">{t('titleTwo')}</em>
              </h2>
            </div>
            <p className="max-w-[40ch]" style={{ color: 'var(--olive-90)' }}>{t('intro')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[var(--olive-15)]">
          {list.map((z, i) => (
            <Reveal key={i} delay={0.03 * i}>
              <a
                href="#valutazione"
                className="py-8 flex flex-col gap-2 border-b border-[var(--olive-15)] sm:border-r sm:px-6 sm:last:border-r-0 no-underline transition-colors hover:bg-[var(--marble)]"
                style={{ borderRightColor: i % 4 === 3 ? 'transparent' : undefined }}
                aria-label={`Ricevi una stima per un immobile in ${z.name}`}
              >
                <div
                  className="serif text-[26px]"
                  style={{ color: z.highlight ? 'var(--gold-dark)' : 'var(--olive)' }}
                >
                  {z.name}
                </div>
                <div className="text-[12px] tracking-[0.14em] uppercase text-[var(--stone)]">{z.count}</div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
