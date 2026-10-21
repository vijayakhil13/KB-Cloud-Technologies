import Navbar from '@/components/marketing/Navbar';
import Hero from '@/components/marketing/Hero';
import Services from '@/components/marketing/Services';
import Pricing from '@/components/marketing/Pricing';
import Support from '@/components/marketing/Support';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import Contact from '@/components/marketing/Contact';
import Footer from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Support />
        <section className="bg-page pt-2 pb-16 lg:pb-20">
          <FaqAccordion />
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
