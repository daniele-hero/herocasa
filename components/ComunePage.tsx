'use client';

import Photo from './Photo';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Nav from './Nav';
import HeroForm from './HeroForm';
import Reveal from './Reveal';
import Services from './Services';
import Process from './Process';
import Estimator from './Estimator';
import Faq from './Faq';
import Footer from './Footer';
import MobileCtaBar from './MobileCtaBar';
import WhatsAppFloat from './WhatsAppFloat';
import CookieBanner from './CookieBanner';
import { COMUNI, comunePath, nearbyComuni, type ComuneSlug } from '@/lib/comuni';

type Highlight = { title: string; body: string };
type Testimonial = { quote: string; author: string; role: string };
type Zone = { name: string; count: string; slug?: string };

/** Landing page for one comune: local intro + highlights, then the shared sections with the town pre-selected in the forms. */
export default function ComunePage({ slug }: { slug: ComuneSlug }) {
  const locale = useLocale();
  const t = useTranslations('zonePages');
  const tZones = useTranslations('zones');
  const tTestimonials = useTranslations();
  const { name, photo } = COMUNI[slug];

  const highlights = t.raw(`list.${slug}.highlights`) as Highlight[];
  const count = (tZones.raw('list') as Zone[]).find((z) => z.slug === slug)?.count;
  const testimonial = (tTestimonials.raw('testimonials') as Testimonial[]).find((x) => x.role.includes(name));

  return (
    <>
      <Nav />
      <main>
        <header className="container-x grid gap-10 items-start pt-32 pb-16 md:grid-cols-[6fr_5fr] md:gap-[clamp(40px,6vw,96px)] md:pt-40">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-[12px] tracking-[0.08em] text-[var(--stone)]">
              <Link href={`/${locale}`} className="hover:text-[var(--gold-dark)]">{t('breadcrumbHome')}</Link>
              <span className="mx-2">/</span>
              <Link href={`/${locale}#zone`} className="hover:text-[var(--gold-dark)]">{tZones('eyebrow')}</Link>
              <span className="mx-2">/</span>
              <span aria-current="page" className="text-[var(--olive)]">{name}</span>
            </nav>
            <div className="eyebrow -mb-2">{t('eyebrow')}</div>
            <h1 className="h-display font-normal text-balance" style={{ fontSize: 'clamp(40px, 5.6vw, 84px)', lineHeight: 1.02, letterSpacing: '-0.015em' }}>
              {t('h1', { name })}
            </h1>
            <p className="max-w-[56ch]" style={{ fontSize: 'clamp(17px, 1.25vw, 20px)', lineHeight: 1.6, color: 'var(--olive-90)' }}>
              {t(`list.${slug}.intro1`)}
            </p>
            <p className="max-w-[56ch]" style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: 1.6, color: 'var(--olive-70)' }}>
              {t('intro2', { name })}
            </p>
            <div className="mt-2">
              <HeroForm presetZone={name} />
            </div>
          </div>

          <div className="relative md:sticky md:top-28">
            <div className="relative aspect-[4/5] max-h-[78vh] w-full overflow-hidden bg-[var(--marble)]">
              <Photo src={photo} alt={t('imageAlt')} priority className="object-cover" />
            </div>
            {count && (
              <div className="absolute bottom-6 left-6 p-5 max-w-[280px]" style={{ background: 'rgba(246, 241, 228, 0.94)' }}>
                <div className="text-[11px] tracking-[0.16em] uppercase text-[var(--stone)] mb-1">{name}</div>
                <div className="serif text-[26px] leading-tight text-[var(--olive)]">{count}</div>
              </div>
            )}
          </div>
        </header>

        <section className="bg-[var(--marble)] section-y">
          <div className="container-x">
            <Reveal>
              <div className="eyebrow">{t('highlightsEyebrow')} · i.</div>
              <h2 className="serif mt-3.5 mb-12" style={{ fontSize: 'clamp(32px, 4.4vw, 54px)', lineHeight: 1.08 }}>
                {t('highlightsTitle', { name })}
              </h2>
            </Reveal>
            <div className="grid gap-10 md:grid-cols-3">
              {highlights.map((h, i) => (
                <Reveal key={h.title} delay={0.05 * i}>
                  <div className="border-t border-[var(--olive-15)] pt-5">
                    <h3 className="serif text-[24px] leading-tight text-[var(--olive)] mb-3">{h.title}</h3>
                    <p className="text-[15px] leading-[1.6]" style={{ color: 'var(--olive-90)' }}>{h.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {testimonial && (
              <Reveal>
                <figure className="mt-16 max-w-[820px]">
                  <div className="eyebrow mb-4">{t('testimonialEyebrow', { name })}</div>
                  <blockquote className="serif italic text-[var(--olive)]" style={{ fontSize: 'clamp(22px, 2.2vw, 30px)', lineHeight: 1.35 }}>
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-[12px] tracking-[0.12em] uppercase text-[var(--stone)]">
                    {testimonial.author} · {testimonial.role}
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </section>

        <Services numeral="ii." />
        <Process numeral="iii." />
        <Estimator presetZone={name} sectionNumber="iv." />
        <Faq numeral="v." />

        <section className="container-x pb-20">
          <div className="eyebrow mb-4">{t('otherZonesTitle')}</div>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {nearbyComuni(slug).map((s) => (
              <li key={s}>
                <Link href={comunePath(locale, s)} className="btn-arrow" style={{ fontSize: 12 }}>
                  {COMUNI[s].name} <span className="arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <MobileCtaBar />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}
