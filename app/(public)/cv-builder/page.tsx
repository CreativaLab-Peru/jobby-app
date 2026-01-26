import Layout from "@/app/(public)/layout";
import { Button } from "@/components/ui/button";
import { TestimonialsSection } from "@/components/ui/app/public/cv-builder/TestimonialsSection";
import { HowItWorksSection } from "@/components/ui/app/public/cv-builder/HowItWorksSection";
import { HotSaleSection } from "@/components/ui/app/public/cv-builder/HotSaleSection";
import AutoPlayVideo from "@/components/auto-play-video";
import { FAQSection } from "@/components/ui/app/public/cv-builder/FAQSection";
import { HeroCards } from "@/components/ui/app/public/cv-builder/HeroCards";
import { FileText, ArrowRight } from "lucide-react";

export default function CVBuilder() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/30 text-lime-foreground text-sm font-medium mb-4 sm:mb-6 bg-lime-100/90 dark:bg-lime-300/50">
            <FileText className="w-4 h-4" />
            CV Builder con IA
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
            Optimiza tu perfil para el mercado global
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg">
            Recibe análisis con IA, recomendaciones claras y oportunidades
            alineadas a tu perfil profesional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="lime">
          Analizar mi CV
          <ArrowRight className="w-5 h-5" />
            </Button>
            <Button className="border-gray-300 text-black dark:text-white dark:border-gray-700" variant="outline" size="lg">
          Ver ejemplo
            </Button>
          </div>
        </div>

        {/* Interactive Hero Cards */}
        <div className="relative lg:pl-8">
          <HeroCards />
        </div>
          </div>
        </div>
      </section>

      {/* Hot Sale Section */}
      <HotSaleSection />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ve cómo funciona en acción
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Descubre lo fácil que es crear tu perfil profesional con nuestra
              plataforma.
            </p>
          </div>

          {/* Video container */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-lime/20 border border-shadow-2xl">
              <AutoPlayVideo src="/videos/videoejemplo-cv.mp4" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorksSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />
    </>
  );
}
