/**
 * GET/HEAD / — Cloudflare Pages Function replacing the next-intl middleware that
 * used to redirect the bare domain to a locale (static export has no
 * middleware). Picks it/en/de from Accept-Language, Italian by default.
 */
const LOCALES = ['it', 'en', 'de'] as const;

export const onRequestGet = ({ request }: { request: Request }): Response => {
  const accepted = (request.headers.get('Accept-Language') ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());
  const locale = accepted.find((l): l is (typeof LOCALES)[number] => (LOCALES as readonly string[]).includes(l)) ?? 'it';
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}/${locale}${url.search}`, 307);
};

// Crawlers and SEO tools often check the homepage with HEAD; without this it answered 404.
export const onRequestHead = onRequestGet;
