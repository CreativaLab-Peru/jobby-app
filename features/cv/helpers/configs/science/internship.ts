import type { SectionConfig } from "../../types";

export const scienceInternship: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "certifications"],

  examples: {
    // Personal
    "personal.summary":
      "Estudiante de ciencias con sólida formación en metodología científica y experiencia en proyectos de investigación. Apasionado por el descubrimiento científico y el análisis de datos. Busco una pasantía de investigación para contribuir a proyectos innovadores y desarrollar mis habilidades en un entorno científico profesional.",

    // Education
    "education.title": "Biología / Química",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2026",
    "education.honors": "Tercio Superior, Mejor Proyecto de Investigación 2023",

    // Projects
    "projects.title": "Análisis de Biodiversidad en Ecosistemas Andinos",
    "projects.description":
      "Realicé un estudio de campo sobre la diversidad de especies en la región andina. Recolecté y analicé muestras, documenté hallazgos y presenté resultados en simposio universitario. El proyecto contribuyó a la base de datos de conservación regional.",
    "projects.technologies":
      "Microscopía, Análisis Estadístico (R, SPSS), Excel, Técnicas de Muestreo",
    "projects.duration": "6 meses (Mayo 2024 - Oct 2024)",

    // Skills
    "skills.technical":
      "Metodología Científica, Análisis de Datos, Técnicas de Laboratorio, Microscopía, Redacción Científica, R/Python, SPSS, Gestión de Bases de Datos, Protocolos de Seguridad",
    "skills.soft":
      "Pensamiento analítico, Atención al detalle, Trabajo en equipo, Resolución de problemas, Perseverancia",
    "skills.languages":
      "Español (Nativo), Inglés (Intermedio - B1), Quechua (Básico)",

    // Certifications
    "certifications.name":
      "Certificación en Métodos de Investigación Científica",
    "certifications.issuer": "Coursera",
    "certifications.date": "Noviembre 2023",
  },
};
