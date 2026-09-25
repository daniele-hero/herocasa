'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const STORAGE_KEY = 'herocasa_cookie_consent_v2';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '2304401749914019';

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  action: 'accept' | 'reject' | 'selected';
  at: string;
  version: 2;
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

/** Fires a Meta Pixel Lead event — call from form submit handlers after consent is possibly granted. */
export function trackLead(sourceLabel: string, extra?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const fbq = (window as any).fbq;
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', { content_category: sourceLabel, content_name: 'Valutazione immobile', ...extra });
  }
}

export default function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

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
      const consent: Consent = {
        necessary: true,
        analytics: finalAnalytics,
        marketing: finalMarketing,
        action,
        at: new Date().toISOString(),
        version: 2,
      };
      saveConsent(consent);
      setVisible(false);
      if (finalMarketing) initMetaPixel();
    },
    [analytics, marketing],
  );

  // Expose a way for the Footer "cookie preferences" link to reopen this banner.
  useEffect(() => {
    const handler = () => {
      const existing = loadConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setMarketing(existing.marketing);
      }
      setVisible(true);
    };
    window.addEventListener('herocasa:open-cookie-banner', handler);
    return () => window.removeEventListener('herocasa:open-cookie-banner', handler);
  }, []);

  // The translation string embeds a literal `{locale}` placeholder inside an
  // href (e.g. `<a href="/{locale}/cookie">`) — swap it for the real locale
  // segment so the Cookie Policy link resolves correctly.
  const description = (t.raw('description') as string).replaceAll('{locale}', locale);

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

      <div className="flex flex-col gap-3 py-4 my-4 border-t border-b border-[var(--olive-15)]">
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

      <div className="flex gap-2.5 flex-wrap justify-end sm:flex-nowrap">
        <button
          type="button"
          onClick={() => choose('reject')}
          className="flex-1 sm:flex-none px-5 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase border border-[var(--olive-40)] bg-transparent text-[var(--olive)] cursor-pointer transition-colors hover:bg-[var(--marble)] hover:border-[var(--olive)]"
        >
          {t('reject')}
        </button>
        <button
          type="button"
          onClick={() => choose('selected')}
          className="flex-1 sm:flex-none px-5 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase border border-[var(--olive)] bg-transparent text-[var(--olive)] cursor-pointer transition-colors hover:bg-[var(--marble)]"
        >
          {t('acceptSelected')}
        </button>
        <button
          type="button"
          onClick={() => choose('accept')}
          className="flex-1 sm:flex-none px-5 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase border border-[var(--gold)] bg-[var(--gold)] text-[var(--paper)] cursor-pointer transition-colors hover:bg-[var(--gold-dark)] hover:border-[var(--gold-dark)]"
        >
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
