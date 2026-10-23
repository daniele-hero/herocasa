'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect, useRef } from 'react';
import Reveal from './Reveal';

function AnimatedNumber({ value }: { value: string }) {
  // Parse leading number, keep prefix/suffix around it
  const match = value.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!match) return <>{value}</>;
  const [, prefix, num, suffix] = match;
  const clean = parseFloat(num.replace(',', '.'));
  const isFloat = !Number.isInteger(clean);
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => (isFloat ? v.toFixed(1) : Math.round(v).toString()));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, clean, { duration: 1.4, ease: [0, 0, 0.2, 1] });
      return controls.stop;
    }
  }, [inView, clean, mv]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export default function TrustBar() {
  const t = useTranslations();
  const items = t.raw('trustBar') as Array<{ value: string; label: string }>;

  return (
    <section
      className="border-t border-b border-[var(--olive-15)] bg-[var(--marble)]"
      style={{ padding: '40px var(--gutter)' }}
    >
      <div className="max-w-[1440px] mx-auto grid gap-8 md:grid-cols-4 md:gap-4">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 0.1} y={20} className="flex flex-col gap-1.5">
            <div className="serif text-[var(--olive)] leading-none" style={{ fontSize: 'clamp(32px, 3.6vw, 48px)' }}>
              <AnimatedNumber value={it.value} />
            </div>
            <div className="text-[12px] max-sm:text-[13px] tracking-[0.14em] uppercase text-[var(--stone)]">{it.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
