/* eslint-disable @next/next/no-img-element -- static export has no image optimizer; <picture> serves AVIF with the original JPG as fallback */

// Photos with an AVIF copy in public/immobili/opt/, generated at the same size
// and checked to be visually identical (PSNR ≥ 42 dB) while weighing less.
// Photos not listed here gained too little (or nothing) and stay JPG only.
const AVIF = new Set(['dettaglio-bagno-spa', 'interno-soggiorno', 'villa-giardino']);

interface PhotoProps {
  /** Original JPG path, e.g. /immobili/villa-giardino.jpg */
  src: string;
  alt: string;
  className?: string;
  /** Above-the-fold image: load immediately with high priority. */
  priority?: boolean;
}

/** Fills its positioned parent (like next/image `fill`), preferring AVIF where it is lighter. */
export default function Photo({ src, alt, className = '', priority = false }: PhotoProps) {
  const name = src.split('/').pop()?.replace(/\.jpe?g$/i, '') ?? '';
  return (
    <picture className="contents">
      {AVIF.has(name) && <source type="image/avif" srcSet={`/immobili/opt/${name}.avif`} />}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    </picture>
  );
}
