import { Button } from "@/components/ui/button";
import { LogosSection } from "@/components/ui/app/public/partners/LogosSection";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users,
  Award,
  Building2,
  Handshake,
} from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Mejora los índices de empleabilidad",
    description:
      "Ayuda a tus estudiantes a destacar en el mercado laboral con herramientas de optimización de CV.",
  },
  {
    icon: Users,
    title: "Seguimiento de estudiantes",
    description:
      "Dashboard para monitorear el progreso y empleabilidad de tu comunidad estudiantil.",
  },
  {
    icon: Award,
    title: "Certificaciones y badges",
    description:
      "Ofrece reconocimientos verificables que validan las competencias de tus graduados.",
  },
  {
    icon: Handshake,
    title: "Conexión con empresas",
    description: "Facilita el match entre tus estudiantes y empresas buscando talento.",
  },
];

const partnerTypes = [
  {
    icon: GraduationCap,
    title: "Universidades",
    description: "Mejora las métricas de empleabilidad de tus egresados.",
  },
  {
    icon: Building2,
    title: "Institutos",
    description: "Potencia la inserción laboral de tus estudiantes técnicos.",
  },
  {
    icon: Award,
    title: "Bootcamps",
    description: "Aumenta el value prop de tus programas intensivos.",
  },
];

export default function Partners() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 section-padding bg-gradient-to-br from-secondary via-background to-blue/5 dark:from-[#19282D] dark:via-[#1a2a2f] dark:to-[#19282D]">
        <div className="container-levely">
          <div className="max-w-3xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 text-sm font-medium mb-6">
          <GraduationCap className="w-4 h-4" />
          Para instituciones educativas
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl dark:text-white headline-xl mb-6">
          Impulsa la empleabilidad de tus estudiantes
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Únete a la red de instituciones que utilizan Levely para mejorar los resultados de
          empleabilidad y posicionar a sus graduados.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button >
            Solicitar demo
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            size="lg"
            className="border text-black bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Descargar brochure
          </Button>
        </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <LogosSection />

      {/* Partner types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 section-padding bg-background">
        <div className="container-levely">
          <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl sm:text-5xl headline-lg dark:text-foreground">¿Para quién es?</h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Soluciones adaptadas a diferentes tipos de instituciones
        </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {partnerTypes.map((type) => (
          <div key={type.title} className="text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-blue-500/20 dark:bg-blue/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue/20 dark:group-hover:bg-blue/30 transition-colors">
          <type.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 dark:text-foreground">{type.title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{type.description}</p>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* Benefits - Dynamic Cards */}
      <section className="section-padding bg-secondary dark:bg-[#19282D]">
        <div className="container-levely">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl headline-lg dark:text-foreground">
          Beneficios para partners
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Herramientas y métricas para impulsar el éxito de tus estudiantes
        </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.title}
            className="group relative overflow-hidden rounded-2xl border bg-card dark:bg-slate-900/80 backdrop-blur-sm p-6 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-400/5 transition-all duration-300"
          >
            {/* Floating number indicator */}
            <span className="absolute top-4 right-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-muted-foreground/5 group-hover:text-blue/10 transition-colors">
          0{index + 1}
            </span>

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-500/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue/20 group-hover:scale-110 transition-transform">
            <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-foreground group-hover:text-blue transition-colors">
              {benefit.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>
          </div>
            </div>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-primary dark:bg-gradient-to-br dark:from-blue-400 dark:to-blue-500/80 text-primary-foreground p-6 sm:p-8 lg:p-12 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-xl sm:max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl headline-lg mb-4 sm:mb-6 text-white">
            Conviértete en partner de Levely
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8">
            Agenda una llamada con nuestro equipo para explorar cómo podemos ayudar a mejorar
            los resultados de empleabilidad de tu institución.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 dark:text-blue-400"
          >
            Agendar llamada
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
          </div>
        </div>
      </section>
    </>
  );
}
