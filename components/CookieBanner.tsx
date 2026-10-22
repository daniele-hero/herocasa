'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// v3: consent is no longer pre-ticked, so choices stored under v2 (given with
// pre-ticked toggles) are not valid consent and everyone is asked again once.
const STORAGE_KEY = 'herocasa_cookie_consent_v3';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '2304401749914019';

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  action: 'accept' | 'reject' | 'selected';
  at: string;
  version: 3;
};

function loadConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* storage unavailable (private mode) — consent simply won't persist */
  }
}

/** True only when the visitor explicitly allowed marketing cookies. */
export function hasMarketingConsent(): boolean {
  return loadConsent()?.marketing === true;
}

let pixelLoaded = false;
function initMetaPixel() {
  if (pixelLoaded || typeof window === 'undefined') return;
  pixelLoaded = true;
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: any[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  (window as any).fbq('init', META_PIXEL_ID);
  (window as any).fbq('track', 'PageView');
}

function fbq(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  const f = (window as any).fbq;
  if (typeof f === 'function') f(...args);
}

/**
 * Meta Pixel Lead event — only for a real submission with contact details.
 * Pass the same `eventId` given to `postValuationLead` so Meta dedupes this
 * browser-side delivery against the server-side Conversions API one.
 */
export function trackLead(sourceLabel: string, extra?: Record<string, unknown>, eventId?: string) {
  fbq('track', 'Lead', { content_category: sourceLabel, content_name: 'Valutazione immobile', ...extra }, eventId ? { eventID: eventId } : undefined);
}

/** Meta standard Contact event (WhatsApp / phone clicks): intent, not a lead. */
export function trackContact(sourceLabel: string) {
  fbq('track', 'Contact', { content_category: sourceLabel });
}

/** Custom funnel step (e.g. form opened, step 1 completed) — kept out of Lead so campaigns optimise on real leads. */
export function trackStep(name: string, params?: Record<string, unknown>) {
  fbq('trackCustom', name, params);
}

export default function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
    if (existing.marketing) initMetaPixel();
  }, []);

  const choose = useCallback(
    (action: 'accept' | 'reject' | 'selected') => {
      const finalAnalytics = action === 'accept' ? true : action === 'reject' ? false : analytics;
      const finalMarketing = action === 'accept' ? true : action === 'reject' ? false : marketing;
      saveConsent({
        necessary: true,
        analytics: finalAnalytics,
        marketing: finalMarketing,
        action,
        at: new Date().toISOString(),
        version: 3,
      });
      setAnalytics(finalAnalytics);
      setMarketing(finalMarketing);
      setVisible(false);
      setCustomizing(false);
      if (finalMarketing) initMetaPixel();
    },
    [analytics, marketing],
  );

  // The Footer "cookie preferences" link reopens the banner straight on the choices.
  useEffect(() => {
    const handler = () => {
      const existing = loadConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setMarketing(existing.marketing);
      }
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener('herocasa:open-cookie-banner', handler);
    return () => window.removeEventListener('herocasa:open-cookie-banner', handler);
  }, []);

  // The translation embeds a literal `{locale}` inside an href — swap in the real segment.
  const description = (t.raw('description') as string).replaceAll('{locale}', locale);

  const secondary =
    'px-4 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase bg-transparent text-[var(--olive)] cursor-pointer transition-colors hover:bg-[var(--marble)]';
  const primary =
    'px-7 py-3 text-[13px] font-semibold tracking-[0.08em] uppercase border border-[var(--cta-bg)] bg-[var(--cta-bg)] text-[var(--cta-text)] cursor-pointer transition-colors hover:bg-[var(--cta-bg-hover)] hover:border-[var(--cta-bg-hover)] hover:text-[var(--cta-text-hover)] shadow-[0_6px_18px_rgba(184,146,90,0.35)]';

  return (
    <div
      role="dialog"
      aria-labelledby="cookieBannerTitle"
      aria-describedby="cookieBannerDesc"
      aria-hidden={!visible}
      className="fixed z-[200] left-5 right-5 bottom-5 mx-auto max-w-[780px] bg-[var(--paper)] border border-[var(--olive-15)] shadow-[0_20px_60px_rgba(15,47,39,0.20)] px-7 py-6 transition-[transform,opacity] duration-500"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(140%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div>
        <h4 id="cookieBannerTitle" className="serif text-[22px] font-medium text-[var(--olive)] mb-2" style={{ letterSpacing: '-0.005em' }}>
          {t('title')}
        </h4>
        <p
          id="cookieBannerDesc"
          className="text-[13px] leading-[1.55] text-[var(--olive-70)] max-w-[68ch] [&_a]:text-[var(--gold-ink)] [&_a]:underline [&_a:hover]:text-[var(--olive)]"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {customizing && (
        <div className="flex flex-col gap-3 py-4 mt-4 border-t border-[var(--olive-15)]">
          <label className="grid grid-cols-[20px_1fr] gap-x-3.5 gap-y-0.5 cursor-not-allowed">
            <input type="checkbox" checked disabled className="row-span-2 w-[18px] h-[18px] mt-1 accent-[var(--gold)]" aria-label={t('necessaryTitle')} />
            <span className="text-[13px] font-semibold text-[var(--olive)] tracking-[0.02em]">
              {t('necessaryTitle')}
              <em className="not-italic text-[var(--stone)] font-normal ml-1.5 text-[11px] tracking-[0.08em] uppercase">{t('necessaryBadge')}</em>
            </span>
            <span className="text-[11px] text-[var(--stone)] leading-[1.4] opacity-75">{t('necessaryDesc')}</span>
          </label>

          <label className="grid grid-cols-[20px_1fr] gap-x-3.5 gap-y-0.5 cursor-pointer">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="row-span-2 w-[18px] h-[18px] mt-1 accent-[var(--gold)] cursor-pointer"
              aria-label={t('analyticsTitle')}
            />
            <span className="text-[13px] font-semibold text-[var(--olive)] tracking-[0.02em]">{t('analyticsTitle')}</span>
            <span className="text-[11px] text-[var(--stone)] leading-[1.4] opacity-75">{t('analyticsDesc')}</span>
          </label>

          <label className="grid grid-cols-[20px_1fr] gap-x-3.5 gap-y-0.5 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="row-span-2 w-[18px] h-[18px] mt-1 accent-[var(--gold)] cursor-pointer"
              aria-label={t('marketingTitle')}
            />
            <span className="text-[13px] font-semibold text-[var(--olive)] tracking-[0.02em]">{t('marketingTitle')}</span>
            <span className="text-[11px] text-[var(--stone)] leading-[1.4] opacity-75">{t('marketingDesc')}</span>
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-3 pt-4 mt-4 border-t border-[var(--olive-15)]">
        <button type="button" onClick={() => choose('reject')} className={`${secondary} underline underline-offset-4 decoration-[var(--olive-40)]`}>
          {t('reject')}
        </button>
        {customizing ? (
          <button type="button" onClick={() => choose('selected')} className={`${secondary} border border-[var(--olive-40)]`}>
            {t('acceptSelected')}
          </button>
        ) : (
          <button type="button" onClick={() => setCustomizing(true)} className={`${secondary} border border-[var(--olive-40)]`}>
            {t('customize')}
          </button>
        )}
        <button type="button" onClick={() => choose('accept')} className={`${primary} w-full sm:w-auto`}>
          {t('acceptAll')}
        </button>
      </div>
    </div>
  );
}

/** Dispatch from anywhere (e.g. Footer "cookie preferences" link) to reopen the banner. */
export function openCookieBanner(e?: { preventDefault?: () => void }) {
  e?.preventDefault?.();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('herocasa:open-cookie-banner'));
  }
}
