import {CvSectionType, CvType, Language, OpportunityType} from "@prisma/client";

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
  LANGUAGES: "Idiomas",
  INTERESTS: "Intereses",
};

export const languages = [
  { key: Language.ES, value: "Español" },
  { key: Language.EN, value: "Inglés" },
];

export const MODALITIES_MAP = {
  ON_SITE: "Presencial",
  REMOTE: "Remoto",
  HYBRID: "Híbrido"
}

export const MODALITIES: {key: string, value: string}[]  = Object.entries(MODALITIES_MAP).map(([key, value]) => ({ key, value }));

export const opportunities: {key: string, value: string}[] = Object.entries(OPPORTUNITY_MAP).map(([key, value]) => ({ key, value }));

export const RECOMMENDATIONS_BY_OPPORTUNITY: Record<OpportunityType, CvSectionType[]> = {
  SCHOLARSHIP: ['CONTACT', 'EDUCATION', 'PROJECTS', 'VOLUNTEERING', 'ACHIEVEMENTS', 'SKILLS'],
  INTERNSHIP: ['CONTACT', 'EDUCATION', 'PROJECTS', 'SKILLS'],
  EMPLOYMENT: ['CONTACT', 'EXPERIENCE', 'SKILLS'],
  STARTUP: ['CONTACT', 'PROJECTS', 'EXPERIENCE', 'SKILLS'],
  EXCHANGE_PROGRAM: ['CONTACT', 'EDUCATION', 'VOLUNTEERING', 'PROJECTS']
};


export const LATAM_COUNTRIES = [
  { code: "PE", name: "Perú", prefix: "+51" },
  { code: "MX", name: "México", prefix: "+52" },
  { code: "CO", name: "Colombia", prefix: "+57" },
  { code: "AR", name: "Argentina", prefix: "+54" },
  { code: "CL", name: "Chile", prefix: "+56" },
  { code: "EC", name: "Ecuador", prefix: "+593" },
  { code: "BO", name: "Bolivia", prefix: "+591" },
  { code: "UY", name: "Uruguay", prefix: "+598" },
  { code: "PY", name: "Paraguay", prefix: "+595" },
  { code: "CR", name: "Costa Rica", prefix: "+506" },
  { code: "PA", name: "Panamá", prefix: "+507" },
  { code: "DO", name: "Dom. Rep.", prefix: "+1" },
];
