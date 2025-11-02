import type { SectionConfig } from "../../types";

export const financeProjectsExchangeProgram: SectionConfig = {
  sections: [
    "personal", 
    "education",
    "projects",
    "skills"
  ],
  examples: {
    // Personal
    "personal.summary":
        "Aspiring finance professional with a strong foundation in financial analysis and investment strategies, seeking to apply my skills in a dynamic internship environment.",
    
    // Education
    "education.title": "Bachelor of Finance",
    "education.institution": 
        "University of Finance",
    "education.location": "New York, NY",
    "education.year": "2023",
    "education.honors": 
        "Magna Cum Laude",

    // Projects
    "projects.title": 
        "Plan de Marketing Digital para Pyme textil",
    "projects.description":
        "Diseñé e implementé una estrategia de marketing digital que incrementó en 35% la visibilidad online de una empresa textil. Incluyó gestión de redes sociales, campañas segmentadas en Meta Ads y optimización de contenidos.",
    "projects.technologies":
        "Meta Ads, Canva, Google Analytics",
    "projects.duration": "3 meses (Ene 2023 - Mar 2023)",
    
    // Skills
    "skills.technical":
      "Financial Modeling, Data Analysis, Python, R, SQL, Tableau",
    "skills.soft":
      "Analytical Thinking, Problem Solving, Communication, Teamwork",
  },
};
