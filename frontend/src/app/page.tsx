import Navbar from '@/components/marketing/Navbar';
import Hero from '@/components/marketing/Hero';
import TrustStrip from '@/components/marketing/TrustStrip';
import PricingSuite from '@/components/marketing/PricingSuite';
import Features from '@/components/marketing/Features';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import Contact from '@/components/marketing/Contact';
import Footer from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <PricingSuite />
        <Features />
        <FaqAccordion />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
