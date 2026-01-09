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
} from "lucide-react";

export const dynamic = 'force-dynamic'

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            <span
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                ai-gradient text-primary-foreground
                text-sm font-medium
                shadow-sm
              "
            >
              <Sparkles className="h-4 w-4" />
              Powered by CreativaLab
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Transforma tu talento en un{" "}
              <span className="text-gradient">CV inteligente</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Optimiza tu perfil, recibe recomendaciones personalizadas y conecta con
              oportunidades locales, nacionales e internacionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" className="ai-glow bg-primary hover:opacity-90 transition">
                  Crear mi CV
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground">
              {[
                "Gratis para empezar",
                "Sin tarjeta requerida",
                "Lista en minutos",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* Diferenciadores */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              ¿Por que elegir <span className="text-gradient">Levely?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres simples pasos para crear tu CV profesional y empezar a recibir oportunidades
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Compatible con ATS",
                description:
                  "Diseñado para superar sistemas de seguimiento de candidatos y llegar directamente a reclutadores.",
                icon: Target,
              },
              {
                title: "Optimizado con IA",
                description:
                  "Nuestra IA analiza tu perfil y sugiere mejoras basadas en tendencias del mercado laboral.",
                icon: Zap,
              },
              {
                title: "Enfocado en creativos",
                description:
                  "Especializado en perfiles creativos y juniors: diseño, marketing, desarrollo y contenido.",
                icon: Award,
              },
            ].map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="
                    group p-8 bg-card border border-border
                    shadow-card transition-all duration-300
                    hover:-translate-y-1 hover:shadow-glow
                  "
              >
                {/* Icon */}
                <div
                  className="
                      mb-6 h-12 w-12 rounded-xl
                      bg-primary/10 ring-1 ring-primary/20
                      flex items-center justify-center
                      transition group-hover:scale-105
                    "
                >
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  {title === "Optimizado con IA" ? (
                    <span className="ai-gradient-text">{title}</span>
                  ) : (
                    title
                  )}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </Card>
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


      {/* Cómo funciona */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              ¿Cómo <span className="text-gradient">funciona?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres simples pasos para crear tu CV profesional y empezar a recibir oportunidades
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Completa tu información",
                description:
                  "Ingresa tus datos personales, educación, experiencia y habilidades de forma rápida.",
                icon: Upload,
              },
              {
                step: "2",
                title: "La IA optimiza tu CV",
                description:
                  "Nuestra inteligencia artificial transforma tus logros en un CV profesional y atractivo.",
                icon: Sparkles,
              },
              {
                step: "3",
                title: "Recibe oportunidades",
                description:
                  "Descarga tu CV y accede a oportunidades alineadas a tu perfil.",
                icon: TrendingUp,
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

      {/* Testimonios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <TestimoniosCarousel />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-6xl font-bold leading-tight">
            Tu talento merece ser visible.{" "}
            <span className="text-gradient">Empieza hoy.</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Únete a estudiantes y jóvenes profesionales que ya están transformando sus oportunidades.
          </p>

          <div className="mt-10">
            <Link href="/register">
              <Button size="xl" className="ai-glow bg-primary hover:opacity-90 transition">
                Crear mi CV
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
