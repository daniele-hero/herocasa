import type { MetadataRoute } from 'next';
import { routing } from '@/lib/routing';
import { COMUNE_SLUGS, comunePath } from '@/lib/comuni';
import { ARTICLES } from '@/lib/articles';

const SITE_URL = 'https://herocasa.it';

type Page = {
  /** Path per locale; locales missing from the map don't have this page. */
  path: (locale: string) => string;
  locales: readonly string[];
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
  priority: number;
};

/**
 * Next.js App Router native sitemap — served at /sitemap.xml.
 * Lists every page in every language it exists in, with hreflang alternates
 * pointing at each locale's own URL (DE comune pages use a German segment).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const all = routing.locales;
  const pages: Page[] = [
    { path: (l) => `/${l}`, locales: all, changeFrequency: 'weekly', priority: 1 },
    ...COMUNE_SLUGS.map((s): Page => ({ path: (l) => comunePath(l, s), locales: all, changeFrequency: 'monthly', priority: 0.8 })),
    // Draft guides stay out of the sitemap until approved (published: true).
    ...ARTICLES.filter((a) => a.published).map((a): Page => ({ path: () => `/it/guide/${a.slug}`, locales: ['it'], changeFrequency: 'monthly', priority: 0.7 })),
    ...['privacy', 'cookie', 'termini'].map((p): Page => ({ path: (l) => `/${l}/${p}`, locales: all, changeFrequency: 'yearly', priority: 0.3 })),
  ];

  const now = new Date();
  return pages.flatMap((page) => {
    const languages = Object.fromEntries(page.locales.map((l) => [l, `${SITE_URL}${page.path(l)}`]));
    return page.locales.map((l) => ({
      url: `${SITE_URL}${page.path(l)}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages },
    }));
  });
}

export const dynamic = 'force-static';
