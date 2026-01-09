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
            <div className="inline-block">
              <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold border border-secondary/30">
                ✨ Powered by CreativaLab
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Transforma tu talento en un{" "}
              <span className="text-gradient">CV inteligente</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Optimiza tu perfil, recibe recomendaciones personalizadas y conecta con
              oportunidades locales, nacionales e internacionales desde prácticas,
              internships y becas alrededor del mundo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto shadow-glow">
                  Crear mi CV
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {/* <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Ver ejemplo
              </Button> */}
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Gratis para empezar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Sin tarjeta requerida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Lista en minutos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
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
            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compatible con ATS</h3>
              <p className="text-muted-foreground">
                Diseñado para superar sistemas de seguimiento de candidatos y
                llegar directamente a reclutadores.
              </p>
            </Card>

            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Optimizado con IA</h3>
              <p className="text-muted-foreground">
                Nuestra IA analiza tu perfil y sugiere mejoras basadas en
                tendencias del mercado laboral.
              </p>
            </Card>

            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enfocado en creativos</h3>
              <p className="text-muted-foreground">
                Especializado en perfiles creativos y juniors: diseño, marketing,
                desarrollo, contenido y más.
              </p>
            </Card>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              ¿Cómo <span className="text-gradient">funciona?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres simples pasos para crear tu CV profesional y empezar a recibir oportunidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                1
              </div>
              <Upload className="h-8 w-8 mx-auto text-primary" />
              <h3 className="text-xl font-bold">Completa tu información</h3>
              <p className="text-muted-foreground">
                Ingresa tus datos personales, educación, experiencia y habilidades de forma rápida.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl font-bold text-secondary">
                2
              </div>
              <Sparkles className="h-8 w-8 mx-auto text-secondary" />
              <h3 className="text-xl font-bold">IA transforma tus logros</h3>
              <p className="text-muted-foreground">
                Nuestra inteligencia artificial optimiza tu contenido y genera un CV ganador.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
                3
              </div>
              <TrendingUp className="h-8 w-8 mx-auto text-accent" />
              <h3 className="text-xl font-bold">Recibe oportunidades</h3>
              <p className="text-muted-foreground">
                Descarga tu CV y recibe hasta 5 oportunidades personalizadas alineadas a tu perfil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Planes y <span className="text-gradient">precios</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"> */}
      {/* Plan Gratis */}
      {/* <Card className="p-8 bg-card shadow-card hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Gratis</h3>
                <div className="text-4xl font-bold mb-2">S/0</div>
                <p className="text-muted-foreground">Perfecto para empezar</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">CV básico optimizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Plantilla profesional</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Descarga en PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Hasta 5 oportunidades</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Soporte técnico</span>
                </li>
              </ul>

              <Link href="/register" className="block">
                <Button variant="outline" className="w-full">
                  Comenzar gratis
                </Button>
              </Link>
            </Card> */}

      {/* Plan Pro */}
      {/* <Card className="p-8 bg-linear-to-br from-secondary/20 to-primary/20 shadow-glow border-2 border-primary/50 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                  POPULAR
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">S/9.90</div>
                <p className="text-muted-foreground">Por mes</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Todo del plan Gratis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">CV optimizado con IA avanzada</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">5 oportunidades personalizadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Análisis de compatibilidad</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Soporte prioritario</span>
                </li>
              </ul>

              <Link href="/register" className="block">
                <Button className="w-full shadow-glow">
                  Comenzar ahora
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Testimonios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <TestimoniosCarousel />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-6xl font-bold leading-tight">
              Tu talento merece ser visible.{" "}
              <span className="text-gradient">Empieza hoy.</span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Únete a estudiantes y jóvenes profesionales que ya están transformando sus oportunidades laborales y perfil profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-glow">
                  Crear mi CV
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
