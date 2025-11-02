import type { SectionConfig } from "../../types"

export const technologyEngineeringFullTime: SectionConfig = {
  sections: ["personal", "experience", "education", "certifications", "skills"],
  
  examples: {
    // Personal - Summary
    "personal.summary": 
      "Ingeniero de Sistemas con 3+ años de experiencia en desarrollo full-stack y arquitectura de soluciones cloud. Especializado en JavaScript/TypeScript, React, Node.js y AWS. Busco posiciones desafiantes donde pueda aportar mi experiencia en desarrollo ágil, liderazgo técnico y construcción de productos escalables.",
    
    // Experience
    "experience.company": "TechCorp Solutions S.A.C.",
    "experience.location": "Lima, Perú",
    "experience.position": "Ingeniero de Software Senior",
    "experience.duration": "Marzo 2022 - Presente",
    "experience.responsibilities":
      "• Lideré el desarrollo de microservicios escalables con Node.js y Docker, procesando 500K+ transacciones diarias.\n• Reduje costos de infraestructura en 35% mediante optimización de arquitectura AWS (EC2, Lambda, RDS, S3).\n• Mentoreé a 4 desarrolladores junior, estableciendo estándares de código y mejores prácticas.\n• Implementé CI/CD pipelines con GitHub Actions, reduciendo tiempo de deployment de 2 horas a 15 minutos.\n• Colaboré con Product Managers en definición de roadmap técnico y priorización de features.",
    
    // Education
    "education.title": "Ingeniería de Sistemas e Informática",
    "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Diciembre 2021",
    "education.honors": "Bachiller con Tercio Superior",
    
    // Certifications
    "certifications.name": "AWS Certified Solutions Architect - Associate",
    "certifications.issuer": "Amazon Web Services",
    "certifications.date": "Marzo 2023",
    
    // Skills
    "skills.technical": "JavaScript, TypeScript, Python, React, Next.js, Node.js, Express, NestJS, PostgreSQL, MongoDB, Redis, AWS, Docker, Kubernetes, GraphQL, REST APIs, Microservices, CI/CD, Git, Jest, TDD",
    "skills.soft": "Liderazgo técnico, Mentoría, Resolución de problemas complejos, Comunicación técnica, Gestión de stakeholders, Trabajo bajo presión, Mejora continua",
    "skills.languages": "Español (Nativo), Inglés (Avanzado - Certificación TOEFL 95/120)",
  }
}
