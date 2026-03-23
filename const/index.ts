import {CvType, Language} from "@prisma/client";

export const cvTypes = [
  {
    key: CvType.TECHNOLOGY_ENGINEERING,
    value: "Inteligencia Artificial, Ingeniería y Sistemas", // Nombre legible
    area_ref: "ARTIFICIAL_INTELLIGENCE" // Referencia técnica para el match
  },
  {
    key: CvType.DESIGN_CREATIVITY,
    value: "Creatividad Digital & Multimedia",
    area_ref: "CREATIVE_TECH"
  },
  {
    key: CvType.MARKETING_STRATEGY,
    value: "Innovación & Estrategia de Negocios",
    area_ref: "INNOVATION_ENTREPRENEURSHIP"
  },
  {
    key: CvType.MANAGEMENT_BUSINESS,
    value: "Gestión, Innovación y Emprendimiento",
    area_ref: "INNOVATION_ENTREPRENEURSHIP"
  },
  {
    key: CvType.FINANCE_PROJECTS,
    value: "Ciencia de Datos & Finanzas Cuantitativas",
    area_ref: "DATA_SCIENCE_QUANT"
  },
  {
    key: CvType.SOCIAL_MEDIA,
    value: "Contenido Digital y Redes Sociales",
    area_ref: "CREATIVE_TECH"
  },
  {
    key: CvType.EDUCATION,
    value: "Políticas Públicas y Desarrollo Humano",
    area_ref: "PUBLIC_POLICY"
  },
  {
    key: CvType.SCIENCE,
    value: "Salud, BioTech y Sostenibilidad",
    area_ref: "HEALTH_BIOTECH"
  },
];

export const OPPORTUNITY_MAP: Record<string, string> = {
  // INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  // EMPLOYMENT: "Empleo",
  STARTUP: "Aceleradora",
};

export const SECTION_LABELS: Record<string, string> = {
  SUMMARY: "Resumen Profesional",
  EXPERIENCE: "Experiencia Laboral",
  EDUCATION: "Formación Académica",
  SKILLS: "Habilidades Técnicas",
  PROJECTS: "Proyectos Destacados",
  VOLUNTEERING: "Voluntariado",
  CERTIFICATIONS: "Certificaciones",
  COMPLEMENTS: "Información Complementaria",
  ACHIEVEMENTS: "Logros",
  CONTACT: "Información de Contacto",
};

export const languages = [
  { key: Language.ES, value: "Español" },
  { key: Language.EN, value: "Inglés" },
];

export const opportunities: {key: string, value: string}[] = Object.entries(OPPORTUNITY_MAP).map(([key, value]) => ({ key, value }));

// const OPPORTUNITY_DESCRIPTIONS: Record<string, string> = {
//   [OpportunityType.INTERNSHIP]: "Oportunidades de prácticas profesionales.",
//   [OpportunityType.SCHOLARSHIP]: "Oportunidades de becas académicas.",
//   [OpportunityType.EXCHANGE_PROGRAM]: "Oportunidades de programas de intercambio.",
//   [OpportunityType.EMPLOYMENT]: "Oportunidades de empleo y trabajo.",
//   default: "Selecciona un tipo de oportunidad para ver su descripción."
// };
//
// const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
//   harvard: "Diseño clásico y profesional, reconocido internacionalmente.",
//   europass: "Diseño europeo estructurado, ideal para becas de movilidad y Erasmus+.",
//   default: "Elige un diseño que se adapte a tu perfil y oportunidad."
// };
//
// const CV_TYPE_DESCRIPTIONS: Record<string, string> = {
//   [CvType.TECHNOLOGY_ENGINEERING]: "Ideal para perfiles en sistemas, software, innovación o data.",
//   [CvType.DESIGN_CREATIVITY]: "Para creativos visuales, diseñadores gráficos, UX/UI o artistas digitales.",
//   [CvType.MARKETING_STRATEGY]: "Para marketers, comunicadores o estrategas de contenido.",
//   [CvType.MANAGEMENT_BUSINESS]: "Para administración, emprendimiento o desarrollo comercial.",
//   [CvType.FINANCE_PROJECTS]: "Para gestión financiera, análisis económico o PMO.",
//   [CvType.SOCIAL_MEDIA]: "Para community managers, creadores de contenido o influencers.",
//   [CvType.EDUCATION]: "Para docentes, formadores, capacitadores o coaches.",
//   [CvType.SCIENCE]: "Para perfiles STEM, sostenibilidad, impacto o proyectos de investigación.",
//   default: "Selecciona un perfil profesional para ver su descripción."
// };
//
// export const opportunityTypes = [
//   { key: OpportunityType.INTERNSHIP, value: "Pasantía" },
//   { key: OpportunityType.SCHOLARSHIP, value: "Beca" },
//   { key: OpportunityType.EXCHANGE_PROGRAM, value: "Intercambio" },
//   { key: OpportunityType.EMPLOYMENT, value: "Empleo" },
//   { key: OpportunityType.STARTUP, value: "Aceleradora" },
// ]
