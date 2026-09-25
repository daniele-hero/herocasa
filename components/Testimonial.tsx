'use client';

import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type TestimonialItem = { quote: string; author: string; role: string };

const INTERVAL_MS = 5000;
const EASE = [0.2, 0.7, 0.2, 1] as const;

export default function Testimonial() {
  const t = useTranslations();
  const items = t.raw('testimonials') as TestimonialItem[];
  const reduced = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
    // Re-arm the timer whenever `current` changes so clicking a dot resets the countdown.
  }, [current, paused, reduced, items.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), { threshold: 0.25 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="text-center max-w-[940px] mx-auto"
      style={{ padding: 'var(--section-y) var(--gutter)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carosello testimonianze proprietari"
    >
      <div className="relative min-h-[260px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.figure
            key={current}
            className="m-0"
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <blockquote
              className="serif italic font-light text-balance mx-auto"
              style={{
                fontSize: 'clamp(24px, 3.2vw, 40px)',
                lineHeight: 1.35,
                color: 'var(--olive)',
                letterSpacing: '-0.005em',
                maxWidth: '880px',
              }}
            >
              &ldquo;{items[current].quote}&rdquo;
            </blockquote>
            <figcaption className="block mt-8">
              <cite className="block font-sans not-italic text-[13px] tracking-[0.14em] uppercase text-[var(--stone)]">
                <b className="text-[var(--olive)] font-medium">{items[current].author}</b> · {items[current].role}
              </cite>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-9" role="tablist" aria-label="Seleziona testimonianza">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Testimonianza ${i + 1} di ${items.length}`}
            onClick={() => setCurrent(i)}
            className="relative h-[3px] border-0 p-0 cursor-pointer overflow-hidden transition-[width,background] duration-300"
            style={{
              width: i === current ? 44 : 28,
              background: i === current ? 'var(--gold)' : 'var(--olive-15)',
            }}
          >
            {i === current && !reduced && !paused && (
              <motion.span
                key={`progress-${current}`}
                className="absolute inset-0 origin-left"
                style={{ background: 'var(--gold-dark)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
