import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TestimoniosCarousel from "@/components/testimonios";
import Image from "next/image";
import {
  CheckCircle2,
  Sparkles,
  Target,
  Upload,
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  Brain,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { animate, steps } from "framer-motion";
import { string } from "better-auth";

const benefits = [
  {
    icon: Brain,
    title: "Análisis con IA avanzada",
    description: "Nuestra IA evalúa tu perfil y te da feedback actionable para destacar.",
  },
  {
    icon: TrendingUp,
    title: "Mejora tu empleabilidad",
    description: "Aumenta tus chances de conseguir entrevistas con un CV optimizado.",
  },
  {
    icon: Users,
    title: "Oportunidades personalizadas",
    description: "Recibe recomendaciones de trabajos y becas alineadas a tu perfil.",
  },
  {
    icon: Shield,
    title: "Datos seguros",
    description: "Tu información está protegida con los más altos estándares de seguridad.",
  },
  {
    icon: Clock,
    title: "Resultados en minutos",
    description: "Obtén tu análisis completo y recomendaciones en menos de 5 minutos.",
  },
  {
    icon: Award,
    title: "Validación profesional",
    description: "Metodología respaldada por expertos en recursos humanos y reclutamiento.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="
          relative
          overflow-hidden
          bg-[url('/hero/hero_white.png')]
          dark:bg-[url('/hero/hero_black.png')]
        "
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-36">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/10 border border-blue-400 dark:border-gray-700 mb-8">
              <Sparkles className="w-4 h-4 text-blue"></Sparkles>
              <span className="text-sm font-medium text-foreground">
                Potenciado por IA
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl text-balance"
              style={{ animationDelay: "0.1s" }}
            >
              Optimiza tu perfil y vuélvete hasta{" "}
              <span className="text-gradient">10× más empleable</span>{" "}
              con IA.
            </h1>

            {/* Subheadline */}
            <p
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance"
              style={{ animationDelay: "0.2s" }}
            >
              Accede a practicas, trabajos y becas con guía inteligente y oportunidades alineadas a tu perfil.
            </p>

            {/* CTA */}
            <div 
              className="mt-10 flex flex-col sm:flex-row gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/register">
                <Button variant="hero" size="xl">
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-5 w-5" /> 
                </Button> 
              </Link>
              <Link href="#">
                <Button variant="outline" size="xl" className="hover:bg-foreground/5 hover:font-bold hover:dark:text-white">
                  Como Funciona
                  <Sparkles className="ml-2 h-5 w-5" /> 
                </Button>
              </Link>
            </div>
            
            {/* Social proof */}
            <div
              className="mt-16 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground"
              style={{ animationDelay: "0.4s" }}
            >
                <div className="flex -space-x-2">
                {[
                  "/testimonios/Andy.png",
                  "/testimonios/Monica.png",
                  "/testimonios/Jhon.png",
                  "/testimonios/Daniela.png",
                  "/testimonios/Brenda.png",
                ].map((src, i) => (
                  <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-background flex items-center justify-center overflow-hidden"
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
                <span className="font-semibold text-foreground">+2000</span> profesionales ya optimizaron su perfil
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              ¿Cómo <span className="text-gradient">funciona?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres simples pasos para transformar tu perfil profesional
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sube tu CV",
                description:
                  "Carga tu currículum actual y nuestro sistema lo analizará en segundos.",
                icon: Upload,
              },
              {
                step: "2",
                title: "Recibe análisis IA",
                description:
                  "Obtén recomendaciones personalizadas para optimizar cada sección de tu perfil.",
                icon: Zap,
              },
              {
                step: "3",
                title: "Accede a oportunidades",
                description:
                  "Conecta con prá  cticas, trabajos y becas alineadas a tu perfil mejorado.",
                icon: Target,
              },
            ].map(({ step, title, description, icon: Icon }) => (
              <div
                key={step}
                className="
            relative p-8 rounded-2xl bg-card border border-border
            shadow-card transition-all
            hover:-translate-y-1 hover:shadow-glow
            text-center
          "
              >
                {/* Step number */}
                <div
                  className="
              absolute -top-5 left-1/2 -translate-x-1/2
              h-10 w-10 rounded-full
              bg-primary text-primary-foreground
              flex items-center justify-center
              text-sm font-bold shadow
            "
                >
                  {step}
                </div>

                {/* Icon */}
                <div className="mx-auto mt-6 mb-4 h-14 w-14 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Logos de confianza */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Respaldado por
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-center justify-items-center">
            {[
              { src: "/logos/creativalab.png", alt: "CreativaLab logo" },
              { src: "/logos/paqarinawasi.png", alt: "PaqarinaWasi logo" },
              { src: "/logos/proinnovate.png", alt: "ProInnóvate logo" },
            ].map((logo) => (
              <div key={logo.alt} className="w-full flex justify-center">
                <div className="p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center w-56 sm:w-64 md:w-72 lg:w-80 h-28 sm:h-32 md:h-36 lg:h-40 transform hover:scale-105 overflow-hidden border border-gray-200/20">
                  <div className="relative w-full h-full">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      sizes="(max-width: 640px) 120px, (max-width: 768px) 180px, 220px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <TestimoniosCarousel />
        </div>
      </section>

      {/* Beneficios */ }      
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Por qué elegir{" "}
              <span className="text-gradient">Levely</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas diseñadas para impulsar tu carrera profesional
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center mb-4 group-hover:bg-blue/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;