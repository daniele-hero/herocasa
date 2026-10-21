import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ComunePage from '@/components/ComunePage';
import { routing } from '@/lib/routing';
import { COMUNI, COMUNE_SLUGS, isComuneSlug } from '@/lib/comuni';

const SITE_URL = 'https://herocasa.it';
const LOCALE_OG: Record<string, string> = { it: 'it_IT', en: 'en_US', de: 'de_DE' };

type Params = { params: Promise<{ locale: string; comune: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => COMUNE_SLUGS.map((comune) => ({ locale, comune })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, comune } = await params;
  if (!isComuneSlug(comune)) notFound();
  const t = await getTranslations({ locale, namespace: 'zonePages' });
  const { name } = COMUNI[comune];
  const path = `/gestione-affitti-brevi/${comune}`;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  const title = t('metaTitle', { name });
  const description = t('metaDescription', { name });
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}${path}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}${path}`,
      title,
      description,
      siteName: 'Herocasa',
      locale: LOCALE_OG[locale] ?? 'it_IT',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-image.jpg`] },
  };
}

export default async function Page({ params }: Params) {
  const { locale, comune } = await params;
  if (!isComuneSlug(comune)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'zonePages' });
  const { name } = COMUNI[comune];
  const url = `${SITE_URL}/${locale}/gestione-affitti-brevi/${comune}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: t('h1', { name }),
      serviceType: 'Short-term rental management',
      url,
      areaServed: { '@type': 'City', name },
      provider: { '@type': 'RealEstateAgent', name: 'Herocasa', url: SITE_URL, telephone: '+39 366 369 5252', email: 'info@herocasa.it' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ComunePage slug={comune} />
    </>
  );
}
