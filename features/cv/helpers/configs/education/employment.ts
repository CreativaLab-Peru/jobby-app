import type { SectionConfig } from "../../types";
export const educationEmployment: SectionConfig = {
  sections: [
    "personal",
    "education",
    "achievements",
    "certifications",
    "skills",
  ],
  examples: {
    // Personal
    "personal.summary":
      "Profesional de finanzas con experiencia en gestión de proyectos financieros, análisis de inversiones y planificación estratégica. Comprometido con la optimización de recursos y la generación de valor para la organización mediante análisis rigurosos y toma de decisiones basada en datos.",

    // Education
    "education.title": "Licenciatura en Finanzas",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2025",
    "education.honors":
      "Promedio ponderado: 16.2/20, Miembro del Club de Finanzas e Inversiones",

    //Achievements
    "achievements.title": "Premio al Mejor Proyecto de Inversión Estudiantil",
    "achievements.description":
      "Lideré un equipo de estudiantes para desarrollar un plan de inversión innovador que fue reconocido a nivel universitario por su enfoque estratégico y análisis detallado.",
    "achievements.date": "Octubre 2023",

    // Certifications
    "certifications.name": "Certificación en Análisis Financiero (CFA Level 1)",
    "certifications.issuer": "CFA Institute",
    "certifications.date": "2023",

    // Skills
    "skills.technical":
      "Excel avanzado, Power BI, modelado financiero, análisis de ratios, evaluación de proyectos (VAN, TIR), manejo de Bloomberg y software de gestión financiera.",
    "skills.soft":
      "Pensamiento analítico, atención al detalle, comunicación efectiva de resultados financieros, trabajo bajo presión, capacidad de negociación y toma de decisiones estratégicas.",
  },
};
