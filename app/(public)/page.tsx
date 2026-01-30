import { TestimoniosCarousel } from "@/components/testimonios";
import { LogosSection } from "@/components/ui/app/public/partners/LogosSection";
import { CVBuilderPreview } from "@/components/ui/app/public/hero/CVBuilderPreview";
import { CareerAcceleratorTeaser } from "@/components/ui/app/public/hero/CareerAcceleratorTeaser";
import { TargetAudience } from "@/components/ui/app/public/hero/TargetAudience";
import { CTASection } from "@/components/ui/app/public/hero/CTASection";
import { HeroSection } from "@/components/ui/app/public/hero/HeroSection";

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