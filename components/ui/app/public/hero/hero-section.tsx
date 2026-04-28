import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroBgLight from "@/public/hero/hero_black.png";
import heroBgDark from "@/public/hero/hero_light.png";

export function HeroSection() {
  const words = ["la beca", "la pasantia", "el intercambio", "el ÉXITO"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000); // Cambia cada 2 segundos
    return () => clearInterval(timer);
  }, []);

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-levely-green/10 border dark:border-levely-green/20 border-levely-dark/20 mb-8 animate-fade-up backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-levely-dark dark:text-levely-green " />
            <span className="text-sm font-medium text-levely-dark dark:text-levely-green">
              Potenciado por IA
            </span>
          </div>

          {/* Headline */}
          <h1
            className="headline-xl max-w-4xl text-balance animate-fade-up text-[#1b292d] dark:text-white"
            style={{ animationDelay: "0.1s" }}
          >
            Descubre si tu CV está listo para{" "}
            <span className="inline-flex relative h-[1.2em] align-top overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-primary dark:text-accent font-bold"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            que quieres ganar
          </h1>

          <div
            className="mt-6 flex flex-col items-center gap-1 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-lg sm:text-xl text-muted-foreground text-center">
              Crea o sube tu CV y en 2 minutos obtienes tu score,
            </p>
            <span className="text-lg sm:text-xl font-bold text-primary dark:text-accent text-center px-2 py-0.5 rounded-lg">
              recomendaciones específicas para Chevening, Fulbright o DAAD,
            </span>
            <p className="text-lg sm:text-xl text-muted-foreground text-center">
              y un roadmap paso a paso para aplicar con ventaja.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="hero" size="xl" className="cursor-pointer">
              <Link href="/onboarding/talents">
                Analizar mi CV gratis
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>

            <span className="block text-sm text-muted-foreground mt-2">No necesitas tarjeta</span>
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
              <span className="font-semibold text-foreground">+500</span> profesionales ya
              optimizaron su perfil
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
