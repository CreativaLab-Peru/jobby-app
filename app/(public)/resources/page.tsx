import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ArrowRight,
  Download,
  LayoutDashboard,
  Target,
  BookOpen,
  Briefcase,
  GraduationCap,
  ExternalLink
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
      <section className="py-20 section-padding gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
          <Download className="w-4 h-4" />
          Recursos gratuitos
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-7xl headline-xl mb-6">
          Herramientas para impulsar tu carrera
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
          Templates, dashboards y guías diseñadas para ayudarte a organizar 
          tu búsqueda laboral y maximizar tus oportunidades.
        </p>
          </div>
        </div>
      </section>

      {/* Resources grid */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 section-padding">
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
        <div
          key={resource.title}
          className="bg-card rounded-2xl p-6 sm:p-8 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <resource.icon className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary">
            {resource.type}
          </span>
          </div>

          <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
          <p className="text-muted-foreground text-sm mb-6">{resource.description}</p>

          <Button
          variant="outline"
          className="text-black border border-gray-400 dark:border-gray-600 dark:text-white w-full group-hover:border-accent/50"
          >
          {resource.cta}
          <ExternalLink className="w-4 h-4" />
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
          Desbloquea acceso a todas las herramientas de optimización con Levely. 
          Analiza tu CV, recibe recomendaciones personalizadas y accede a oportunidades.
        </p>
        <Button 
          size="lg" 
          className="w-full sm:w-auto"
        >
          Empezar con Levely
          <ArrowRight className="w-5 h-5" />
        </Button>
          </div>
        </div>
      </section>
    </>
  );
}
