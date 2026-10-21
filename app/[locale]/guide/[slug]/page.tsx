import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import Estimator from '@/components/Estimator';
import Footer from '@/components/Footer';
import MobileCtaBar from '@/components/MobileCtaBar';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CookieBanner from '@/components/CookieBanner';
import { ARTICLES, findArticle } from '@/lib/articles';

const SITE_URL = 'https://herocasa.it';

type Params = { params: Promise<{ locale: string; slug: string }> };

// Guides are Italian-only (Italian tax and permit rules).
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ locale: 'it', slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) notFound();
  const url = `${SITE_URL}/it/guide/${a.slug}`;
  return {
    title: `${a.title} | Herocasa`,
    description: a.description,
    alternates: { canonical: url, languages: { it: url } },
    robots: a.published ? undefined : { index: false, follow: false },
    openGraph: { type: 'article', url, title: a.title, description: a.description, siteName: 'Herocasa', locale: 'it_IT', images: [`${SITE_URL}/og-image.jpg`] },
  };
}

export default async function GuidePage({ params }: Params) {
  const { locale, slug } = await params;
  const a = findArticle(slug);
  if (!a || locale !== 'it') notFound();
  setRequestLocale(locale);
  const updated = new Date(a.updated).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    dateModified: a.updated,
    inLanguage: 'it-IT',
    mainEntityOfPage: `${SITE_URL}/it/guide/${a.slug}`,
    author: { '@type': 'Organization', name: 'Herocasa', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Herocasa', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
  };

  return (
    <>
      {a.published && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <Nav />
      <main>
        {!a.published && (
          <div className="mt-24 bg-[var(--gold)] text-[var(--paper)] text-center text-[12px] tracking-[0.12em] uppercase py-2.5 px-4">
            Bozza in revisione · non indicizzata da Google e non collegata dal sito
          </div>
        )}
        <article className="container-x pt-32 pb-20">
          <div className="max-w-[720px] mx-auto">
            <nav aria-label="Breadcrumb" className="text-[12px] tracking-[0.08em] text-[var(--stone)] mb-8">
              <Link href="/it" className="hover:text-[var(--gold-dark)]">Home</Link>
              <span className="mx-2">/</span>
              <span>Guide per proprietari</span>
            </nav>
            <h1 className="h-display font-normal text-balance" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>
              {a.title}
            </h1>
            <p className="mt-6 text-[19px] leading-[1.55]" style={{ color: 'var(--olive-90)' }}>{a.description}</p>
            <div className="mt-6 pb-8 border-b border-[var(--olive-15)] text-[12px] tracking-[0.14em] uppercase text-[var(--stone)]">
              Aggiornato il {updated} · Herocasa
            </div>
            <div className="article-body mt-10">{a.body}</div>
          </div>
        </article>
        <Estimator sectionNumber="" />
      </main>
      <Footer />
      <MobileCtaBar />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}
