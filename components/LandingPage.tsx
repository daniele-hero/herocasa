'use client';

import Nav from './Nav';
import Hero from './Hero';
import TrustBar from './TrustBar';
import Manifesto from './Manifesto';
import EmptyHomeCost from './EmptyHomeCost';
import Services from './Services';
import Process from './Process';
import Testimonial from './Testimonial';
import Properties from './Properties';
import Zones from './Zones';
import Estimator from './Estimator';
import Faq from './Faq';
import Contact from './Contact';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import WhatsAppFloat from './WhatsAppFloat';
import MobileCtaBar from './MobileCtaBar';

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Manifesto numeral="i." />
        <Services numeral="ii." />
        <Process numeral="iii." />
        <Testimonial />
        <Properties numeral="iv." />
        <Zones numeral="v." />
        {/* Closing argument right before the valuation form it points to. */}
        <EmptyHomeCost numeral="vi." />
        <Estimator sectionNumber="vii." />
        <Faq numeral="viii." />
        <Contact numeral="ix." />
      </main>
      <Footer />
      <MobileCtaBar />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}
