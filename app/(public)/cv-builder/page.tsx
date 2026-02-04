import {Button} from "@/components/ui/button";
import {TestimonialsSection} from "@/components/ui/app/public/cv-builder/testimonials-section";
import {HowItWorksSection} from "@/components/ui/app/public/cv-builder/how-it-works-section";
import {HotSaleSection} from "@/components/ui/app/public/cv-builder/hot-sale-section";
import AutoPlayVideo from "@/components/auto-play-video";
import {FAQSection} from "@/components/ui/app/public/cv-builder/faq-section";
import {HeroCards} from "@/components/ui/app/public/cv-builder/hero-cards";
import {FileText, ArrowRight} from "lucide-react";
import Link from "next/link";
import VideoAnchorButton from "@/components/video-anchor-button";

export default function CVBuilder() {
  return (
    <>
      {/* Hero */}
      <section
        className="section-padding bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="container-levely">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-levely-green/30 text-levely-dark text-sm font-medium mb-6">
                <FileText className="w-4 h-4"/>
                CV Builder con IA
              </div>

              <h1 className="headline-xl mb-6">
                Optimiza tu perfil para el mercado global
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Recibe análisis con IA, recomendaciones claras y oportunidades
                alineadas a tu perfil profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/get-started">
                  <Button className="cursor-pointer" variant="lime" size="xl">
                    Analizar mi CV
                    <ArrowRight className="w-5 h-5"/>
                  </Button>
                </Link>
                {/* Todo: Uncomment when video is ready */}
                {/*<VideoAnchorButton/>*/}
              </div>
            </div>

            {/* Interactive Hero Cards */}
            <div className="relative lg:pl-8">
              <HeroCards/>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Sale Section */}
      <HotSaleSection/>

      <section className="container-levely section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ve cómo funciona en acción
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Descubre lo fácil que es crear tu perfil profesional con nuestra plataforma.
            </p>
          </div>

          {/* Video container */}
          <div id="video-demo" className="max-w-4xl mx-auto">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-levely-green/20 border border-shadow-2xl">
              <AutoPlayVideo src="/videos/videoejemplo-cv.mp4"/>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorksSection/>

      {/* Testimonials */}
      <TestimonialsSection/>

      {/* FAQ */}
      <FAQSection/>
    </>
  );
}
