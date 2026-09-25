'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

export default function Contact() {
  const t = useTranslations('contact');
  const callCta = t.raw('callCta') as {
    eyebrow: string;
    title: string;
    body: string;
    bullets: string[];
    cta: string;
    orWrite: string;
  };

  return (
    <section id="contatti" className="container-x section-y">
      <Reveal>
        <div className="grid gap-15 md:grid-cols-[5fr_6fr] md:gap-24 md:items-start">
          <div>
            <div className="eyebrow">{t('eyebrow')} · viii.</div>
            <h2 className="serif mt-4" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em className="gold-italic">{t('titleTwo')}</em>
            </h2>
            <p className="mt-6 max-w-[42ch]" style={{ color: 'var(--olive-90)' }}>{t('body')}</p>

            <div className="flex flex-col gap-7 mt-10">
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--stone)]">{t('emailLabel')}</div>
                <a href="mailto:info@herocasa.it?subject=Richiesta%20valutazione%20immobile" className="serif text-[22px] text-[var(--olive)] transition-colors hover:text-[var(--gold-dark)]">info@herocasa.it</a>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--stone)]">{t('phoneLabel')}</div>
                <a href="tel:+393663695252" className="serif text-[22px] text-[var(--olive)] transition-colors hover:text-[var(--gold-dark)]">+39 366 369 5252</a>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--stone)]">WhatsApp</div>
                <a
                  href="https://wa.me/393663695252?text=Ciao%2C%20vorrei%20una%20valutazione%20per%20la%20mia%20casa%20sul%20Garda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="serif text-[22px] text-[var(--olive)] transition-colors hover:text-[var(--gold-dark)]"
                >
                  {t('whatsappCta')} <span aria-hidden="true" className="text-[0.8em]">↗</span>
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--stone)]">{t('hoursLabel')}</div>
                <div className="text-[15px] whitespace-pre-line" style={{ color: 'var(--olive-70)' }}>{t('hours')}</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--olive)] text-[var(--paper)] p-8 sm:p-12">
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>{callCta.eyebrow}</div>
            <h3 className="serif font-medium text-[32px] text-[var(--paper)] mt-4 mb-5">{callCta.title}</h3>
            <p className="mb-8" style={{ color: 'var(--paper-70)' }}>{callCta.body}</p>
            <ul className="list-none flex flex-col gap-3.5 mb-10 pb-10 border-b border-[var(--paper-40)]">
              {callCta.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 items-baseline text-[15px] text-[var(--paper)]">
                  <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full flex-shrink-0 translate-y-1" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <a href="#valutazione" className="btn w-full justify-center py-4" style={{ background: 'var(--gold)', borderColor: 'var(--gold)', color: 'var(--olive)' }}>{callCta.cta}</a>
            <div className="text-center mt-6 text-[13px]" style={{ color: 'var(--paper-70)' }}>
              {callCta.orWrite}{' '}
              <a href="mailto:info@herocasa.it" style={{ color: 'var(--gold)' }} className="transition-colors hover:text-[var(--paper)]">info@herocasa.it</a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
