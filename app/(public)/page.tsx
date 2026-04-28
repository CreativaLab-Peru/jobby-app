"use client";

import { TestimoniosCarousel } from "@/components/testimonios";
import { LogosSection } from "@/components/ui/app/public/partners/logos-section";
import { CVBuilderPreview } from "@/components/ui/app/public/hero/cv-builder-preview";
import { RoadmapPreview } from "@/components/ui/app/public/hero/roadmap-section";
import { TargetAudience } from "@/components/ui/app/public/hero/target-audience";
import { CTASection } from "@/components/ui/app/public/hero/cta-section";
import { HeroSection } from "@/components/ui/app/public/hero/hero-section";
import { PublicPageTransition } from "@/components/shared/public-page-transition";

const Index = () => {
  return (
    <PublicPageTransition>
      <div>
        <HeroSection />
        <LogosSection />
        <CVBuilderPreview />
        {/*<RoadmapPreview />*/}
        {/*<CareerAcceleratorTeaser />*/}
        {/*<TargetAudience />*/}
        <TestimoniosCarousel />
        {/*<CTASection />*/}
      </div>
    </PublicPageTransition>
  );
};

export default Index;
