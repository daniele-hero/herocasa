'use client';

import { useTranslations } from 'next-intl';
import Reveal from './Reveal';

export default function Manifesto() {
  const t = useTranslations('manifesto');
  return (
    <section className="container-x section-y">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-[3fr_8fr] md:gap-[clamp(40px,6vw,96px)]">
          <div className="flex flex-col gap-4">
            <div className="eyebrow">{t('eyebrow')} · i.</div>
          </div>
          <div>
            <p
              className="serif font-light text-[var(--olive)]"
              style={{ fontSize: 'clamp(20px, 1.8vw, 30px)', lineHeight: 1.35 }}
              dangerouslySetInnerHTML={{ __html: t.raw('paragraphOne') as string }}
            />
            <p
              className="serif font-light text-[var(--olive)] mt-6"
              style={{ fontSize: 'clamp(20px, 1.8vw, 30px)', lineHeight: 1.35 }}
              dangerouslySetInnerHTML={{ __html: t.raw('paragraphTwo') as string }}
            />
            <p className="mt-10 text-[13px] text-[var(--stone)] tracking-[0.06em]">{t('signature')}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
