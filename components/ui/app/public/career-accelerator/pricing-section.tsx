import {Button} from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Video,
  Brain
} from "lucide-react";

const liveSessionFeatures = [
  "Clases con expertos en empleabilidad",
  "Workshops de CV y LinkedIn",
  "Preparación para entrevistas",
  "Estrategias para becas internacionales",
];

const aiFeatures = [
  "Análisis personalizado de tu perfil profesional",
  "Score de empleabilidad con IA",
  "Feedback detallado para mejorar tu CV",
  "Recomendaciones de hasta 20 oportunidades",
  "Hasta 3 versiones optimizadas de CV",
  "Descarga en PDF y Word",
  "Créditos IA incluidos",
];

const mentoringFeatures = [
  "Acceso a +20 mentores globales",
  "Comunidad privada Levely",
  "Oportunidades de empresas y universidades aliadas",
];

const pricingFeatures = [
  "Clases en vivo con mentores",
  "IA para optimizar tu perfil profesional",
  "Recomendaciones personalizadas de oportunidades",
  "Mentoría grupal y networking",
  "Acceso a comunidad Levely",
  "Certificado de participación",
];

export function PricingSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Features */}
          <div className="space-y-10">
            <div>
              <h2 className="headline-lg mb-4">
                Career Accelerator: tu ruta intensiva hacia prácticas, trabajos y becas
              </h2>
              <p className="text-lg text-muted-foreground">
                Un programa intensivo de 4 semanas con mentores, IA y oportunidades
                reales para acelerar tu carrera profesional.
              </p>
            </div>

            {/* Live Sessions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-levely-orange/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-levely-orange"/>
                </div>
                <h3 className="font-bold text-lg">Sesiones en vivo</h3>
              </div>
              <ul className="space-y-3 pl-[52px]">
                {liveSessionFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-levely-orange mt-0.5 flex-shrink-0"/>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-500"/>
                </div>
                <h3 className="font-bold text-lg">Inteligencia Artificial aplicada a tu carrera</h3>
              </div>
              <ul className="space-y-3 pl-[52px]">
                {aiFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"/>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mentoring */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500"/>
                </div>
                <h3 className="font-bold text-lg">Mentoría y networking</h3>
              </div>
              <ul className="space-y-3 pl-[52px]">
                {mentoringFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"/>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="lg:sticky lg:top-8">
            <div className="relative">
              {/* Gradient glow effect */}
              <div
                className="absolute -inset-1 bg-gradient-to-r from-levely-orange via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-20"/>

              <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-xl">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-levely-orange/10 text-levely-orange text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4"/>
                  Cupos limitados
                </div>

                <h3 className="text-2xl font-bold mb-2">Career Accelerator Program</h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">S/ 350</span>
                </div>

                <p className="text-muted-foreground mb-8">
                  Programa intensivo de 4 semanas · Inicio próxima cohorte
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full bg-levely-orange/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-levely-orange"/>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  size="xl"
                  className="cursor-pointer w-full bg-levely-orange text-white hover:bg-levely-orange/90 mb-4"
                >
                  Proximamente
                  <ArrowRight className="w-5 h-5"/>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Acceso inmediato al CV Builder y herramientas IA incluidas.
                </p>

                {/* Value breakdown */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="text-sm font-medium mb-4 text-center">Valor total del programa</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">4 semanas de clases en vivo</span>
                      <span className="line-through text-muted-foreground">S/ 200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Herramientas IA premium</span>
                      <span className="line-through text-muted-foreground">S/ 150</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mentoría y networking</span>
                      <span className="line-through text-muted-foreground">S/ 200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Acceso comunidad Levely</span>
                      <span className="line-through text-muted-foreground">S/ 100</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-border/50">
                      <span>Valor real</span>
                      <span className="line-through text-muted-foreground">S/ 650</span>
                    </div>
                    <div className="flex justify-between font-bold text-levely-orange">
                      <span>Tú pagas</span>
                      <span>S/ 350</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
