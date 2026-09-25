'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import Reveal from './Reveal';
import { trackLead } from './CookieBanner';
import { calculateEstimateRange, type EstimateRange } from '@/lib/estimator-form';

type ResultState = (EstimateRange & { comune: string }) | null;

const ZONES = [
  'Peschiera del Garda',
  'Lazise',
  'Castelnuovo del Garda',
  'Bardolino',
  'Sirmione',
  'Desenzano del Garda',
  'Padenghe sul Garda',
];

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.'];

export default function Estimator() {
  const t = useTranslations('estimator');
  const form = t.raw('form') as Record<string, string | string[]>;
  const result = t.raw('result') as { label: string; suffix: string; explanation: string };
  const side = t.raw('side') as {
    eyebrow: string;
    titleOne: string;
    titleTwo: string;
    items: Array<{ title: string; body: string }>;
  };

  const [features, setFeatures] = useState<Set<string>>(new Set());
  const [range, setRange] = useState<ResultState>(null);

  const toggleFeature = (f: string) =>
    setFeatures((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const rooms = (data.get('rooms') as string) || '';
    const type = (data.get('type') as string) || '';
    const zone = (data.get('zone') as string) || '';
    const featureList = [...features];

    const { min, max } = calculateEstimateRange({ rooms, type, zone, features: featureList });
    setRange({ min, max, comune: zone });
    // Also POST the lead to the backend
    try {
      await fetch('/api/valuation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'estimator-form',
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          zone,
          type,
          rooms,
          features: featureList,
          notes: data.get('notes'),
          estimatedRange: { min, max },
        }),
      });
    } catch {
      // Silent — the preview still shows; production endpoint handles retry/logging.
    }

    // Meta Pixel: Lead event (fires only if the visitor consented to marketing cookies)
    trackLead('estimator-form', { comune: zone, type, rooms, value: (min + max) / 2, currency: 'EUR' });
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
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>{t('eyebrow')} · vi.</div>
            <h2 className="serif mt-4 text-[var(--paper)]" style={{ fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.08 }}>
              {t('titleOne')}<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{t('titleTwo')}</em>
            </h2>
            <p className="mt-6" style={{ color: 'var(--paper-70)' }}>{t('intro')}</p>
          </div>
        </Reveal>

        <div className="grid gap-15 items-start md:grid-cols-[6fr_5fr] md:gap-24">
          <Reveal>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 p-6 sm:p-10 border border-[var(--paper-40)]"
              style={{ background: 'rgba(246,241,228,0.04)' }}
              onSubmit={onSubmit}
            >
              <label className="block">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.name as string}</span>
                <input name="name" type="text" required className="est-input" />
              </label>
              <label className="block">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.email as string}</span>
                <input name="email" type="email" required className="est-input" />
              </label>
              <label className="block">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.phone as string}</span>
                <input name="phone" type="tel" required className="est-input" />
              </label>
              <label className="block">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.zone as string}</span>
                <select name="zone" required defaultValue="" className="est-input appearance-none">
                  <option value="" disabled>{form.zonePlaceholder as string}</option>
                  {ZONES.map((z) => <option key={z}>{z}</option>)}
                  <option>{form.otherZone as string}</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.type as string}</span>
                <select name="type" required defaultValue="" className="est-input appearance-none">
                  <option value="" disabled>{form.typePlaceholder as string}</option>
                  {(form.types as string[]).map((typ) => <option key={typ}>{typ}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.rooms as string}</span>
                <select name="rooms" required defaultValue="" className="est-input appearance-none">
                  <option value="" disabled>{form.zonePlaceholder as string}</option>
                  {(form.roomsOptions as string[]).map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>

              <div className="sm:col-span-2">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.features as string}</span>
                <div className="flex flex-wrap gap-2.5 mt-1">
                  {(form.featuresList as string[]).map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`check-chip ${features.has(f) ? 'on' : ''}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block sm:col-span-2">
                <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.notes as string}</span>
                <textarea name="notes" rows={3} className="est-input" style={{ fontSize: 17 }} placeholder={form.notesPlaceholder as string} />
              </label>

              <AnimatePresence>
                {range && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                    className="sm:col-span-2 p-8 border border-[var(--gold)]"
                    style={{ background: 'rgba(184,146,90,0.12)' }}
                  >
                    <div className="text-[11px] tracking-[0.16em] uppercase mb-3" style={{ color: 'var(--gold)' }}>{result.label}</div>
                    <div className="serif text-[var(--paper)]" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1 }}>
                      €<em className="gold-italic">{range.min.toLocaleString('it-IT')}</em> – €<em className="gold-italic">{range.max.toLocaleString('it-IT')}</em>
                      <span className="text-[0.4em] ml-2" style={{ color: 'var(--paper-70)' }}>{result.suffix}</span>
                    </div>
                    <p className="mt-3.5 text-[14px] max-w-[60ch] leading-[1.55]" style={{ color: 'var(--paper-70)' }}>{result.explanation}</p>
                    <p className="mt-2.5 text-[14px] max-w-[60ch] leading-[1.55] font-medium" style={{ color: 'var(--paper)' }}>
                      {t('result.confirmation', { comune: range.comune })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="sm:col-span-2 flex justify-between items-center gap-5 flex-wrap">
                <div className="text-[11px] tracking-[0.06em] uppercase" style={{ color: 'var(--paper-40)' }}>
                  {form.legal as string}
                </div>
                <button type="submit" className="btn gold">{form.submit as string}</button>
              </div>
            </form>
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
