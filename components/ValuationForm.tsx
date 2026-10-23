'use client';

import { FormEvent, ReactNode, useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  MIN_PHONE_DIGITS,
  ZONES,
  calculateEstimateRange,
  leadWhatsappLink,
  phoneDigits,
  postValuationLead,
  type EstimateRange,
  type EstimatorFormCopy,
} from '@/lib/estimator-form';
import { hasMarketingConsent, trackContact, trackLead, trackStep } from './CookieBanner';
import Spinner from './Spinner';

const EASE = [0.2, 0.7, 0.2, 1] as const;

type Variant = 'light' | 'dark';

interface ValuationFormProps {
  /** light = on paper (hero), dark = on olive (Estimator section). */
  variant: Variant;
  /** Lead origin, shown in the notification email and sent to Meta. */
  source: string;
  /** Comune landing pages pre-select their town. */
  presetZone?: string;
}

/**
 * Two-step valuation form shared by the hero, the Estimator section and the
 * comune pages. Step 1 asks only about the property (no personal data, low
 * commitment); step 2 asks who to call. Phone is required, email optional:
 * the goal is a callback, and every extra required field costs leads.
 */
export default function ValuationForm({ variant, source, presetZone }: ValuationFormProps) {
  const locale = useLocale();
  const tEst = useTranslations('estimator');
  const tResult = useTranslations('estimator.result');
  const tSuccess = useTranslations('heroForm');
  const form = tEst.raw('form') as EstimatorFormCopy;
  const reduced = useReducedMotion();
  const dark = variant === 'dark';

  const [step, setStep] = useState<1 | 2>(1);
  // Comune pages for towns outside the main list add their own town to the menu.
  const zoneOptions: readonly string[] = presetZone && !(ZONES as readonly string[]).includes(presetZone) ? [presetZone, ...ZONES] : ZONES;
  const [zone, setZone] = useState(presetZone ?? '');
  const [otherZoneName, setOtherZoneName] = useState('');
  // "Zone limitrofe" asks for the town by name, so the lead (and the confirmation) still say where the house is.
  const comune = zone === form.otherZone ? otherZoneName.trim() || zone : zone;
  const [type, setType] = useState('');
  // Stepper over the translated options (1…6+); starts at 2, the most common case.
  const [roomsIdx, setRoomsIdx] = useState(1);
  const rooms = form.roomsOptions[roomsIdx] ?? '';
  const roomsLabelId = useId();
  const stepRooms = (delta: number) => setRoomsIdx((i) => Math.min(Math.max(i + delta, 0), form.roomsOptions.length - 1));
  const [features, setFeatures] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  // wa.me link with the details pre-written, shown when the server didn't confirm the lead.
  const [failed, setFailed] = useState<string | null>(null);
  const [done, setDone] = useState<{ name: string; zone: string; range: EstimateRange; whatsapp: string } | null>(null);

  const toggleFeature = (f: string) =>
    setFeatures((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const goToStepTwo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
    trackStep('ValuationStep1', { source, comune });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const phone = ((data.get('phone') as string) || '').trim();
    // A number we can't dial back is a lost lead: ask to check it before sending.
    if (phoneDigits(phone) < MIN_PHONE_DIGITS) {
      const input = e.currentTarget.elements.namedItem('phone') as HTMLInputElement | null;
      input?.setCustomValidity(form.phoneInvalid);
      input?.reportValidity();
      return;
    }
    setSending(true);
    setFailed(null);
    const name = ((data.get('name') as string) || '').trim();
    const email = ((data.get('email') as string) || '').trim();
    const notes = ((data.get('notes') as string) || '').trim();
    const featureList = [...features];
    const range = calculateEstimateRange({ rooms, type, zone: comune, features: featureList });
    const eventId = crypto.randomUUID();
    const summary = {
      name,
      phone,
      email,
      zone: comune,
      type,
      rooms,
      features: featureList,
      notes,
      estimate: `${tResult('upTo')} ${range.max.toLocaleString('it-IT')} €${tResult('suffix')}`,
    };

    const ok = await postValuationLead({
      source,
      name,
      email,
      phone,
      zone: comune,
      type,
      rooms,
      features: featureList,
      notes,
      submittedAt: new Date().toISOString(),
      eventId,
      locale,
      marketingConsent: hasMarketingConsent(),
      estimatedRange: range,
    });
    if (!ok) {
      setFailed(leadWhatsappLink(form.waIntroFail, form.waLabels, summary));
      setSending(false);
      return;
    }

    trackLead(source, { comune, value: (range.min + range.max) / 2, currency: 'EUR' }, eventId);
    setDone({ name: name.split(' ')[0] || name, zone: comune, range, whatsapp: leadWhatsappLink(form.waIntroSent, form.waLabels, summary) });
  };

  // ---- presentational helpers (one set of markup, two colour schemes) ----
  const labelCls = `block text-[11px] max-sm:text-[12px] tracking-[0.16em] uppercase mb-2 ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--stone)]'}`;
  const fieldCls = dark ? 'est-input' : 'hero-field';
  const selectCls = dark ? 'est-input appearance-none' : 'hero-field hero-select';
  const stepBtnCls = `w-11 h-11 rounded-full border text-[22px] leading-none flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
    dark
      ? 'border-[var(--paper-40)] text-[var(--paper)] enabled:hover:border-[var(--gold)] enabled:hover:text-[var(--gold)]'
      : 'border-[var(--olive-15)] text-[var(--olive)] enabled:hover:border-[var(--gold)] enabled:hover:text-[var(--gold-dark)]'
  }`;

  // Plain function, not a component: a component declared inside render would
  // remount its input on every keystroke and steal focus.
  const field = (label: string, children: ReactNode, wide = false) => (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );

  const stepMotion = reduced
    ? {}
    : { initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -16 }, transition: { duration: 0.35, ease: EASE } };

  if (done) {
    return (
      <motion.div
        role="status"
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className={`serif text-[20px] mb-3 ${dark ? 'text-[var(--paper)]' : 'text-[var(--olive)]'}`}>
          {tSuccess('successTitle', { name: done.name ? `, ${done.name}` : '' })}
        </p>
        <div className={`text-[11px] tracking-[0.16em] uppercase mb-2 ${dark ? 'text-[var(--gold)]' : 'text-[var(--gold-ink)]'}`}>{tResult('label')}</div>
        <div className={`serif ${dark ? 'text-[var(--paper)]' : 'text-[var(--olive)]'}`} style={{ fontSize: 'clamp(30px, 3.4vw, 44px)', lineHeight: 1.05 }}>
          <span className={`text-[0.45em] mr-2 ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--stone)]'}`}>{tResult('upTo')}</span>
          €<em className="gold-italic">{done.range.max.toLocaleString('it-IT')}</em>
          <span className={`text-[0.4em] ml-2 ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--stone)]'}`}>{tResult('suffix')}</span>
        </div>
        <p className={`mt-3 text-[13px] leading-[1.55] max-w-[60ch] ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--olive-70)]'}`}>{tResult('explanation')}</p>
        <p className={`mt-3 text-[14px] leading-[1.55] max-w-[60ch] font-medium ${dark ? 'text-[var(--paper)]' : 'text-[var(--olive)]'}`}>
          {tResult('confirmation', { comune: done.zone })}
        </p>
        <a
          href={done.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContact('whatsapp-after-lead')}
          className="btn gold mt-5"
        >
          {form.waContinue} →
        </a>
        <p className={`mt-2 text-[12px] leading-[1.5] ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--stone)]'}`}>{form.waContinueNote}</p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-5" aria-live="polite">
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2].map((n) => (
            <span
              key={n}
              className="h-[3px] w-8 transition-colors duration-300"
              style={{ background: n <= step ? 'var(--gold)' : dark ? 'var(--paper-40)' : 'var(--olive-15)' }}
            />
          ))}
        </div>
        <span className={`text-[11px] max-sm:text-[12px] tracking-[0.16em] uppercase ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--stone)]'}`}>
          {step}/2 · {step === 1 ? form.stepOne : form.stepTwo}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.form key="step1" onSubmit={goToStepTwo} className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5" {...stepMotion}>
            {field(form.zone, (<select name="zone" required value={zone} onChange={(e) => setZone(e.target.value)} className={selectCls}>
                <option value="" disabled>{form.zonePlaceholder}</option>
                {zoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
                <option value={form.otherZone}>{form.otherZone}</option>
              </select>), true)}
            {zone === form.otherZone &&
              field(form.otherZoneName, (<input name="otherZoneName" type="text" required value={otherZoneName} onChange={(e) => setOtherZoneName(e.target.value)} placeholder={form.otherZonePlaceholder} className={fieldCls} />), true)}
            {field(form.type, (<select name="type" required value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                <option value="" disabled>{form.typePlaceholder}</option>
                {form.types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>))}
            {/* Not wrapped in <label>: clicking a label would trigger its first button (−). */}
            <div role="group" aria-labelledby={roomsLabelId}>
              <span id={roomsLabelId} className={labelCls}>{form.rooms}</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => stepRooms(-1)} disabled={roomsIdx === 0} aria-label={form.roomsDecrease} className={stepBtnCls}>
                  −
                </button>
                <output aria-live="polite" className={`serif min-w-[2.5ch] text-center text-[28px] leading-none ${dark ? 'text-[var(--paper)]' : 'text-[var(--olive)]'}`}>
                  {rooms}
                </output>
                <button type="button" onClick={() => stepRooms(1)} disabled={roomsIdx === form.roomsOptions.length - 1} aria-label={form.roomsIncrease} className={stepBtnCls}>
                  +
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <span className={labelCls}>{form.features}</span>
              <div className="flex flex-wrap gap-2">
                {form.featuresList.map((f) =>
                  dark ? (
                    <button type="button" key={f} onClick={() => toggleFeature(f)} className={`check-chip ${features.has(f) ? 'on' : ''}`} aria-pressed={features.has(f)}>
                      {f}
                    </button>
                  ) : (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleFeature(f)}
                      aria-pressed={features.has(f)}
                      className="px-3 py-1.5 text-[12px] border transition-colors"
                      style={
                        features.has(f)
                          ? { background: 'var(--cta-bg)', borderColor: 'var(--cta-bg)', color: 'var(--cta-text)' }
                          : { background: 'transparent', borderColor: 'var(--olive-15)', color: 'var(--olive)' }
                      }
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="btn gold">{form.next} →</button>
            </div>
          </motion.form>
        ) : (
          <motion.form key="step2" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5" {...stepMotion}>
            {field(form.name, (<input name="name" type="text" required autoComplete="name" className={fieldCls} />), true)}
            {field(form.phone, (
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder={form.phonePlaceholder}
                onInput={(e) => e.currentTarget.setCustomValidity('')}
                className={fieldCls}
              />
            ))}
            {field(form.emailOptional, (<input name="email" type="email" autoComplete="email" className={fieldCls} />))}
            {field(form.notes, (<textarea name="notes" rows={2} placeholder={form.notesPlaceholder} className={`${fieldCls} resize-none`} />), true)}
            {failed && (
              <div
                role="alert"
                className={`sm:col-span-2 p-4 border ${dark ? 'border-[var(--paper-40)] text-[var(--paper)]' : 'border-[var(--olive-15)] bg-[var(--marble)] text-[var(--olive)]'}`}
              >
                <p className="text-[14px] font-semibold mb-1">{form.failTitle}</p>
                <p className={`text-[13px] leading-[1.55] mb-3 ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--olive-70)]'}`}>{form.failBody}</p>
                <a href={failed} target="_blank" rel="noopener noreferrer" onClick={() => trackContact('whatsapp-form-fallback')} className="btn gold sm">
                  {form.failWhatsapp} →
                </a>
              </div>
            )}
            <div className="sm:col-span-2 flex justify-between items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`text-[12px] tracking-[0.08em] uppercase underline underline-offset-4 ${dark ? 'text-[var(--paper-70)]' : 'text-[var(--stone)]'}`}
              >
                ← {form.back}
              </button>
              <button type="submit" disabled={sending} aria-busy={sending} className="btn gold disabled:opacity-80 disabled:cursor-wait">
                {sending ? (
                  <>
                    <Spinner /> {form.sending}
                  </>
                ) : (
                  <>{form.submit} →</>
                )}
              </button>
            </div>
            <p className={`sm:col-span-2 text-[11px] max-sm:text-[12px] leading-[1.5] tracking-[0.06em] uppercase ${dark ? 'text-[var(--paper-60)]' : 'text-[var(--stone)]'}`}>{form.legal}</p>
          </motion.form>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.hero-field) {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--olive-15);
          padding: 9px 0;
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--olive);
          outline: none;
          transition: border-color 200ms ease;
        }
        :global(.hero-field::placeholder) {
          color: var(--olive-40);
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
        :global(.est-input option),
        :global(.hero-field option) {
          color: var(--olive);
          background: var(--paper);
        }
        @media (max-width: 640px) {
          :global(.hero-field),
          :global(.est-input) {
            font-size: 16px; /* prevents iOS auto-zoom on focus */
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
