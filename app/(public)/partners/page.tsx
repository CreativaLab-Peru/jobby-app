import {Button} from "@/components/ui/button";
import {LogosSection} from "@/components/ui/app/public/partners/logos-section";
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
      <section
        className="section-padding bg-gradient-to-br from-secondary via-background to-levely-blue/5 dark:from-[#19282D] dark:via-[#1a2a2f] dark:to-[#19282D]">
        <div className="container-levely">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-levely-blue/10 dark:bg-levely-blue/20 text-levely-blue text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4"/>
              Para instituciones educativas
            </div>

            <h1 className="headline-xl mb-6 text-foreground">
              Impulsa la empleabilidad de tus estudiantes
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Únete a la red de instituciones que utilizan Levely para mejorar
              los resultados de empleabilidad y posicionar a sus graduados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/joinlevely/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="cursor-pointer" variant="hero" size="xl">
                  Solicitar demo
                  <ArrowRight className="w-5 h-5"/>
                </Button>
              </a>
              {/*<Button variant="outline" size="lg"*/}
              {/*        className="cursor-pointer dark:border-white/20 dark:text-white dark:hover:bg-white/10">*/}
              {/*  Descargar brochure*/}
              {/*</Button>*/}
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <LogosSection/>

      {/* Partner types */}
      <section className="section-padding bg-background">
        <div className="container-levely">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="headline-lg text-foreground">¿Para quién es?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Soluciones adaptadas a diferentes tipos de instituciones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnerTypes.map((type) => (
              <div
                key={type.title}
                className="text-center group"
              >
                <div
                  className="w-20 h-20 mx-auto rounded-2xl bg-levely-blue/10 dark:bg-levely-blue/20 flex items-center justify-center mb-6 group-hover:bg-levely-blue/20 dark:group-hover:bg-levely-blue/30 transition-colors">
                  <type.icon className="w-10 h-10 text-blue"/>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{type.title}</h3>
                <p className="text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Dynamic Cards */}
      <section className="section-padding bg-secondary dark:bg-[#19282D]">
        <div className="container-levely">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="headline-lg text-foreground">Beneficios para partners</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Herramientas y métricas para impulsar el éxito de tus estudiantes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card dark:bg-slate-900/80 backdrop-blur-sm p-6 hover:border-levely-blue/50 hover:shadow-xl hover:shadow-levely-blue/5 transition-all duration-300"
              >
                {/* Floating number indicator */}
                <span
                  className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/5 group-hover:text-levely-blue/10 transition-colors">
                  0{index + 1}
                </span>

                {/* Gradient overlay on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-levely-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>

                <div className="relative flex gap-4">
                  <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-levely-blue to-levely-blue/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-levely-blue/20 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-7 h-7 text-white"/>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2 text-foreground group-hover:text-levely-blue transition-colors">{benefit.title}</h3>
                    <p
                      className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-levely">
          <div
            className="relative overflow-hidden rounded-3xl bg-primary dark:bg-gradient-to-br dark:from-levely-blue dark:to-levely-blue/80 text-primary-foreground p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>
              <div
                className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"/>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <h2 className="headline-lg mb-6 text-white">
                Conviértete en partner de Levely
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Agenda una llamada con nuestro equipo para explorar cómo podemos
                ayudar a mejorar los resultados de empleabilidad de tu institución.
              </p>
              <a
                href="https://calendly.com/joinlevely/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="xl"
                  className="cursor-pointer bg-white text-primary hover:bg-white/90 dark:text-levely-blue"
                >
                  Agendar llamada
                  <ArrowRight className="w-5 h-5"/>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
