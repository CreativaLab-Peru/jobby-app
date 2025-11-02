import type { SectionConfig } from "../../types"

export const technologyEngineeringInternship: SectionConfig = {
  sections: ["personal", "projects", "experience", "education", "achievements", "skills"],
  
  examples: {
    // Personal - Summary
    "personal.summary": 
      "Estudiante de 5to ciclo de Ingeniería de Sistemas con sólidos conocimientos en desarrollo web full-stack y bases de datos. Busco prácticas profesionales para aplicar mis habilidades en programación y contribuir al desarrollo de soluciones tecnológicas innovadoras mientras continúo aprendiendo de profesionales experimentados.",
    
    // Projects
    "projects.title": "Plataforma de E-learning con Gamificación",
    "projects.description":
      "Desarrollé una plataforma web educativa que implementa mecánicas de juego para aumentar el engagement estudiantil. Utilicé React para el frontend, Node.js/Express para el backend, y PostgreSQL para gestión de datos. El proyecto logró incrementar la participación estudiantil en un 45% durante las pruebas piloto con 200 usuarios.",
    "projects.technologies": "React, Node.js, Express, PostgreSQL, JWT, TailwindCSS, Git",
    "projects.duration": "4 meses (Julio 2024 - Octubre 2024)",
    
    // Experience
    "experience.company": "StartupTech Lab",
    "experience.location": "Lima, Perú",
    "experience.position": "Desarrollador Web Junior (Medio tiempo)",
    "experience.duration": "Enero 2024 - Presente",
    "experience.responsibilities":
      "• Desarrollé y mantuve 10+ componentes reutilizables en React, mejorando la velocidad de desarrollo del equipo.\n• Colaboré en la implementación de APIs RESTful con Node.js para integración con servicios externos.\n• Participé en code reviews y sprints ágiles, adoptando mejores prácticas de desarrollo colaborativo.\n• Optimicé queries SQL reduciendo tiempos de respuesta en un 30%.",
    
    // Education
    "education.title": "Ingeniería de Sistemas e Informática",
    "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2026",
    "education.honors": "Tercio Superior, Participante de Hackathon Universitario 2023",
    
    // Achievements
    "achievements.title": "2do Lugar en Hackathon Nacional de Innovación Digital",
    "achievements.description":
      "Lideré un equipo de 3 desarrolladores para crear una aplicación móvil de rastreo de carbono personal usando React Native y Firebase. Competimos contra 80 equipos de universidades nacionales y fuimos reconocidos por la viabilidad técnica y el impacto social de nuestra solución.",
    "achievements.date": "Septiembre 2024",
    
    // Skills
    "skills.technical": "JavaScript, TypeScript, Python, React, Node.js, Express, PostgreSQL, MongoDB, Git, Docker, REST APIs, HTML/CSS",
    "skills.soft": "Trabajo en equipo, Aprendizaje rápido, Resolución de problemas, Comunicación efectiva, Pensamiento analítico, Adaptabilidad",
    "skills.languages": "Español (Nativo), Inglés (Intermedio - B1), Quechua (Básico)",
  }
}
