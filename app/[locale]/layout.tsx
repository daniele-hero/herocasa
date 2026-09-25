import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/routing';
import '../globals.css';

const SITE_URL = 'https://herocasa.it';

const LOCALE_OG: Record<string, string> = { it: 'it_IT', en: 'en_US', de: 'de_DE' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'meta' });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`;
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}`;

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'gestione affitti brevi Lago di Garda',
      'property management Lago di Garda',
      'gestione Airbnb Garda',
      'affitti brevi Bardolino',
      'affitti brevi Sirmione',
      'affitti brevi Lazise',
      'affitti brevi Peschiera del Garda',
      'affitti brevi Desenzano del Garda',
      'affitti brevi Castelnuovo del Garda',
      'gestione seconde case Garda',
      'CIN affitti brevi',
      'SUAP affitti brevi',
    ],
    authors: [{ name: 'Herocasa' }],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      siteName: 'Herocasa',
      locale: LOCALE_OG[locale] ?? 'it_IT',
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Herocasa — Gestione affitti brevi sul Lago di Garda' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${SITE_URL}/og-image.jpg`],
    },
    icons: {
      icon: '/favicon.png',
      apple: '/apple-touch-icon.png',
    },
    other: {
      // Local SEO / GEO tags — anchors the business to the Lake Garda area
      // for map-pack and "near me" style queries.
      'geo.region': 'IT-VR',
      'geo.placename': 'Lago di Garda',
      'geo.position': '45.5636;10.6417',
      ICBM: '45.5636, 10.6417',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    name: 'Herocasa',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'Property management e gestione affitti brevi per proprietari di seconde case sul Lago di Garda. Gestione completa: burocrazia (CIN, SUAP), ospiti, pulizie, prezzi, rendiconti trasparenti.',
    email: 'info@herocasa.it',
    telephone: '+39 366 369 5252',
    vatID: '02668020205',
    priceRange: '€€€',
    areaServed: [
      { '@type': 'City', name: 'Peschiera del Garda' },
      { '@type': 'City', name: 'Lazise' },
      { '@type': 'City', name: 'Castelnuovo del Garda' },
      { '@type': 'City', name: 'Bardolino' },
      { '@type': 'City', name: 'Sirmione' },
      { '@type': 'City', name: 'Desenzano del Garda' },
      { '@type': 'City', name: 'Padenghe sul Garda' },
      { '@type': 'City', name: 'Soiano del Lago' },
    ],
    geo: { '@type': 'GeoCoordinates', latitude: 45.5636, longitude: 10.6417 },
    sameAs: [],
  };

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1E4D42" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
