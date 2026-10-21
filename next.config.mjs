import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static build (out/) served by Cloudflare Pages. The lead form
  // endpoint lives in functions/api/valuation-request.ts (Pages Function)
  // and the root locale redirect in functions/index.ts.
  output: 'export',
  // No image optimization server on static hosting: photos in
  // public/immobili/ are already resized/compressed for the web.
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['motion'],
  },
};

export default withNextIntl(nextConfig);
