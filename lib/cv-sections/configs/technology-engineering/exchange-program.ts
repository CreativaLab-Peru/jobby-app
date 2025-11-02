import type { SectionConfig } from "../../types";

export const technologyEngineeringExchangeProgram: SectionConfig = {
  sections: [
    "personal",
    "projects",
    "experience",
    "education",
    "achievements",
    "skills",
  ],

  examples: {
    // Personal - Summary
    "personal.summary":
      "Estudiante de Ingeniería de Sistemas con enfoque en desarrollo de software y análisis de datos. Participación en hackathons y proyectos académicos de programación web y bases de datos. Habilidades en resolución de problemas tecnológicos y aplicación de lenguajes como Python y SQL para optimizar procesos.",

    // Projects
    "projects.title": "Aplicación Móvil de Turismo Inteligente con RA",
    "projects.description":
      "Lideré el desarrollo de una aplicación móvil multiplataforma que integra realidad aumentada para guiar turistas en sitios arqueológicos de Cusco. Utilicé React Native, ARKit/ARCore, y servicios de Google Cloud. La app fue reconocida por el Ministerio de Cultura y descargada por 3,000+ usuarios en su fase beta.",
    "projects.technologies":
      "React Native, ARKit, ARCore, Firebase, Google Cloud Platform, Node.js, MongoDB",
    "projects.duration": "8 meses (Enero 2024 - Agosto 2024)",

    // Experience
    "experience.company": "Innovation Hub Cusco",
    "experience.location": "Cusco, Perú",
    "experience.position": "Desarrollador Full Stack (Proyecto)",
    "experience.duration": "Junio 2023 - Diciembre 2023",
    "experience.responsibilities":
      "• Desarrollé soluciones web para emprendimientos locales usando MERN stack (MongoDB, Express, React, Node.js).\n• Colaboré con equipos multidisciplinarios incluyendo diseñadores UX y especialistas en marketing digital.\n• Implementé metodologías ágiles (Scrum) para gestión de proyectos con entregas bi-semanales.\n• Facilité talleres de capacitación en tecnologías web para emprendedores.",

    // Education
    "education.title": "Ingeniería de Sistemas e Informática",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2026",
    "education.honors":
      "Promedio ponderado: 15.8/20, Participante activo del Club de Programación Competitiva",

    // Achievements
    "achievements.title":
      "Embajador Estudiantil de Google Developer Student Clubs",
    "achievements.description":
      "Seleccionado como líder del capítulo universitario de Google Developer Student Clubs, organizando eventos técnicos, workshops sobre tecnologías de Google Cloud, y fomentando la comunidad de desarrolladores estudiantiles. Lideré equipo de 15 voluntarios y realizamos 20+ eventos con 800+ participantes totales.",
    "achievements.date": "Agosto 2023 - Presente",

    // Skills
    "skills.technical":
      "JavaScript, TypeScript, Python, React, React Native, Node.js, Express, MongoDB, PostgreSQL, AWS, Google Cloud, Docker, Git, CI/CD",
    "skills.soft":
      "Adaptabilidad cultural, Liderazgo comunitario, Colaboración internacional, Comunicación intercultural, Gestión de proyectos, Trabajo remoto",
    "skills.languages":
      "Español (Nativo), Inglés (Avanzado - C1), Portugués (Intermedio - B1)",
  },
};
