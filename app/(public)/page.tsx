"use client";

import { TestimoniosCarousel } from "@/components/testimonios";
import { LogosSection } from "@/components/ui/app/public/partners/logos-section";
import { CVBuilderPreview } from "@/components/ui/app/public/hero/cv-builder-preview";
import { CareerAcceleratorTeaser } from "@/components/ui/app/public/hero/career-accelerator-teaser";
import { TargetAudience } from "@/components/ui/app/public/hero/target-audience";
import { CTASection } from "@/components/ui/app/public/hero/cta-section";
import { HeroSection } from "@/components/ui/app/public/hero/hero-section";
import {useEffect} from "react";
import {useAnalysisStore} from "@/hooks/use-analysis-store";
import {useRouter} from "next/navigation";

const Index = () => {
  const { fileName, fileUrl, loadPersistedFile } = useAnalysisStore();
  const router = useRouter();

  useEffect(() => {
    if (!fileUrl) {
      loadPersistedFile();
    }
  }, [fileUrl, loadPersistedFile]);

  // 2. Reaccionar cuando los datos aparezcan en el store
  useEffect(() => {
    if (fileUrl && fileName) {
      console.log("Archivo recuperado con éxito, redirigiendo...");
      router.push('/cv?afterOnboarding=true');
    }
  }, [fileUrl, fileName, router]);


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
