import type { SectionConfig } from "../../types";

export const technologyEngineeringInternship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "skills",
    "certifications",
  ],

  examples: {
    // Personal - Summary
    "personal.summary":
      "Estudiante de 5to ciclo de Ingeniería de Sistemas con sólidos conocimientos en desarrollo web full-stack y bases de datos. Busco prácticas profesionales para aplicar mis habilidades en programación y contribuir al desarrollo de soluciones tecnológicas innovadoras mientras continúo aprendiendo de profesionales experimentados.",

    // Education
    "education.title": "Ingeniería de Sistemas e Informática",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2026",
    "education.honors":
      "Tercio Superior, Participante de Hackathon Universitario 2023",

    // Projects
    "projects.title": 
        "Plataforma de E-learning con Gamificación",
    "projects.description":
        "Desarrollé una plataforma web educativa que implementa mecánicas de juego para aumentar el engagement estudiantil. Utilicé React para el frontend, Node.js/Express para el backend, y PostgreSQL para gestión de datos. El proyecto logró incrementar la participación estudiantil en un 45% durante las pruebas piloto con 200 usuarios.",
    "projects.technologies":
        "React, Node.js, Express, PostgreSQL, JWT, TailwindCSS, Git",
    "projects.duration": 
        "4 meses (Julio 2024 - Octubre 2024)",

    // Skills
    "skills.technical":
        "JavaScript, TypeScript, Python, React, Node.js, Express, PostgreSQL, MongoDB, Git, Docker, REST APIs, HTML/CSS",
    "skills.soft":
        "Trabajo en equipo, Aprendizaje rápido, Resolución de problemas, Comunicación efectiva, Pensamiento analítico, Adaptabilidad",
    "skills.languages":
        "Español (Nativo), Inglés (Intermedio - B1), Quechua (Básico)",

    // Certifications
    "certifications.name": 
        "Certificación en Desarrollo Web Full-Stack",
    "certifications.issuer": 
        "Platzi",
    "certifications.date": 
        "Noviembre 2023", 
  },
};
