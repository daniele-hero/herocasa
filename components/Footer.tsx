'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { openCookieBanner } from './CookieBanner';

export default function Footer() {
  const t = useTranslations('footer');
  const n = useTranslations('nav');
  const locale = useLocale();
  const s = useTranslations('services');
  const svc = s.raw('list') as Array<{ title: string }>;

  return (
    <footer className="bg-[var(--shadow)] pt-15 pb-8" style={{ padding: '60px var(--gutter) 32px', color: 'var(--paper-70)', fontSize: '13px' }}>
      <div className="max-w-[1440px] mx-auto grid gap-10 pb-10 border-b border-[var(--paper-40)] md:grid-cols-[4fr_3fr_3fr_3fr]">
        <div>
          <div className="inline-flex mb-5">
            {/* Original transparent PNG — no background wrapper, sits directly on dark footer */}
            <img
              src="/logo.png"
              alt="Herocasa — Affitti brevi"
              width={1004}
              height={650}
              className="h-[96px] w-auto block"
            />
          </div>
          <p className="max-w-[34ch]">{t('tagline')}</p>
        </div>
        <div>
          <h4 className="serif font-medium text-[20px] text-[var(--paper)] mb-4">{t('servicesTitle')}</h4>
          <ul className="list-none flex flex-col gap-2">
            {svc.slice(0, 5).map((it, i) => (
              <li key={i}><a href="#servizi" className="transition-colors hover:text-[var(--gold)]">{it.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="serif font-medium text-[20px] text-[var(--paper)] mb-4">{t('infoTitle')}</h4>
          <ul className="list-none flex flex-col gap-2">
            <li><a href="#processo" className="transition-colors hover:text-[var(--gold)]">{n('process')}</a></li>
            <li><a href="#immobili" className="transition-colors hover:text-[var(--gold)]">{n('properties')}</a></li>
            <li><a href="#zone" className="transition-colors hover:text-[var(--gold)]">{n('zones')}</a></li>
            <li><a href="#faq" className="transition-colors hover:text-[var(--gold)]">{n('faq')}</a></li>
            <li><a href="#contatti" className="transition-colors hover:text-[var(--gold)]">{n('contact')}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="serif font-medium text-[20px] text-[var(--paper)] mb-4">{t('contactTitle')}</h4>
          <ul className="list-none flex flex-col gap-2">
            <li><a href="mailto:info@herocasa.it?subject=Richiesta%20valutazione%20immobile" className="transition-colors hover:text-[var(--gold)]">info@herocasa.it</a></li>
            <li><a href="tel:+393663695252" className="transition-colors hover:text-[var(--gold)]">+39 366 369 5252</a></li>
            <li>
              <a
                href="https://wa.me/393663695252?text=Ciao%2C%20vorrei%20una%20valutazione%20per%20la%20mia%20casa%20sul%20Garda"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--gold)]"
              >
                WhatsApp ↗
              </a>
            </li>
            <li>Lun-Ven 9:00-18:00</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-6 flex flex-wrap justify-between gap-6 text-[11px] tracking-[0.08em] uppercase" style={{ color: 'var(--paper-40)' }}>
        <div>{t('legal')}</div>
        <div>
          <Link href={`/${locale}/privacy`} className="transition-colors hover:text-[var(--gold)]">{t('privacy')}</Link> · <Link href={`/${locale}/cookie`} className="transition-colors hover:text-[var(--gold)]">{t('cookies')}</Link> · <Link href={`/${locale}/termini`} className="transition-colors hover:text-[var(--gold)]">{t('terms')}</Link> ·{' '}
          <button type="button" onClick={openCookieBanner} className="transition-colors hover:text-[var(--gold)] underline-offset-2">
            Preferenze cookie
          </button>
        </div>
      </div>
    </footer>
  );
}
