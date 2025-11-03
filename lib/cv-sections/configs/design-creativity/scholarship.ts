import type { SectionConfig } from "../../types";

export const designCreativityScholarship: SectionConfig = {
  sections: [
    "personal",
    "projects",
    "achievements",
    "education",
  ],

  examples: {
    // Personal - Summary
    "personal.summary":
        "Arte y tecnología se entrelazan en mi pasión por el diseño creativo. Como estudiante de Ingeniería de Sistemas con un fuerte interés en machine learning y análisis de datos, busco aplicar mis habilidades técnicas para resolver problemas complejos y generar impacto positivo. Mi enfoque innovador y capacidad para trabajar en equipo me impulsan a sobresalir en entornos dinámicos y desafiantes.",

    // Projects
    "projects.title": 
        "Logo para Startup de Tecnología Educativa",
    "projects.description":
        "Diseño de un logotipo moderno y versátil para una nueva startup enfocada en soluciones educativas basadas en tecnología. El proceso incluyó la investigación de la competencia y la creación de un manual de marca.",
    "projects.technologies":
        "Adobe Illustrator, Figma",
    "projects.duration":
        "3 meses (Sept 2023 - Nov 2023)",

    // Achievements
    "achievements.title": 
        "Ganador de Beca de Excelencia Académica PRONABEC",
    "achievements.description":
        "Seleccionado entre más de 5,000 postulantes a nivel nacional para recibir beca completa de estudios universitarios basada en mérito académico y liderazgo estudiantil. Mantuve promedio superior a 16/20 durante todos los ciclos académicos y participé activamente en organizaciones estudiantiles de tecnología.",
    "achievements.date": 
        "Enero 2023",

    // Education
    "education.title": 
        "Diseño Gráfico",
    "education.institution":
        "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location":
        "Cusco, Perú",
    "education.year":
        "Esperado Julio 2026",
    "education.honors":
        "Tercio Superior (Top 10%), Mejor Promedio en curso de Algoritmos Avanzados, Beca de Excelencia Académica 2023",
  },
};
