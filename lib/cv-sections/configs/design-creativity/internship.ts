import type { SectionConfig } from "../../types";

export const designCreativityInternship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "skills",
    "certifications",
  ],

  examples: {
    // Personal
    "personal.summary":
      "Estudiante de 5to ciclo de Ingeniería de Sistemas con sólidos conocimientos en desarrollo web full-stack y bases de datos. Busco prácticas profesionales para aplicar mis habilidades en programación y contribuir al desarrollo de soluciones tecnológicas innovadoras mientras continúo aprendiendo de profesionales experimentados.",

    // Education
    "education.title": 
        "Ingeniería de Sistemas e Informática",
    "education.institution":
        "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": 
        "Cusco, Perú",
    "education.year": 
        "Esperado Diciembre 2026",
    "education.honors":
        "Tercio Superior, Participante de Hackathon Universitario 2023",

    // Projects
    "projects.title": 
        "Sistema de Gestión de Inventario con IA",
    "projects.description":
        "Desarrollé una aplicación web que utiliza machine learning para predecir la demanda de productos, reduciendo el desperdicio en 25%. Implementé algoritmos de clasificación y una interfaz intuitiva para usuarios no técnicos.",
    "projects.technologies":
        "Python, Flask, TensorFlow, MySQL",
    "projects.duration": 
        "5 meses (Jun 2024 - Oct 2024)",

    // Skills
    "skills.technical":
        "JavaScript, TypeScript, Python, React, Node.js, Express, PostgreSQL, MongoDB, Git, Docker, REST APIs, HTML/CSS",
    "skills.soft":
        "Trabajo en equipo, Aprendizaje rápido, Resolución de problemas, Comunicación efectiva, Pensamiento analítico, Adaptabilidad",
    "skills.languages":
        "Español (Nativo), Inglés (Intermedio - B1), Quechua (Básico)",

    // Certifications
    "certifications.title": 
        "Certificación en Desarrollo Web Full-Stack",
    "certifications.issuer": 
        "Platzi",
    "certifications.date": 
        "Noviembre 2023", 
  },
};
