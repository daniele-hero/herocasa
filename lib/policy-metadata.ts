import type { Metadata } from 'next';
import { routing } from '@/lib/routing';

const SITE_URL = 'https://herocasa.it';
const LOCALE_OG: Record<string, string> = { it: 'it_IT', en: 'en_US', de: 'de_DE' };

/**
 * Own title, description and canonical for /[locale]/{privacy,cookie,termini}.
 * Without it they inherit the home page's, and Google files them as duplicates of the home.
 */
export function policyMetadata(locale: string, slug: 'privacy' | 'cookie' | 'termini', eyebrow: string, description: string): Metadata {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${slug}`;
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}/${slug}`;
  const url = `${SITE_URL}/${locale}/${slug}`;
  // "Informativa privacy · art. 13 GDPR" → "Informativa privacy | Herocasa"
  const title = `${eyebrow.split(' · ')[0]} | Herocasa`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Herocasa',
      locale: LOCALE_OG[locale] ?? 'it_IT',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-image.jpg`] },
  };
}
