import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {GraduationCap, BarChart3, Shield, CheckCircle2, BookOpen, Sparkles} from "lucide-react";

const Instituciones = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary"/>
              <span className="text-sm font-medium text-primary">
                Para Instituciones
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Potencia la{" "}
              <span className="text-gradient">empleabilidad</span>
              {" "}de tus estudiantes
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Ofrece a tus estudiantes acceso a herramientas de IA para crear CVs
              profesionales y métricas de empleabilidad para tu institución.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button size="xl" variant="secondary" className="shadow-glow">
                  Agendar presentación
                </Button>
              </a>
              {/* <Button variant="outline" size="xl">
                Ver casos de éxito
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Beneficios para tu <span className="text-gradient">institución</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all">
              <GraduationCap className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">Licencias estudiantiles</h3>
              <p className="text-muted-foreground">
                Proporciona acceso premium a todos tus estudiantes para crear CVs
                profesionales optimizados con IA.
              </p>
            </Card>

            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all">
              <BarChart3 className="h-12 w-12 text-secondary mb-6" />
              <h3 className="text-xl font-bold mb-3">Reportes de empleabilidad</h3>
              <p className="text-muted-foreground">
                Accede a métricas y reportes sobre la empleabilidad de tus egresados
                y estudiantes activos.
              </p>
            </Card>

            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all">
              <BookOpen className="h-12 w-12 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-3">Formación incluida</h3>
              <p className="text-muted-foreground">
                Capacitación para docentes y talleres para estudiantes sobre cómo
                aprovechar al máximo la plataforma.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-5xl font-bold">
                Dashboard <span className="text-gradient">institucional</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Monitorea en tiempo real el progreso de tus estudiantes y obtén
                insights valiosos sobre su preparación laboral.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Métricas en tiempo real</p>
                    <p className="text-sm text-muted-foreground">
                      Seguimiento de CVs creados, oportunidades obtenidas y más
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Reportes personalizados</p>
                    <p className="text-sm text-muted-foreground">
                      Genera reportes por carrera, ciclo o cohorte
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Integración con sistemas</p>
                    <p className="text-sm text-muted-foreground">
                      API para conectar con tus sistemas educativos
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <Card className="p-8 bg-card shadow-glow">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total CVs creados</span>
                  <span className="text-2xl font-bold text-primary">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Oportunidades obtenidas</span>
                  <span className="text-2xl font-bold text-secondary">567</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tasa de empleabilidad</span>
                  <span className="text-2xl font-bold text-accent">78%</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Datos de ejemplo - Dashboard institucional
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Paquetes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Planes <span className="text-gradient">institucionales</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluciones flexibles adaptadas al tamaño de tu institución
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Small */}
            <Card className="p-8 bg-card shadow-card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Small</h3>
                {/* <div className="text-4xl font-bold text-primary mb-2">$499</div>
                <p className="text-muted-foreground">por mes</p> */}
                <p className="text-sm text-muted-foreground mt-2">Hasta 500 estudiantes</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Licencias para 500 estudiantes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Dashboard básico</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">1 taller de capacitación</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Soporte por email</span>
                </li>
              </ul>

              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Solicitar información
                </Button>
              </a>
            </Card>

            {/* Medium */}
            <Card className="p-8 bg-linear-to-br from-secondary/20 to-primary/20 shadow-glow border-2 border-primary/50 relative">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                  POPULAR
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Medium</h3>
                {/* <div className="text-4xl font-bold text-primary mb-2">$999</div>
                <p className="text-muted-foreground">por mes</p> */}
                <p className="text-sm text-muted-foreground mt-2">Hasta 2,000 estudiantes</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Licencias para 2,000 estudiantes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Dashboard completo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">4 talleres de capacitación</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Reportes personalizados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Soporte prioritario</span>
                </li>
              </ul>

              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Solicitar información
                </Button>
              </a>
            </Card>

            {/* Large */}
            <Card className="p-8 bg-card shadow-card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Large</h3>
                {/* <div className="text-4xl font-bold text-primary mb-2">Custom</div>
                <p className="text-muted-foreground">contactar ventas</p> */}
                <p className="text-sm text-muted-foreground mt-2">Más de 2,000 estudiantes</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Licencias ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Dashboard enterprise</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Talleres ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Integración personalizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Account manager dedicado</span>
                </li>
              </ul>

              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Solicitar información
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <Shield className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Invierte en el futuro de <span className="text-gradient">tus estudiantes</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a las instituciones educativas que están transformando la
            empleabilidad de sus egresados
          </p>
          <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
            <Button size="xl" variant="secondary" className="shadow-glow">
              Agendar presentación
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Instituciones;
