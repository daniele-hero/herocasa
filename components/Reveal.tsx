'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Reveal on scroll — subtle single moment. Respects reduced-motion. */
export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
