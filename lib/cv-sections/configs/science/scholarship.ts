import type { SectionConfig } from "../../types";

export const scienceScholarship: SectionConfig = {
  sections: ["personal", "projects", "achievements", "education"],

  examples: {
    // Personal - Summary
    "personal.summary":
      "La investigación científica y el análisis riguroso definen mi pasión por descubrir nuevos conocimientos. Como estudiante de Biología con especialización en microbiología y biotecnología, busco contribuir al avance científico mediante investigación innovadora y metodologías experimentales. Mi pensamiento crítico y dedicación por la excelencia académica me impulsan a generar aportes significativos en el campo científico.",

    // Projects
    "projects.title":
      "Análisis de Resistencia Antimicrobiana en Bacterias Locales",
    "projects.description":
      "Investigación sobre patrones de resistencia antibiótica en cepas bacterianas aisladas de muestras ambientales. El proyecto incluyó cultivo bacteriano, pruebas de sensibilidad antimicrobiana y análisis estadístico de resultados para identificar tendencias emergentes.",
    "projects.technologies":
      "PCR, Espectrofotometría, SPSS, Python (análisis de datos)",
    "projects.duration": "6 meses (Marzo 2023 - Agosto 2023)",

    // Achievements
    "achievements.title": "Ganador de Beca de Excelencia Académica PRONABEC",
    "achievements.description":
      "Seleccionado entre más de 5,000 postulantes a nivel nacional para recibir beca completa de estudios universitarios basada en mérito académico y potencial investigador. Mantuve promedio superior a 16/20 durante todos los ciclos académicos y participé en proyectos de investigación del departamento de ciencias biológicas.",
    "achievements.date": "Enero 2023",

    // Education
    "education.title": "Biología",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Julio 2026",
    "education.honors":
      "Tercio Superior (Top 10%), Mejor Promedio en curso de Microbiología Avanzada, Beca de Excelencia Académica 2023",
  },
};
