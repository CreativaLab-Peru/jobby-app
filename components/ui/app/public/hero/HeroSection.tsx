import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroBgLight from "@/public/hero/hero_black.png";
import heroBgDark from "@/public/hero/hero_light.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background images for light and dark mode */}
      <div className="absolute inset-0">
        <Image
          src={heroBgDark}
          alt="Hero Background Dark"
          className="absolute inset-0 w-full h-full object-cover dark:opacity-0 opacity-100 transition-opacity duration-500"
          priority
        />
        <Image
          src={heroBgLight}
          alt="Hero Background Light"
          className="absolute inset-0 w-full h-full object-cover dark:opacity-100 opacity-0 transition-opacity duration-500"
          priority
        />
      </div>

      <div className="container-levely relative z-10">
        <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-36">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/10 border border-blue/20 mb-8 animate-fade-up backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Potenciado por IA
            </span>
          </div>

          {/* Headline */}
          <h1
            className="headline-xl max-w-4xl text-balance animate-fade-up text-[#1b292d] dark:text-white"
            style={{ animationDelay: "0.1s" }}
          >
            Convierte tu perfil en oportunidades reales
          </h1>

          {/* Subheadline */}
          <p
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Accede a prácticas, trabajos y becas con guía inteligente y
            oportunidades alineadas a tu perfil.
          </p>

          {/* CTA */}
          <div
            className="mt-10 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl">
              Empezar
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Social proof */}
          <div
            className="mt-16 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex -space-x-2">
              {[
                "/testimonios/Andy.png",
                "/testimonios/Monica.png",
                "/testimonios/Jhon.png",
                "/testimonios/Aaron.png",
                "/testimonios/Brenda.png",
              ].map((src, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-background flex items-center justify-center overflow-hidden fadeUp"
                >
                  <Image
                    src={src}
                    alt={`Avatar ${i + 1}`}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
            <p>
              <span className="font-semibold text-foreground">+500</span>{" "}
              profesionales ya optimizaron su perfil
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
