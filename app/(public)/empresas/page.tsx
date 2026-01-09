import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Target, TrendingUp, Award, CheckCircle2, Zap } from "lucide-react";

export const dynamic = 'force-dynamic'

const Empresas = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold border border-accent/30">
                🚀 Para Empresas
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Encuentra el{" "}
              <span className="text-gradient">talento creativo</span>
              {" "}que necesitas
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Accede a una base de datos de jóvenes profesionales creativos con
              CVs optimizados por IA. Conecta con el talento del futuro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button size="xl" className="shadow-glow">
                  Solicitar demo
                </Button>
              </a>
              <a href="#planes">
                <Button variant="outline" size="xl">
                  Conocer planes
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Beneficios para tu <span className="text-gradient">empresa</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all">
              <Users className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">Base de talentos</h3>
              <p className="text-muted-foreground">
                Accede a miles de perfiles de jóvenes profesionales en diseño,
                marketing, desarrollo y más áreas creativas.
              </p>
            </Card>

            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all">
              <Target className="h-12 w-12 text-secondary mb-6" />
              <h3 className="text-xl font-bold mb-3">CVs optimizados con IA</h3>
              <p className="text-muted-foreground">
                Todos los CVs están optimizados y compatibles con ATS, facilitando
                tu proceso de selección.
              </p>
            </Card>

            <Card className="p-8 bg-card shadow-card hover:shadow-glow transition-all">
              <TrendingUp className="h-12 w-12 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-3">Patrocinio de CVs</h3>
              <p className="text-muted-foreground">
                Patrocina CVs de candidatos que coincidan con tu perfil ideal y
                destaca tus oportunidades.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Paquetes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 id="planes" className="text-3xl sm:text-5xl font-bold mb-4 scroll-mt-32">
              Nuestros <span className="text-gradient">planes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluciones diseñadas para empresas de todos los tamaños
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
            {/* Starter
            <Card className="p-8 bg-card shadow-card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold text-primary mb-2">$99</div>
                <p className="text-muted-foreground">por mes</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Hasta 10 búsquedas/mes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Acceso básico a base de datos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Soporte por email</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                Comenzar
              </Button>
            </Card> */}

            {/* Enterprise */}
            <Card className="p-10 bg-card shadow-card relative max-w-md mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                {/* <div className="text-4xl font-bold text-primary mb-2">Custom</div> */}
                <p className="text-muted-foreground">contactar ventas</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Todo del plan Professional</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Patrocinio ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">API personalizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Account manager dedicado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Integración con tu ATS</span>
                </li>
              </ul>

              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Contactar
                </Button>
              </a>
            </Card>

            {/* Professional */}
            <Card className="p-8 bg-linear-to-br from-secondary/20 to-primary/20 shadow-glow border-2 border-primary/50 relative max-w-md mx-auto">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                  POPULAR
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                {/* <div className="text-4xl font-bold text-primary mb-2">$299</div> */}
                <p className="text-muted-foreground">por mes</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Búsquedas ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Acceso completo a base de datos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Patrocinio de 5 CVs/mes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Analíticas avanzadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Soporte prioritario</span>
                </li>
              </ul>

              <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
                <Button className="w-full shadow-glow">
                  Comenzar
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <Award className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            ¿Listo para <span className="text-gradient">empezar</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya están descubriendo talento creativo con Levely
          </p>
          <a href="https://calendly.com/mariluzdara/asesoria" target="_blank" rel="noopener noreferrer">
            <Button size="xl" className="shadow-glow">
              Solicitar demo ahora
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Empresas;
