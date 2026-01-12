import type { SectionConfig } from "../../types";
export const scienceExchangeProgram: SectionConfig = {
  sections: ["personal", "education", "skills", "projects", "volunteering"],
  examples: {
    // Personal
    "personal.summary":
      "Estudiante de Biología en intercambio académico en la Universidad de São Paulo, Brasil. Apasionado por la investigación científica y la biología molecular. Experiencia en proyectos de investigación colaborativos internacionales y metodología científica rigurosa.",

    // Education
    "education.title": "Licenciatura en Biología",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2025",
    "education.honors":
      "Promedio ponderado: 17.5/20, Miembro del Grupo de Investigación en Biodiversidad Andina",

    // Skills
    "skills.technical":
      "Técnicas de laboratorio, Análisis estadístico (R, SPSS), Microscopía, PCR y electroforesis, Cultivo celular, Diseño experimental, Bioinformática básica, Manejo de bases de datos científicas",
    "skills.soft":
      "Pensamiento analítico, Resolución de problemas, Comunicación científica, Trabajo en equipo, Gestión de tiempo en laboratorio, Atención al detalle",
    "skills.languages":
      "Español (Nativo), Inglés (Avanzado - C1), Portugués (Intermedio - B1)",

    // projects
    "projects.title":
      "Estudio de Biodiversidad Microbiana en Ecosistemas Altoandinos",
    "projects.description":
      "Desarrollé un proyecto de investigación sobre microorganismos extremófilos en lagunas de alta montaña, incluyendo muestreo en campo, análisis de laboratorio y caracterización molecular de especies.",
    "projects.technologies":
      "PCR, Secuenciación genética, Análisis filogenético, Software R, Microscopía óptica",
    "projects.duration": "8 meses (Ene 2024 - Ago 2024)",

    // Volunteering
    "volunteering.title":
      "Divulgador Científico en Programa de Educación Ambiental",
    "volunteering.organization": "Ciencia para Todos",
    "volunteering.location": "Cusco, Perú",
    "volunteering.position": "Voluntario en Divulgación Científica",
    "volunteering.duration": "3 meses (Jun 2023 - Ago 2023)",
    "volunteering.responsibilities":
      "Diseñé y ejecuté talleres de ciencias naturales para estudiantes de secundaria, incluyendo experimentos prácticos y charlas sobre conservación de la biodiversidad andina. Impacté a más de 200 estudiantes.",
  },
};
