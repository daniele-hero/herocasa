'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Reveal from './Reveal';

type Property = { name: string; meta: string; metric: string; metricLabel: string };

// Order matches messages/*.json properties.list exactly (0-indexed).
const IMAGES = [
  '/immobili/vista-aerea-piscina.jpg', // Villa a Soiano del Lago
  '/immobili/interno-soggiorno.jpg', // Appartamento a Sirmione
  '/immobili/dettaglio-bagno-spa.jpg', // Casa a Bardolino
  '/immobili/villa-giardino.jpg', // Villa a Lazise
];

const GRID_STYLES = [
  'lg:col-span-7',
  'lg:col-start-8 lg:col-span-5 lg:mt-20',
  'lg:col-span-5',
  'lg:col-start-6 lg:col-span-7 lg:mt-10',
];

export default function Properties() {
  const t = useTranslations('properties');
  const list = t.raw('list') as Property[];

  return (
    <section id="immobili" className="container-x section-y">
      <Reveal>
        <div className="flex justify-between items-end gap-6 mb-16 flex-wrap">
          <div>
            <div className="eyebrow">{t('eyebrow')} · iv.</div>
            <h2 className="serif mt-3.5" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em className="gold-italic">{t('titleTwo')}</em>
            </h2>
          </div>
          <a href="#valutazione" className="btn-arrow">{t('seeAll')} <span className="arrow" /></a>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-8">
        {list.map((p, i) => (
          <Reveal key={i} delay={0.05 * i} className={GRID_STYLES[i]}>
            <a
              href="#valutazione"
              className="flex flex-col group no-underline"
              aria-label={`Richiedi una valutazione per un immobile simile a ${p.name}`}
            >
              <div
                className="relative overflow-hidden bg-[var(--marble)]"
                style={{ aspectRatio: i === 0 || i === 3 ? '4 / 3' : '3 / 4' }}
              >
                <Image
                  src={IMAGES[i]}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1100px) 40vw, (min-width: 700px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-105"
                />
              </div>
              <div className="pt-5 px-1 flex justify-between items-baseline gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="serif font-medium" style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1.2 }}>{p.name}</h3>
                  <div className="text-[12px] tracking-[0.08em] uppercase text-[var(--stone)] mt-2 leading-[1.6]">{p.meta}</div>
                </div>
                <div className="serif text-[22px] text-[var(--gold-dark)] whitespace-nowrap flex-none text-right">
                  {p.metric}
                  <small className="block font-sans text-[10px] uppercase tracking-[0.14em] text-[var(--stone)] mt-0.5">{p.metricLabel}</small>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
