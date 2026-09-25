import type { MetadataRoute } from 'next';
import { routing } from '@/lib/routing';

const SITE_URL = 'https://herocasa.it';

/**
 * Next.js App Router native sitemap — served at /sitemap.xml.
 * Covers the home page and the three legal pages for every locale, with
 * hreflang alternates so Google understands the it/en/de relationship
 * instead of treating them as duplicate content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/privacy', '/cookie', '/termini'];
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}${route}`;
    }

    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' : 'yearly',
        priority: route === '' ? 1 : 0.3,
        alternates: { languages },
      });
    }
  }

  return entries;
}
