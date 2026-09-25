'use client';

import Nav from './Nav';
import Hero from './Hero';
import TrustBar from './TrustBar';
import Manifesto from './Manifesto';
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

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Manifesto />
        <Services />
        <Process />
        <Testimonial />
        <Properties />
        <Zones />
        <Estimator />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}
