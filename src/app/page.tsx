import { CTASection } from '@/components/landing-page/cta-section';
import { FeaturesSection } from '@/components/landing-page/features-section';
import { Footer } from '@/components/landing-page/footer';
import { HeroSection } from '@/components/landing-page/hero-section';
import { HowItWorksSection } from '@/components/landing-page/how-it-works-section';
import { StatsSection } from '@/components/landing-page/stats-section';
import { TestimonialsSection } from '@/components/landing-page/testimonials-section';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
