import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PolicyLayoutProps {
  locale: string;
  eyebrow: string;
  title: ReactNode;
  lede: string;
  lastUpdated: string;
  children: ReactNode;
}

/** Layout condiviso per Privacy, Cookie, Termini. */
export default function PolicyLayout({
  locale,
  eyebrow,
  title,
  lede,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  const backLabel = { it: '← Torna al sito', en: '← Back to site', de: '← Zurück zur Website' }[locale] ?? '← Back';

  return (
    <>
      <nav className="flex items-center justify-between border-b border-[var(--olive-15)]" style={{ padding: '24px var(--gutter)' }}>
        <Link href={`/${locale}`} aria-label="Herocasa">
          <Image src="/logo.png" alt="Herocasa — Affitti brevi" width={1004} height={650} className="h-[60px] w-auto block" priority />
        </Link>
        <Link
          href={`/${locale}`}
          className="text-[13px] font-medium tracking-[0.08em] uppercase text-[var(--olive)] py-1.5 border-b border-[var(--olive-15)] transition-colors hover:text-[var(--gold-dark)] hover:border-[var(--gold)]"
        >
          {backLabel}
        </Link>
      </nav>

      <main className="max-w-[780px] mx-auto" style={{ padding: 'clamp(60px, 8vw, 120px) var(--gutter) clamp(80px, 10vw, 160px)' }}>
        <div className="eyebrow mb-5">{eyebrow}</div>
        <h1 className="serif font-normal text-[var(--olive)] mb-8" style={{ fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>
          {title}
        </h1>

        <div
          className="border-l-[3px] border-[var(--gold)] mb-10 p-4 text-[13px]"
          style={{ background: 'rgba(184, 146, 90, 0.10)', color: 'var(--olive-70)' }}
        >
          <strong className="text-[var(--gold-dark)]">Nota:</strong> questo testo è un <em>placeholder legale</em> generato in fase di sviluppo. Prima del go-live va rivisto e integrato con il vostro DPO / consulente legale.
        </div>

        <p className="text-[19px] max-w-[60ch] mb-15" style={{ color: 'var(--olive-90)' }}>{lede}</p>

        <div className="policy-body">{children}</div>

        <div className="inline-block text-[12px] tracking-[0.14em] uppercase text-[var(--stone)] border-t border-[var(--olive-15)] pt-3 mt-15">
          Ultimo aggiornamento: {lastUpdated}
        </div>
      </main>

      <style>{`
        .policy-body h2 { font-family: var(--font-serif); font-weight: 500; font-size: 30px; line-height: 1.15; color: var(--olive); margin-top: 48px; margin-bottom: 16px; }
        .policy-body h3 { font-weight: 600; font-size: 15px; color: var(--olive); margin-top: 28px; margin-bottom: 10px; }
        .policy-body p { color: var(--olive-90); margin-bottom: 16px; font-size: 16px; line-height: 1.65; }
        .policy-body ul { list-style: none; padding-left: 0; margin: 16px 0; }
        .policy-body li { color: var(--olive-90); font-size: 16px; padding-left: 20px; position: relative; margin-bottom: 8px; }
        .policy-body li::before { content: "·"; color: var(--gold); position: absolute; left: 0; top: -4px; font-size: 24px; }
        .policy-body a { color: var(--gold-dark); text-decoration: none; }
        .policy-body a:hover { color: var(--olive); }
      `}</style>
    </>
  );
}
