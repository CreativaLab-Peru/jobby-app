import type { SectionConfig } from "../../types";
export const technologyEngineeringEmployment: SectionConfig = {
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
      "Ingeniero de software con más de 5 años de experiencia en desarrollo de aplicaciones web y móviles. Especializado en tecnologías de frontend y backend, con un enfoque en la creación de soluciones escalables y eficientes. Apasionado por la innovación y la mejora continua en el desarrollo de software.",

    // Education
    "education.title": "Máster en Ingeniería de Software",
    "education.institution": "Universidad Politécnica de Madrid",
    "education.location": "Madrid, España",
    "education.year": "Graduación en septiembre 2018",
    "education.honors":
      "Matrícula de Honor, Mejor Proyecto Fin de Máster en Arquitecturas Cloud",

    // Experience
    "experience.company": "TechCorp Solutions",
    "experience.location": "Madrid, España",
    "experience.position": "Ingeniero de Software Senior",
    "experience.duration": "Enero 2019 - Presente",
    "experience.responsibilities":
      "• Diseñé y desarrollé microservicios escalables utilizando Node.js y Docker, mejorando el rendimiento en un 40%.\n• Lideré un equipo de 5 desarrolladores en la implementación de una arquitectura basada en eventos con Kafka.\n• Implementé pipelines CI/CD con Jenkins y GitLab, reduciendo el tiempo de despliegue en un 60%.\n• Migré aplicaciones legacy a arquitecturas cloud (AWS), optimizando costos en €200,000 anuales.",

    // Achievements
    "achievements.title": "Premio a la Innovación Tecnológica",
    "achievements.description":
      "Reconocimiento por el desarrollo de una plataforma de analítica en tiempo real que procesa más de 1 millón de eventos por segundo, mejorando la toma de decisiones empresariales y generando un incremento del 25% en la eficiencia operativa.",
    "achievements.date": "Noviembre 2022",

    // Certifications
    "certifications.name": "AWS Certified Solutions Architect - Professional",
    "certifications.issuer": "Amazon Web Services",
    "certifications.date": "2021",

    // Skills
    "skills.technical":
      "JavaScript/TypeScript, React, Node.js, Python, Java, Docker, Kubernetes, AWS, Azure, PostgreSQL, MongoDB, Redis, Kafka, GraphQL, REST APIs, Git, CI/CD",
    "skills.soft":
      "Liderazgo técnico, Resolución de problemas complejos, Trabajo en equipo ágil, Comunicación efectiva, Mentoría de desarrolladores junior",
    "skills.languages":
      "Español (Nativo), Inglés (Fluido - C1), Alemán (Básico)",
  },
};
