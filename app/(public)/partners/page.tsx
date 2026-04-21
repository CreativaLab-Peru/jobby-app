import { LogosSection } from "@/components/ui/app/public/partners/logos-section";
import PartnersHero from "@/components/ui/app/public/partners/hero";
import PartnerTypes from "@/components/ui/app/public/partners/partner-types";
import Comparison from "@/components/ui/app/public/partners/comparison";
import TrustLevelyGrid from "@/components/ui/app/public/partners/trust-levely-grid";
import PartnersCTA from "@/components/ui/app/public/partners/cta";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  Award,
  Building2,
  Handshake,
  Info,
  AlertCircle,
  CheckCircle2Icon,
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
    title: "Universidades e Instituciones Educativas",
    description:
      "Tienes estudiantes con potencial para Chevening, Fulbright o DAAD — pero sin orientación estructurada ni datos para medir quién está listo.",
    words: ["200 - 500 estudiantes", "Programa de becas"],
  },
  {
    icon: Building2,
    title: "Aceleradoras e Incubadoras",
    description:
      "Tus emprendedores quieren aplicar a YCombinator, Techstars o fondos internacionales — pero sus perfiles no están preparados para pasar el filtro.",
    words: ["10 - 100 emprendedores", "Cohortes activas"],
  },
  {
    icon: Award,
    title: "ONGs y Programas de Desarrollo",
    description:
      "Trabajas con jóvenes talentos de comunidades sub-representadas que necesitan acceso a oportunidades globales con orientación personalizada",
    words: ["Impacto Social", "Talento emergentes"],
  },
];

const parameters = [
  {
    value: "10x",
    description: "más rápido por candidato",
  },
  {
    value: "2 min",
    description: "análisis completo por perfil",
  },
  {
    value: "+100",
    description: "perfiles analizados en LATAM",
  },
];

const whitoutLevely = [
  {
    title: "Sin Levely",
    items: [
      "No sabes quién está listo",
      "CVs rechazados en el primer filtro",
      "Seguimiento manual imposible",
      "Sin datos para directivos",
      "Resultados inconsistentes",
    ],
  },
  {
    title: "Con Levely",
    items: [
      "Dashboard con score de cada uno",
      "CV correcto para cada beca",
      "IA analiza 100 perfiles en minutos",
      "Reporte exportable para directivos",
      "Roadmap personalizado por beca",
    ],
  },
];

const TrustLevely = [
  {
    title: "10x más rápido que hacerlo manualmente",
    icon: Info,
    description:
      "Lo que antes tomaba días de revisión individual, Levely lo hace en minutos. Analiza cohortes completas sin esfuerzo humano.",
  },
  {
    title: "Datos reales para justificar presupuesto",
    icon: BarChart3,
    description:
      "Scores de empleabilidad, progreso por fase y tasas de preparación — todo exportable para presentarle a tus directivos con números.",
  },
  {
    title: "Seguimiento personalizado a escala",
    icon: Users,
    description:
      "Cada miembro recibe feedback específico para su beca meta — aunque tengas 200 personas. Sin que tú revises cada CV.",
  },
  {
    title: "Candidatos más competitivos en cada convocatoria",
    icon: CheckCircle2Icon,
    description:
      "CV en el formato correcto para cada beca, roadmap personalizado y textos mejorados por IA — todo en un solo lugar.",
  },
];

export default function Partners() {
  return (
    <>
      <PartnersHero parameters={parameters} />

      {/* Logos Section */}
      <LogosSection />

      {/* Partner types */}
      <PartnerTypes partnerTypes={partnerTypes} />

      {/* Comparison: Sin Levely vs Con Levely */}
      <Comparison whitoutLevely={whitoutLevely} />

      {/* Trust levely grid */}
      <TrustLevelyGrid TrustLevely={TrustLevely} />

      {/* CTA */}
      <PartnersCTA />
    </>
  );
}
