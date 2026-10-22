'use client';

import { FormEvent, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from './Reveal';
import { hasMarketingConsent, trackContact, trackLead } from './CookieBanner';
import Spinner from './Spinner';
import { MIN_PHONE_DIGITS, ZONES, leadWhatsappLink, phoneDigits, postValuationLead, type EstimatorFormCopy } from '@/lib/estimator-form';

export default function Contact({ numeral = 'viii.' }: { numeral?: string } = {}) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const tEst = useTranslations('estimator');
  const form = tEst.raw('form') as EstimatorFormCopy;
  const callCta = t.raw('callCta') as {
    eyebrow: string;
    title: string;
    body: string;
    bullets: string[];
    cta: string;
    orWrite: string;
    success: string;
  };

  const [sending, setSending] = useState(false);
  // After sending: wa.me link to keep talking; on failure: the same with the details, as a fallback.
  const [sent, setSent] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [zoneChoice, setZoneChoice] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const phone = ((data.get('phone') as string) || '').trim();
    if (phoneDigits(phone) < MIN_PHONE_DIGITS) {
      const input = e.currentTarget.elements.namedItem('phone') as HTMLInputElement | null;
      input?.setCustomValidity(form.phoneInvalid);
      input?.reportValidity();
      return;
    }
    setSending(true);
    setFailed(null);
    const zone = ((data.get('otherZoneName') as string) || '').trim() || (data.get('zone') as string) || '';
    const name = ((data.get('name') as string) || '').trim();
    const email = ((data.get('email') as string) || '').trim();
    const eventId = crypto.randomUUID();
    const summary = { name, phone, email, zone };

    const ok = await postValuationLead({
      source: 'call-booking-form',
      name,
      email,
      phone,
      zone,
      type: '',
      rooms: '',
      features: [],
      notes: '',
      submittedAt: new Date().toISOString(),
      eventId,
      locale,
      marketingConsent: hasMarketingConsent(),
    });

    if (!ok) {
      setFailed(leadWhatsappLink(form.waIntroFail, form.waLabels, summary));
      setSending(false);
      return;
    }

    trackLead('call-booking-form', { comune: zone }, eventId);
    setSent(leadWhatsappLink(form.waIntroCall, form.waLabels, summary));
  };

  return (
    <section id="contatti" className="container-x section-y">
      <Reveal>
        <div className="grid gap-15 md:grid-cols-[5fr_6fr] md:gap-24 md:items-start">
          <div>
            <div className="eyebrow">{t('eyebrow')} · {numeral}</div>
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
            {sent ? (
              <div role="status">
                <p className="serif text-[22px] leading-[1.35] text-[var(--paper)]">{callCta.success}</p>
                <a href={sent} target="_blank" rel="noopener noreferrer" onClick={() => trackContact('whatsapp-after-call-request')} className="btn gold mt-5">
                  {form.waContinue} →
                </a>
                <p className="mt-2 text-[12px] leading-[1.5]" style={{ color: 'var(--paper-70)' }}>{form.waContinueNote}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <label className="block">
                  <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.name}</span>
                  <input name="name" type="text" required autoComplete="name" className="est-input" />
                </label>
                <label className="block">
                  <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.phone}</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={form.phonePlaceholder}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                    className="est-input"
                  />
                </label>
                <label className="block">
                  <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.emailOptional}</span>
                  <input name="email" type="email" autoComplete="email" className="est-input" />
                </label>
                <label className="block">
                  <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.zone}</span>
                  <select name="zone" required value={zoneChoice} onChange={(e) => setZoneChoice(e.target.value)} className="est-input appearance-none">
                    <option value="" disabled>{form.zonePlaceholder}</option>
                    {ZONES.map((z) => <option key={z}>{z}</option>)}
                    <option>{form.otherZone}</option>
                  </select>
                </label>
                {zoneChoice === form.otherZone && (
                  <label className="block">
                    <span className="block text-[11px] tracking-[0.16em] uppercase mb-2.5" style={{ color: 'var(--paper-70)' }}>{form.otherZoneName}</span>
                    <input name="otherZoneName" type="text" required placeholder={form.otherZonePlaceholder} className="est-input" />
                  </label>
                )}
                {failed && (
                  <div role="alert" className="p-4 border border-[var(--paper-40)] text-[var(--paper)]">
                    <p className="text-[14px] font-semibold mb-1">{form.failTitle}</p>
                    <p className="text-[13px] leading-[1.55] mb-3" style={{ color: 'var(--paper-70)' }}>{form.failBody}</p>
                    <a href={failed} target="_blank" rel="noopener noreferrer" onClick={() => trackContact('whatsapp-call-fallback')} className="btn gold sm">
                      {form.failWhatsapp} →
                    </a>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  aria-busy={sending}
                  className="btn w-full justify-center py-4 disabled:opacity-80 disabled:cursor-wait"
                  style={{ background: 'var(--cta-bg)', borderColor: 'var(--cta-bg)', color: 'var(--cta-text)' }}
                >
                  {sending ? (
                    <>
                      <Spinner /> {form.sending}
                    </>
                  ) : (
                    callCta.cta
                  )}
                </button>
              </form>
            )}
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
