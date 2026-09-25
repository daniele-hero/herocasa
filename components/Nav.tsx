'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

const LOCALES = ['it', 'en', 'de'] as const;
const SECTIONS = ['servizi', 'processo', 'immobili', 'zone', 'faq', 'contatti'] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const sectionLabels: Record<(typeof SECTIONS)[number], string> = {
    servizi: t('services'),
    processo: t('process'),
    immobili: t('properties'),
    zone: t('zones'),
    faq: t('faq'),
    contatti: t('contact'),
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(246,241,228,0.93)] backdrop-blur-md py-3 border-b border-[var(--olive-15)]'
            : 'py-5'
        }`}
        style={{ paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}
      >
        <Link href={`/${locale}`} className="inline-flex items-center" aria-label="Herocasa — Affitti brevi">
          <Image
            src="/logo.png"
            alt="Herocasa — Affitti brevi"
            width={1004}
            height={650}
            priority
            className={`w-auto transition-[height] duration-300 ${scrolled ? 'h-[76px]' : 'h-[96px]'} max-[720px]:h-[44px]`}
          />
        </Link>

        <div className="hidden lg:flex gap-8 items-center mx-auto">
          <a href="#servizi" className="text-[13px] transition-colors hover:text-[var(--gold-dark)]">{t('services')}</a>
          <a href="#processo" className="text-[13px] transition-colors hover:text-[var(--gold-dark)]">{t('process')}</a>
          <a href="#immobili" className="text-[13px] transition-colors hover:text-[var(--gold-dark)]">{t('properties')}</a>
          <a href="#zone" className="text-[13px] transition-colors hover:text-[var(--gold-dark)]">{t('zones')}</a>
          <a href="#faq" className="text-[13px] transition-colors hover:text-[var(--gold-dark)]">{t('faq')}</a>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex gap-2 items-center">
            {LOCALES.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                <Link
                  href={`/${l}`}
                  className={`text-[11px] font-medium tracking-[0.16em] uppercase py-1 px-0.5 transition-colors ${
                    l === locale ? 'text-[var(--olive)] border-b border-[var(--gold)]' : 'text-[var(--stone)] hover:text-[var(--olive)]'
                  }`}
                >
                  {l}
                </Link>
                {i < LOCALES.length - 1 && <span className="text-[var(--olive-15)]" aria-hidden>·</span>}
              </span>
            ))}
          </div>
          <a href="#valutazione" className="btn gold sm hidden sm:inline-flex">{t('cta')}</a>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center bg-transparent border-0 cursor-pointer w-11 h-11 relative"
            aria-label="Apri menu"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span className="absolute left-2.5 right-2.5 h-px bg-[var(--olive)]" style={{ top: 16 }} />
            <span className="absolute left-2.5 right-2.5 h-px bg-[var(--olive)]" style={{ top: 26 }} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[60] bg-[var(--olive)] text-[var(--paper)] p-6 flex flex-col overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Chiudi menu"
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-[var(--paper-40)] flex items-center justify-center transition-colors hover:border-[var(--gold)]"
            >
              <span className="relative w-4 h-4">
                <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--paper)] rotate-45" />
                <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--paper)] -rotate-45" />
              </span>
            </button>

            <nav className="flex flex-col flex-1 mt-24">
              {SECTIONS.map((id, i) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={closeMenu}
                  className="py-[18px] flex items-baseline gap-5 border-b border-[var(--paper-40)] font-serif text-[32px] leading-none text-[var(--paper)] transition-colors hover:text-[var(--gold)]"
                >
                  <span className="font-sans text-[11px] tracking-[0.16em] text-[var(--gold)] min-w-[24px]">{String(i + 1).padStart(2, '0')}</span>
                  {sectionLabels[id]}
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-[var(--paper-40)] flex flex-col gap-5">
              <div className="flex gap-3 items-center text-[13px] tracking-[0.16em] uppercase">
                {LOCALES.map((l, i) => (
                  <span key={l} className="flex items-center gap-3">
                    <Link
                      href={`/${l}`}
                      onClick={closeMenu}
                      className={l === locale ? 'text-[var(--paper)] border-b border-[var(--gold)] py-1' : 'text-[var(--paper-70)] py-1'}
                    >
                      {l}
                    </Link>
                    {i < LOCALES.length - 1 && <span className="text-[var(--paper-40)]">·</span>}
                  </span>
                ))}
              </div>
              <a href="#valutazione" onClick={closeMenu} className="btn gold justify-center py-[18px] text-[14px]">
                {t('cta')}
              </a>
              <div className="flex flex-col gap-2 font-serif text-[18px] text-[var(--paper-70)]">
                <a href="mailto:info@herocasa.it?subject=Richiesta%20valutazione%20immobile" className="transition-colors hover:text-[var(--gold)]">
                  info@herocasa.it
                </a>
                <a href="tel:+393663695252" className="transition-colors hover:text-[var(--gold)]">
                  +39 366 369 5252
                </a>
                <a
                  href="https://wa.me/393663695252?text=Ciao%2C%20vorrei%20una%20valutazione%20per%20la%20mia%20casa%20sul%20Garda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--gold)]"
                >
                  WhatsApp ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
