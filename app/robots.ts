import type { MetadataRoute } from 'next';

const SITE_URL = 'https://herocasa.it';

/** Next.js App Router native robots route — served at /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
