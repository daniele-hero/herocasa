import type { Metadata } from 'next';
import { sans, serif } from '@/lib/fonts';
import './globals.css';

// Served by Cloudflare Pages as out/404.html for any unknown URL, in every language:
// Italian first, with a line for English and German visitors.
export const metadata: Metadata = {
  title: 'Pagina non trovata | Herocasa',
  robots: { index: false, follow: true },
};

const WHATSAPP = 'https://wa.me/393663695252?text=' + encodeURIComponent('Ciao, vorrei una valutazione per la mia casa sul Garda');

export default function NotFound() {
  return (
    // The root layout only passes children through (next-intl pattern), so this page brings its own <html>.
    <html lang="it" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <main className="min-h-[100dvh] flex flex-col">
          <header className="container-x pt-6">
            <a href="/it" aria-label="Herocasa — Affitti brevi" className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, small logo */}
              <img src="/logo-nav.png" alt="Herocasa — Affitti brevi" width={448} height={290} className="h-[72px] w-auto block max-[720px]:h-[44px]" />
            </a>
          </header>
          <section className="container-x flex-1 flex items-center py-16">
            <div className="max-w-[680px]">
              <div className="eyebrow">Errore 404</div>
              <h1 className="h-display mt-4" style={{ fontSize: 'clamp(44px, 7vw, 92px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Pagina <em className="gold-italic">non trovata.</em>
              </h1>
              <p className="mt-6 max-w-[52ch]" style={{ fontSize: 'clamp(17px, 1.25vw, 20px)', lineHeight: 1.55, color: 'var(--olive-90)' }}>
                Il link potrebbe essere vecchio o contenere un errore. Ma se cerchi qualcuno che si occupi della tua casa sul Lago di Garda, sei nel posto giusto.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href="/it#valutazione" className="btn gold">Valuta la tua casa · gratis</a>
                <a href="/it" className="btn ghost">Torna alla home</a>
              </div>
              <p className="mt-7 text-[14px]" style={{ color: 'var(--olive-70)' }}>
                Oppure scrivici su{' '}
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-[var(--gold-ink)] underline underline-offset-2 hover:text-[var(--olive)]">
                  WhatsApp
                </a>{' '}
                o chiamaci al{' '}
                <a href="tel:+393663695252" className="text-[var(--gold-ink)] underline underline-offset-2 hover:text-[var(--olive)]">
                  +39 366 369 5252
                </a>
                .
              </p>
              <p className="mt-12 pt-6 border-t border-[var(--olive-15)] text-[13px] text-[var(--stone)]">
                Page not found · <a href="/en" className="underline underline-offset-2 hover:text-[var(--olive)]">English site</a>
                <span className="mx-3" aria-hidden="true">|</span>
                Seite nicht gefunden · <a href="/de" className="underline underline-offset-2 hover:text-[var(--olive)]">Deutsche Website</a>
              </p>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
