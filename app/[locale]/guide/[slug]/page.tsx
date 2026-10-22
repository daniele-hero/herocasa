import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import Estimator from '@/components/Estimator';
import Footer from '@/components/Footer';
import MobileCtaBar from '@/components/MobileCtaBar';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CookieBanner from '@/components/CookieBanner';
import { GUIDE_CONTENT } from '@/lib/articles';
import { PUBLISHED_GUIDES, findGuide, guideParams, guidePath } from '@/lib/guide-links';
import { routing, type Locale } from '@/lib/routing';

const SITE_URL = 'https://herocasa.it';
const OG_LOCALE: Record<Locale, string> = { it: 'it_IT', en: 'en_US', de: 'de_DE' };
const DATE_LOCALE: Record<Locale, string> = { it: 'it-IT', en: 'en-GB', de: 'de-DE' };

type Params = { params: Promise<{ locale: string; slug: string }> };

// IT and EN use /guide/; DE has its own segment (/de/ratgeber/), see ../../ratgeber/[slug]/page.tsx.
export function generateStaticParams() {
  return guideParams('guide');
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = findGuide(locale, slug);
  if (!guide) notFound();
  const l = locale as Locale;
  const text = GUIDE_CONTENT[guide.id][l];
  const url = `${SITE_URL}${guidePath(l, guide)}`;
  return {
    title: `${text.title} | Herocasa`,
    description: text.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(routing.locales.map((x) => [x, `${SITE_URL}${guidePath(x, guide)}`])),
    },
    robots: guide.published ? undefined : { index: false, follow: false },
    openGraph: { type: 'article', url, title: text.title, description: text.description, siteName: 'Herocasa', locale: OG_LOCALE[l], images: [`${SITE_URL}/og-image.jpg`] },
  };
}

export default async function GuidePage({ params }: Params) {
  const { locale, slug } = await params;
  const guide = findGuide(locale, slug);
  if (!guide) notFound();
  const l = locale as Locale;
  setRequestLocale(l);
  const t = await getTranslations('guides');
  const content = GUIDE_CONTENT[guide.id];
  const text = content[l];
  const updated = new Date(content.updated).toLocaleDateString(DATE_LOCALE[l], { day: 'numeric', month: 'long', year: 'numeric' });
  const others = PUBLISHED_GUIDES.filter((g) => g.id !== guide.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: text.title,
    description: text.description,
    dateModified: content.updated,
    inLanguage: DATE_LOCALE[l],
    mainEntityOfPage: `${SITE_URL}${guidePath(l, guide)}`,
    author: { '@type': 'Organization', name: 'Herocasa', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Herocasa', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
  };

  return (
    <>
      {guide.published && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <Nav />
      <main>
        {!guide.published && (
          <div className="mt-24 bg-[var(--gold)] text-[var(--paper)] text-center text-[12px] tracking-[0.12em] uppercase py-2.5 px-4">{t('draft')}</div>
        )}
        <article className="container-x pt-32 pb-20">
          <div className="max-w-[720px] mx-auto">
            <nav aria-label="Breadcrumb" className="text-[12px] tracking-[0.08em] text-[var(--stone)] mb-8">
              <Link href={`/${l}`} className="hover:text-[var(--gold-dark)]">{t('home')}</Link>
              <span className="mx-2">/</span>
              <span>{t('title')}</span>
            </nav>
            <h1 className="h-display font-normal text-balance" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>
              {text.title}
            </h1>
            <p className="mt-6 text-[19px] leading-[1.55]" style={{ color: 'var(--olive-90)' }}>{text.description}</p>
            <div className="mt-6 pb-8 border-b border-[var(--olive-15)] text-[12px] tracking-[0.14em] uppercase text-[var(--stone)]">
              {t('updated', { date: updated })} · Herocasa
            </div>
            <div className="article-body mt-10">{text.body}</div>
            {guide.published && others.length > 0 && (
              <nav aria-label={t('others')} className="mt-14 pt-8 border-t border-[var(--olive-15)]">
                <div className="eyebrow mb-4">{t('others')}</div>
                <ul className="flex flex-col gap-3">
                  {others.map((g) => (
                    <li key={g.id}>
                      <Link href={guidePath(l, g)} className="btn-arrow" style={{ fontSize: 12 }}>
                        {g.label[l]} <span className="arrow" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
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
