/* eslint-disable @next/next/no-img-element -- static export has no image optimizer; <picture> serves AVIF with the original JPG as fallback */
import { PLACEHOLDERS } from '@/lib/photo-placeholders';

// Photos with an AVIF copy in public/immobili/opt/, generated at the same size
// and checked to be visually identical (PSNR ≥ 42 dB) while weighing less.
// Photos not listed here gained too little (or nothing) and stay JPG only.
const AVIF = new Set(['dettaglio-bagno-spa', 'interno-soggiorno', 'villa-giardino']);

// /immobili/* is served as immutable (public/_headers), so Cloudflare and browsers keep a
// photo for a year: bump this whenever a file in public/immobili/ is replaced.
const VERSION = '2';

interface PhotoProps {
  /** Original JPG path, e.g. /immobili/villa-giardino.jpg */
  src: string;
  alt: string;
  className?: string;
  /** Above-the-fold image: load immediately with high priority. */
  priority?: boolean;
}

/**
 * Fills its positioned parent (like next/image `fill`), preferring AVIF where it is lighter.
 * A 24px inlined preview sits underneath, so the frame is never an empty box while the
 * photo loads (the JPGs are progressive, the AVIFs arrive all at once).
 */
export default function Photo({ src, alt, className = '', priority = false }: PhotoProps) {
  const name = src.split('/').pop()?.replace(/\.jpe?g$/i, '') ?? '';
  const placeholder = PLACEHOLDERS[name];
  return (
    <>
      {placeholder && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center ${className}`}
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
      <picture className="contents">
        {AVIF.has(name) && <source type="image/avif" srcSet={`/immobili/opt/${name}.avif?v=${VERSION}`} />}
        <img
          src={`${src}?v=${VERSION}`}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`absolute inset-0 h-full w-full ${className}`}
        />
      </picture>
    </>
  );
}
