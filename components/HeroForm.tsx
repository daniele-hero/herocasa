'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ZONES, postValuationLead, calculateEstimateRange, type EstimatorFormCopy, type EstimateRange } from '@/lib/estimator-form';
import { trackLead } from './CookieBanner';

const EASE = [0.2, 0.7, 0.2, 1] as const;

/**
 * Hero lead-magnet: collapsed CTA by default → click cascades open the
 * exact same questions as the full Estimator section below (same
 * `estimator.form` translation namespace — one source of truth, so the two
 * forms can never drift apart).
 */
export default function HeroForm() {
  const tHero = useTranslations('hero');
  const tEst = useTranslations('estimator');
  const tForm = useTranslations('heroForm');
  const tResult = useTranslations('estimator.result');
  const form = tEst.raw('form') as EstimatorFormCopy;
  const reduced = useReducedMotion();

  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState<{ name: string; comune: string; range: EstimateRange } | null>(null);
  const [features, setFeatures] = useState<Set<string>>(new Set());

  const toggleFeature = (f: string) =>
    setFeatures((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const open = () => {
    setExpanded(true);
    trackLead('hero-cta-open', {});
  };
  const close = () => setExpanded(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get('name') as string) || '';
    const comune = (data.get('zone') as string) || '';
    const type = (data.get('type') as string) || '';
    const rooms = (data.get('rooms') as string) || '';
    const featureList = [...features];

    const range = calculateEstimateRange({ rooms, type, zone: comune, features: featureList });

    await postValuationLead({
      source: 'hero-form-full',
      name,
      email: (data.get('email') as string) || '',
      phone: (data.get('phone') as string) || '',
      zone: comune,
      type,
      rooms,
      features: featureList,
      notes: (data.get('notes') as string) || '',
      submittedAt: new Date().toISOString(),
    });

    trackLead('hero-form-full', { comune, value: (range.min + range.max) / 2, currency: 'EUR' });
    setSubmitted({ name: name.split(' ')[0] || name, comune, range });
  };

  return (
    <div className="flex flex-col gap-3.5">
      <AnimatePresence mode="wait" initial={false}>
        {!expanded && (
          <motion.button
            key="cta"
            type="button"
            onClick={open}
            className="btn gold self-start"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tHero('primaryCta')}
          </motion.button>
        )}

        {expanded && !submitted && (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="bg-[var(--paper)] border border-[var(--olive-15)] shadow-[0_16px_48px_rgba(15,47,39,0.10)] px-6 sm:px-7 pt-6 pb-5 max-w-[560px]"
            initial={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex justify-between items-center mb-3.5 pb-3 border-b border-[var(--olive-15)]">
              <span className="eyebrow" style={{ marginBottom: 0 }}>
                {tEst('eyebrow')}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Chiudi"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[22px] leading-none text-[var(--stone)] transition-colors hover:bg-[var(--marble)] hover:text-[var(--olive)]"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-2.5">
              {(
                [
                  {
                    key: 'name',
                    span: true,
                    node: <input name="name" type="text" required placeholder={form.name} className="hero-field" />,
                  },
                  {
                    key: 'email',
                    span: false,
                    node: <input name="email" type="email" required placeholder={form.email} className="hero-field" />,
                  },
                  {
                    key: 'phone',
                    span: false,
                    node: <input name="phone" type="tel" required placeholder={form.phone} className="hero-field" />,
                  },
                  {
                    key: 'zone',
                    span: false,
                    node: (
                      <select name="zone" required defaultValue="" className="hero-field hero-select">
                        <option value="" disabled>
                          {form.zone}
                        </option>
                        {ZONES.map((z) => (
                          <option key={z} value={z}>
                            {z}
                          </option>
                        ))}
                        <option value={form.otherZone}>{form.otherZone}</option>
                      </select>
                    ),
                  },
                  {
                    key: 'type',
                    span: false,
                    node: (
                      <select name="type" required defaultValue="" className="hero-field hero-select">
                        <option value="" disabled>
                          {form.type}
                        </option>
                        {form.types.map((typ) => (
                          <option key={typ} value={typ}>
                            {typ}
                          </option>
                        ))}
                      </select>
                    ),
                  },
                  {
                    key: 'rooms',
                    span: false,
                    node: (
                      <select name="rooms" required defaultValue="" className="hero-field hero-select">
                        <option value="" disabled>
                          {form.rooms}
                        </option>
                        {form.roomsOptions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ),
                  },
                  {
                    key: 'features',
                    span: true,
                    node: (
                      <div className="pt-1.5">
                        <span className="block text-[10px] tracking-[0.14em] uppercase text-[var(--stone)] mb-2">{form.features}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {form.featuresList.map((f) => (
                            <button
                              type="button"
                              key={f}
                              onClick={() => toggleFeature(f)}
                              className="px-3 py-1.5 text-[11px] border transition-colors"
                              style={
                                features.has(f)
                                  ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: 'var(--paper)' }
                                  : { background: 'transparent', borderColor: 'var(--olive-15)', color: 'var(--olive)' }
                              }
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'notes',
                    span: true,
                    node: <textarea name="notes" rows={2} placeholder={form.notesPlaceholder} className="hero-field resize-none" />,
                  },
                ] as const
              ).map((field, i) => (
                <motion.div
                  key={field.key}
                  className={field.span ? 'sm:col-span-2' : ''}
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: reduced ? 0 : 0.06 + i * 0.055, ease: EASE }}
                >
                  {field.node}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex justify-between items-center gap-4 flex-wrap mt-4 pt-3.5 border-t border-[var(--olive-15)]"
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : 0.5, ease: EASE }}
            >
              <span className="text-[11px] text-[var(--stone)]">{tHero('trust')}</span>
              <button type="submit" className="btn gold" style={{ padding: '12px 22px', fontSize: 12 }}>
                {form.submit} →
              </button>
            </motion.div>
          </motion.form>
        )}

        {submitted && (
          <motion.div
            key="success"
            className="bg-[rgba(184,146,90,0.08)] border border-[var(--gold)] px-7 py-6 max-w-[560px]"
            initial={reduced ? undefined : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="serif text-[18px] text-[var(--olive)] mb-3">
              {tForm('successTitle', { name: submitted.name ? `, ${submitted.name}` : '' })}
            </p>
            <div className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-dark)] mb-2">{tResult('label')}</div>
            <div className="serif text-[var(--olive)]" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)', lineHeight: 1 }}>
              €<em className="gold-italic">{submitted.range.min.toLocaleString('it-IT')}</em> – €
              <em className="gold-italic">{submitted.range.max.toLocaleString('it-IT')}</em>
              <span className="text-[0.4em] ml-2 text-[var(--stone)]">{tResult('suffix')}</span>
            </div>
            <p className="mt-3.5 text-[14px] leading-[1.55] text-[var(--olive-70)]">
              {tResult('confirmation', { comune: submitted.comune })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <div className="flex items-center gap-6 flex-wrap text-[12px] text-[var(--stone)]">
          <span>{tHero('trust')}</span>
          <a href="#processo" className="btn-arrow" style={{ fontSize: 12 }}>
            {tHero('secondaryCta')} <span className="arrow" />
          </a>
        </div>
      )}

      <style jsx>{`
        :global(.hero-field) {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--olive-15);
          padding: 9px 0;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--olive);
          outline: none;
          transition: border-color 200ms ease;
        }
        :global(.hero-field::placeholder) {
          color: var(--olive-40, rgba(30, 77, 66, 0.4));
        }
        :global(.hero-field:focus) {
          border-color: var(--gold);
        }
        :global(.hero-select) {
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
          background-image: linear-gradient(45deg, transparent 50%, var(--olive) 50%), linear-gradient(-45deg, transparent 50%, var(--olive) 50%);
          background-position:
            calc(100% - 12px) 16px,
            calc(100% - 7px) 16px;
          background-size: 5px 5px;
          background-repeat: no-repeat;
          padding-right: 22px;
        }
        @media (max-width: 640px) {
          :global(.hero-field) {
            font-size: 16px; /* prevents iOS auto-zoom on focus */
            min-height: 44px;
            padding: 11px 0;
          }
        }
      `}</style>
    </div>
  );
}
