// Root layout — required to exist even with [locale] routing.
// The real <html>/<body> tags are defined in app/[locale]/layout.tsx
// (following the next-intl App Router pattern).

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
