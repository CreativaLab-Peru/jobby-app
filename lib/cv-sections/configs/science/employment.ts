import type { SectionConfig } from "../../types";
export const scienceEmployment: SectionConfig = {
  sections: [
    "personal",
    "education",
    "experience",
    "achievements",
    "certifications",
    "skills",
  ],
  examples: {
    "personal.summary":
      "Científico investigador con más de 7 años de experiencia en biotecnología y desarrollo de nuevos fármacos. Especializado en biología molecular y análisis de datos genómicos, con publicaciones en revistas de alto impacto. Comprometido con la innovación científica y la colaboración interdisciplinaria para resolver desafíos complejos en salud humana.",

    // Education
    "education.title": "Doctorado en Biología Molecular",
    "education.institution": "Universidad Complutense de Madrid",
    "education.location": "Madrid, España",
    "education.year": "Graduación en septiembre 2018",
    "education.honors":
      "Cum Laude, Beca FPI del Ministerio de Ciencia e Innovación",

    // Experience
    "experience.company": "Instituto de Investigación Biomédica",
    "experience.location": "Barcelona, España",
    "experience.position": "Investigador Postdoctoral",
    "experience.duration": "Enero 2019 - Presente",
    "experience.responsibilities":
      "• Diseñé y ejecuté experimentos de expresión génica que identificaron 3 nuevos biomarcadores potenciales para cáncer colorrectal.\n• Supervisé a 2 estudiantes de doctorado y 3 de máster en proyectos de investigación colaborativos.\n• Publiqué 8 artículos en revistas indexadas (Q1) con un factor de impacto promedio de 7.5.\n• Obtuve financiación por €150,000 mediante la coordinación de proyectos europeos H2020.",

    // Achievements
    "achievements.title": "Premio Joven Investigador en Oncología Molecular",
    "achievements.description":
      "Reconocimiento por la identificación de un nuevo mecanismo de resistencia a fármacos en células tumorales, contribuyendo al desarrollo de terapias combinadas más efectivas. El trabajo fue destacado en portada de la revista Nature Communications.",
    "achievements.date": "Noviembre 2022",

    // Certifications
    "certifications.name": "Certificación en Análisis Bioinformático y NGS",
    "certifications.issuer": "European Bioinformatics Institute (EMBL-EBI)",
    "certifications.date": "2020",

    // Skills
    "skills.technical":
      "PCR, Western Blot, Secuenciación NGS, Bioinformática (R, Python), Cultivo celular, CRISPR-Cas9, Espectrometría de masas, ImageJ, GraphPad Prism",
    "skills.soft":
      "Pensamiento crítico, Resolución de problemas complejos, Trabajo en equipo multidisciplinario, Comunicación científica, Gestión de proyectos",
    "skills.languages":
      "Español (Nativo), Inglés (Fluido - C1), Francés (Intermedio)",
  },
};
