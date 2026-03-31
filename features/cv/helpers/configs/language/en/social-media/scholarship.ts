import type { SectionConfig } from "../../../../types";

export const socialMediaScholarship: SectionConfig = {
  sections: ["personal", "projects", "achievements", "education"],

  // Educación opcional para becas
  requiredFields: {
    "personal.summary": false,
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },

  examples: {
    // Personal - Summary
    "personal.summary":
      "Estudiante destacado en comunicación digital y redes sociales, con excelente rendimiento académico y pasión por el desarrollo de proyectos creativos. Busco una beca para profundizar en estrategias de marketing digital y social media, aportando innovación y un impacto positivo en la comunidad académica y profesional.",

    // Projects
    "projects.title": "Proyecto de Contenido Digital Multicultural",
    "projects.description":
      "Diseñé y ejecuté un proyecto académico de contenido digital enfocado en culturas latinoamericanas, integrando investigación, creación de materiales visuales y gestión de campañas en redes sociales, logrando interacción significativa y colaboración con estudiantes de varios países.",
    "projects.technologies": "Instagram, TikTok, Canva, CapCut, Plataformas de colaboración académica",
    "projects.duration": "6 meses (Ene 2024 - Jun 2024)",

    // Achievements
    "achievements.title": "Reconocimiento por Excelencia Académica y Liderazgo en Proyectos Digitales",
    "achievements.description":
      "Seleccionado entre numerosos candidatos por desempeño académico sobresaliente y liderazgo en proyectos de comunicación digital. Participación activa en iniciativas de social media con resultados medibles y contribución a la comunidad estudiantil.",
    "achievements.date": "2023",

    // Education
    "education.title": "Licenciatura en Comunicación Digital",
    "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado 2026",
    "education.honors":
      "Tercio Superior (Top 10%), Reconocimiento al Rendimiento Académico, Participación en Programas de Excelencia en Medios Digitales",
  },
};