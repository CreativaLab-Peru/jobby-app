import { TestimoniosCarousel } from "@/components/testimonios";
import { LogosSection } from "@/components/ui/app/public/partners/logos-section";
import { CVBuilderPreview } from "@/components/ui/app/public/hero/cv-builder-preview";
import { CareerAcceleratorTeaser } from "@/components/ui/app/public/hero/career-accelerator-teaser";
import { TargetAudience } from "@/components/ui/app/public/hero/target-audience";
import { CTASection } from "@/components/ui/app/public/hero/cta-section";
import { HeroSection } from "@/components/ui/app/public/hero/hero-section";

const Index = () => {
  return (
    <div>
      <HeroSection />
      <LogosSection />
      <CVBuilderPreview />
      <CareerAcceleratorTeaser />
      <TargetAudience />
      <TestimoniosCarousel />
      <CTASection />
    </div>
  );
};

export default Index;