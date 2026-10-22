import type { CSSProperties, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Reveal on scroll — subtle single moment. Pure CSS (scroll-driven animation,
 * `.reveal` in globals.css): content is in the HTML and visible without waiting
 * for JS; browsers without scroll-driven animations, or with reduced motion,
 * simply show it. `delay` staggers siblings by starting a little later in the scroll.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '' }: RevealProps) {
  const style = { '--reveal-y': `${y}px`, '--reveal-shift': `${Math.round(delay * 300)}px` } as CSSProperties;
  return (
    <div className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
