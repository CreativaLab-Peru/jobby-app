import {Button} from "@/components/ui/button";
import {
  Rocket,
  ArrowRight,
  Calendar,
  Users,
  Award,
  CheckCircle2
} from "lucide-react";
import {PricingSection} from "@/components/ui/app/public/career-accelerator/pricing-section";
import {ExpertsSection} from "@/components/ui/app/public/career-accelerator/experts-section";

const programWeeks = [
  {
    week: "Semana 1",
    title: "Autoconocimiento y Posicionamiento",
    items: [
      "Identificación de fortalezas y áreas de desarrollo",
      "Definición de objetivos profesionales",
      "Análisis de mercado laboral",
    ],
  },
  {
    week: "Semana 2",
    title: "Perfil Profesional",
    items: [
      "Optimización de CV con IA",
      "Creación de LinkedIn estratégico",
      "Desarrollo de marca personal",
    ],
  },
  {
    week: "Semana 3",
    title: "Estrategia de Búsqueda",
    items: [
      "Técnicas de networking efectivo",
      "Preparación para entrevistas",
      "Simulaciones y feedback",
    ],
  },
  {
    week: "Semana 4",
    title: "Acción y Lanzamiento",
    items: [
      "Aplicación estratégica a oportunidades",
      "Seguimiento y negociación",
      "Plan de desarrollo continuo",
    ],
  },
];

export default function CareerAccelerator() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-[#19282D] text-white overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 bg-levely-orange/30 rounded-full blur-3xl"/>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-levely-orange/20 rounded-full blur-3xl"/>
        </div>

        <div className="container-levely relative">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-levely-orange/20 text-levely-orange text-sm font-medium mb-6">
              <Rocket className="w-4 h-4"/>
              Programa Premium
            </div>

            <h1 className="headline-xl mb-6">
              Career Accelerator
            </h1>

            <p className="text-xl text-white/80 mb-8">
              Un programa intensivo de 4 semanas para acelerar tu crecimiento profesional
              con mentores expertos, herramientas de IA y una metodología probada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="xl"
                className="cursor-pointer bg-levely-orange text-white hover:bg-levely-orange/90"
              >
                Proximanente
              </Button>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90">
                <Calendar className="w-4 h-4"/>
                <span className="text-sm font-medium">Inicio: 15 de Febrero 2025</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-levely-orange"/>
                <span>4 semanas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-levely-orange"/>
                <span>Grupos reducidos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-levely-orange"/>
                <span>Certificación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program structure */}
      <section className="section-padding bg-secondary dark:bg-[#19282D]">
        <div className="container-levely">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="headline-lg">Estructura del programa</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Un recorrido diseñado para maximizar tu empleabilidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {programWeeks.map((week) => (
              <div
                key={week.week}
                className="bg-card p-6 sm:p-8 rounded-2xl border border-levely-orange/10 hover:border-levely-orange/30 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-sm font-bold text-levely-orange mb-2 block">
                  {week.week}
                </span>
                <h3 className="text-xl font-bold mb-4">{week.title}</h3>
                <ul className="space-y-3">
                  {week.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-levely-orange mt-0.5 flex-shrink-0"/>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection/>

      {/* Experts Network */}
      <ExpertsSection/>
    </>
  );
}
