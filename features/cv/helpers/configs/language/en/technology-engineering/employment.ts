import type { SectionConfig } from "../../../../types";

export const technologyEngineeringEmployment: SectionConfig = {
  sections: [
    "personal",
    "education",
    "experience",
    "achievements",
    "certifications",
    "skills",
  ],
  requiredFields: {
    "personal.summary": false,
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },
  examples: {
    "personal.summary":
      "Engineer with over 5 years of experience in software development, specializing in cloud computing and scalable architectures. Proven track record of leading successful projects and delivering innovative solutions that drive business growth.",

    "education.title": "MMaster in Software Engineering",
    "education.institution": "Complutense University of Madrid",
    "education.location": "Madrid, Spain",
    "education.year": "Graduation in September 2018",
    "education.honors":
      "Matrícula de Honor, Mejor Proyecto Fin de Máster en Arquitecturas Cloud",

    "experience.company": "TechCorp Solutions",
    "experience.location": "Madrid, Spain",
    "experience.position": "Senior Software Engineer",
    "experience.duration": "January 2019 - Present",
    "experience.responsibilities":
      "Designed and developed scalable microservices with Node.js and Docker, improving performance by 40%.\n• Led a team of 5 developers implementing event-driven architecture with Kafka.\n• Implemented CI/CD pipelines with Jenkins and GitLab, reducing deployment times by 60%.\n• Migrated legacy applications to cloud architectures (AWS), optimizing costs by €200,000 annually.",

    "achievements.title": "Development of Real-Time Analytics Platform",
    "achievements.description":
      "Led the development of a real-time analytics platform for e-commerce clients, achieving a 30% increase in data processing speed and enabling actionable insights that boosted sales by 15%. The project was recognized as a best practice case study in the company’s annual innovation awards.",
    "achievements.date": "November 2022",

    "certifications.name": "AWS Certified Solutions Architect - Professional",
    "certifications.issuer": "Amazon Web Services",
    "certifications.date": "2021",

    "skills.technical":
      "JavaScript/TypeScript, React, Node.js, Python, Java, Docker, Kubernetes, AWS, Azure, PostgreSQL, MongoDB, Redis, Kafka, GraphQL, REST APIs, Git, CI/CD",
    "skills.soft":
      "Technical Leadership, Complex Problem Solving, Agile Teamwork, Effective Communication, Mentoring Junior Developers",
    "skills.languages":
      "Spanish (Native), English (Fluent - C1), German (Basic)",
  },
};