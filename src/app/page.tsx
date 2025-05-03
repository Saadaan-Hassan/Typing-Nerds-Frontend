import Head from 'next/head';

import { CTASection } from '@/components/landing-page/cta-section';
import { Footer } from '@/components/landing-page/footer';
import { HeroSection } from '@/components/landing-page/hero-section';
import { HowItWorksSection } from '@/components/landing-page/how-it-works-section';
import { StatsSection } from '@/components/landing-page/stats-section';
import { TestimonialsSection } from '@/components/landing-page/testimonials-section';

export default function Home() {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <HeroSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
