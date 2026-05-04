import { TestimoniosCarousel } from "@/components/testimonios";
import { LogosSection } from "@/components/ui/app/public/partners/logos-section";
import { AnalysisResultSection } from "@/components/ui/app/public/hero/analisys-result-section";
import { StepBuilderHero } from "@/components/ui/app/public/hero/steps-section";
import { ScholarshipGrid } from "@/components/ui/app/public/hero/opportunities-section";
import { HeroSection } from "@/components/ui/app/public/hero/hero-section";
import { PublicPageTransition } from "@/components/shared/public-page-transition";
import { HomePricing } from "@/features/credits/components/home-pricing";

export default async function IndexPage() {
  return (
    <PublicPageTransition>
      <div className="space-y-24 pb-24">
        <HeroSection />
        <LogosSection />
        {/* <CVBuilderPreview /> */}
        <AnalysisResultSection />
        <StepBuilderHero />
        <ScholarshipGrid />
        {/*<RoadmapPreview />*/}
        {/*<CareerAcceleratorTeaser />*/}
        {/*<TargetAudience />*/}
        <HomePricing />
        <TestimoniosCarousel />
        {/*<CTASection />*/}
      </div>
    </PublicPageTransition>
  );
}
