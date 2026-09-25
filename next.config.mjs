import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // All property photos are local (public/immobili/) — no remote image
  // domains needed. Keeps LCP fast and avoids depending on a third party.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['motion'],
  },
};

export default withNextIntl(nextConfig);
