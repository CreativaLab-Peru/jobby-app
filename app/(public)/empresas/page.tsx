import { Button } from "@/components/ui/button";
import {
  Building,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Target
} from "lucide-react";
import { PublicPageTransition } from "@/components/shared/public-page-transition";

const benefits = [
  {
    icon: Clock,
    title: "Reduce tiempo de contratación",
    description: "Accede a candidatos pre-validados con perfiles optimizados que se ajustan a tus necesidades.",
  },
  {
    icon: Shield,
    title: "Candidatos verificados",
    description: "Cada perfil ha sido analizado por IA para garantizar la calidad de la información.",
  },
  {
    icon: TrendingUp,
    title: "Mejores matches",
    description: "Nuestro algoritmo conecta tu oferta con los candidatos más relevantes.",
  },
  {
    icon: Zap,
    title: "Proceso ágil",
    description: "Simplifica tu pipeline de reclutamiento con herramientas inteligentes.",
  },
];

const features = [
  "Acceso a base de talento verificado",
  "Filtros avanzados por habilidades",
  "Perfiles optimizados y completos",
  "Métricas de compatibilidad",
  "Comunicación directa con candidatos",
  "Dashboard de seguimiento",
];

export default function Empresas() {
  return (
    <PublicPageTransition>
      <>
        {/* Hero */}
        <section className="py-16 px-6 md:py-20 md:px-12 section-padding dark:bg-gray-800/95">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-800/10 dark:bg-lime-800/20 text-red-500 text-sm font-medium mb-6">
                  <Building className="w-4 h-4" />
                  Para empresas
                </div>

                <h1 className="dark:text-white text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
                  Encuentra el{" "}
                  <span className="text-gradient">talento ideal</span>{" "}
                  más rápido
                </h1>

                <p className="text-base md:text-lg text-muted-foreground mb-8">
                  Accede a una base de candidatos con perfiles optimizados y validados por IA.
                  Reduce costos y tiempo en tu proceso de contratación.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button >
                    Publicar vacante
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button className="dark:text-white text-black bg-transparent border dark:border-gray-500 hover:bg-gray-500/50" size="lg">
                    Hablar con ventas
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-card border border-lime-900/10 hover:shadow-lg hover:shadow-lime-800/50 rounded-2xl p-4 sm:p-6 text-center transition-shadow duration-300">
                  <p className="text-2xl sm:text-4xl font-extrabold text-accent mb-2">-40%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tiempo de contratación</p>
                  </div>
                <div className="bg-card border border-lime-900/10 hover:shadow-lg hover:shadow-lime-800/50 rounded-2xl p-4 sm:p-6 text-center transition-shadow duration-300">
                  <p className="text-2xl sm:text-4xl font-extrabold text-accent mb-2">+2K</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Candidatos activos</p>
                </div>
                <div className="bg-card border border-lime-900/10 hover:shadow-lg hover:shadow-lime-800/50 rounded-2xl p-4 sm:p-6 text-center transition-shadow duration-300">
                  <p className="text-2xl sm:text-4xl font-extrabold text-accent mb-2">95%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Satisfacción</p>
                </div>
                <div className="bg-card border border-lime-900/10 hover:shadow-lg hover:shadow-lime-800/50 rounded-2xl p-4 sm:p-6 text-center transition-shadow duration-300">
                  <p className="text-2xl sm:text-4xl font-extrabold text-accent mb-2">24h</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Primeros matches</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 section-padding">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">¿Por qué Levely para empresas?</h2>
              <p className="mt-4 text-sm md:text-lg text-muted-foreground">
                Optimiza tu proceso de reclutamiento con tecnología
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-4 sm:p-6 rounded-2xl border dark:border-gray-600 bg-card hover:border-lime-900/30 dark:hover:border-lime-600/80 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-80 section-padding bg-secondary/30">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                  Todo lo que necesitas para reclutar mejor
                </h2>
                <p className="text-sm md:text-lg text-muted-foreground mb-8">
                  Herramientas diseñadas para simplificar cada etapa del proceso de contratación.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-4 pb-4 border-b border-lime-900/30 dark:border-lime-600/80 mb-6">
                  <div className="border-lime-900/30 dark:border-lime-600/80 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Match Score</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Compatibilidad candidato-puesto</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {["Desarrollo Frontend", "Marketing Digital", "Data Science"].map((role, i) => (
                    <div key={role} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                        </div>
                        <span className="text-sm sm:text-base font-medium">{role}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-accent">
                        {[12, 8, 15][i]} matches
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 section-padding">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Comienza a reclutar de forma inteligente
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground mb-8">
                Agenda una demo con nuestro equipo y descubre cómo Levely
                puede transformar tu proceso de contratación.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  Agendar demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
                  <Button className="bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" size="lg">
                  Ver planes empresariales
                  </Button>
              </div>
            </div>
          </div>
        </section>
      </>
    </PublicPageTransition>
  );
}
