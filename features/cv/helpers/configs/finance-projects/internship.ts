import type { SectionConfig } from "../../types";

export const financeProjectsInternship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "skills",
    "certifications",
  ],
  requiredFields: {
    // Summary opcional en todos los CVs
    "personal.summary": false,
    // Educación obligatoria para internships
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    // Personal
    "personal.summary":
      "Aspirante a profesional en finanzas con una sólida base en análisis financiero y estrategias de inversión, buscando aplicar mis habilidades en un entorno de pasantía dinámico.",

    // Education
    "education.title":
      "Bachiller en Finanzas",
    "education.institution":
      "Universidad de Finanzas",
    "education.location":
      "Nueva York, NY",
    "education.year":
      "2023",
    "education.honors":
      "Magna Cum Laude",

    // Projects
    "projects.title":
      "Plan de Marketing Digital para Pyme textil",
    "projects.description":
      "Diseñé e implementé una estrategia de marketing digital que incrementó en un 35% la visibilidad online de una empresa textil. Incluyó gestión de redes sociales, campañas segmentadas en Meta Ads y optimización de contenidos.",
    "projects.technologies":
      "Meta Ads, Canva, Google Analytics",
    "projects.duration":
      "3 meses (Enero 2023 - Marzo 2023)",

    // Skills
    "skills.technical":
      "Modelado Financiero, Análisis de Datos, Python, R, SQL, Tableau",
    "skills.soft":
      "Pensamiento Analítico, Resolución de Problemas, Comunicación Asertiva, Trabajo en Equipo",
    "skills.languages":
      "Inglés (Nativo), Español (Fluido)",
  },
};
