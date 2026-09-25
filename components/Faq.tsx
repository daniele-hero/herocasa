'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import Reveal from './Reveal';

type QA = { q: string; a: string };

export default function Faq() {
  const t = useTranslations('faq');
  const list = t.raw('list') as QA[];
  const [open, setOpen] = useState<number | null>(0);

  // FAQPage structured data — strips HTML (e.g. <em>) since schema.org Text
  // fields expect plain text, and lets these FAQs show as rich snippets.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a.replace(/<[^>]+>/g, ''),
      },
    })),
  };

  return (
    <section id="faq" className="container-x section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Reveal>
        <div className="flex justify-between items-end gap-6 mb-12 flex-wrap">
          <div>
            <div className="eyebrow">{t('eyebrow')} · vii.</div>
            <h2 className="serif mt-3.5" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em className="gold-italic">{t('titleTwo')}</em>
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="max-w-[900px] mx-auto">
        {list.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`${i === 0 ? 'border-t' : ''} border-b border-[var(--olive-15)]`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full bg-transparent border-0 cursor-pointer py-7 text-left flex justify-between items-center gap-6 serif text-[var(--olive)] transition-colors hover:text-[var(--gold-dark)]"
                style={{ fontSize: 'clamp(20px, 2vw, 26px)', lineHeight: 1.25 }}
              >
                <span>{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                  className="relative w-6 h-6 flex-shrink-0"
                >
                  <span className="absolute top-1/2 left-0 right-0 h-px bg-current -translate-y-1/2" />
                  <span className="absolute left-1/2 top-0 bottom-0 w-px bg-current -translate-x-1/2" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="pr-15 pb-8 text-[16px] leading-[1.65]"
                      style={{ paddingRight: '60px', color: 'var(--olive-70)' }}
                      dangerouslySetInnerHTML={{ __html: item.a }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
