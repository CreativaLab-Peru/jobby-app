import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Download,
  LayoutDashboard,
  Target,
  BookOpen,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

const resources = [
  {
    icon: FileText,
    title: "Plantilla de CV Profesional",
    description: "Template optimizado para pasar filtros ATS y destacar ante reclutadores.",
    type: "Notion Template",
    cta: "Descargar gratis",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard de Aplicaciones",
    description: "Organiza y da seguimiento a todas tus postulaciones en un solo lugar.",
    type: "Notion Template",
    cta: "Descargar gratis",
  },
  {
    icon: Briefcase,
    title: "Tracker de Oportunidades Laborales",
    description: "Base de datos para gestionar vacantes, contactos y estado de aplicaciones.",
    type: "Notion Template",
    cta: "Descargar gratis",
  },
  {
    icon: GraduationCap,
    title: "Tracker de Becas",
    description: "Organiza becas por fecha límite, requisitos y probabilidad de éxito.",
    type: "Notion Template",
    cta: "Descargar gratis",
  },
  {
    icon: Target,
    title: "Planificador de Carrera",
    description: "Define objetivos, hitos y acciones para tu desarrollo profesional.",
    type: "Notion Template",
    cta: "Descargar gratis",
  },
  {
    icon: BookOpen,
    title: "Guía de Entrevistas",
    description: "Preguntas frecuentes, tips y frameworks para destacar en entrevistas.",
    type: "PDF Guide",
    cta: "Descargar gratis",
  },
];

export default function Resources() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-levely-dark">
        <div className="container-levely">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-levely-green/10 text-levely-green text-sm font-medium mb-6">
              <Download className="w-4 h-4"/>
              Recursos gratuitos
            </div>

            <h1 className="text-white headline-xl mb-6">
              Herramientas para impulsar tu carrera
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Templates, dashboards y guías diseñadas para ayudarte a organizar
              tu búsqueda laboral y maximizar tus oportunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Resources grid */}
      <section className="section-padding">
        <div className="container-levely">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="text-levely-dark card-elevated group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl bg-levely-green/40 flex items-center justify-center group-hover:bg-levely-green/60 transition-colors">
                    <resource.icon className="w-6 h-6 text-levely-dark"/>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary dark:text-white">
                    {resource.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{resource.description}</p>

                <Button variant="outline" className="cursor-pointer w-full text-white bg-levely-dark group-hover:border-levely-green/50">
                  {resource.cta}
                  <ExternalLink className="w-4 h-4"/>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 section-padding bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl headline-lg mb-4 sm:mb-6">
              ¿Quieres más herramientas?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
              Desbloquea acceso a todas las herramientas de optimización con Levely. Analiza tu CV,
              recibe recomendaciones personalizadas y accede a oportunidades.
            </p>
            <Link href="/register">
              <Button variant="accent" size="lg" className="cursor-pointer w-full sm:w-auto">
              Empezar con Levely
              <ArrowRight className="w-5 h-5"/>
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
