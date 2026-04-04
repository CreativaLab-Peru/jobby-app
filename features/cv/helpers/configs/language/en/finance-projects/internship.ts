import type { SectionConfig } from "../../../../types";

export const financeProjectsInternship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "skills",
    "certifications",
  ],
  requiredFields: {
    // Summary opcional en todos los CVs
    "personal.summary": false,
    // Educación obligatoria para internships
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    // Personal
    "personal.summary":
      "Aspiring finance professional with a strong foundation in financial analysis and investment strategies, seeking to apply my skills in a dynamic internship environment.",

    // Education
    "education.title":
      "Bachelor’s Degree in Finance",
    "education.institution":
      "University of Finance",
    "education.location":
      "New York, NY",
    "education.year":
      "2023",
    "education.honors":
      "Magna Cum Laude",

    // Projects
    "projects.title":
      "Digital Marketing Plan for a Textile SME",
    "projects.description":
      "Designed and implemented a digital marketing strategy that increased the online visibility of a textile company by 35%. Included social media management, targeted Meta Ads campaigns, and content optimization.",
    "projects.technologies":
      "Meta Ads, Canva, Google Analytics",
    "projects.duration":
      "3 months (January 2023 - March 2023)",

    // Skills
    "skills.technical":
      "Financial Modeling, Data Analysis, Python, R, SQL, Tableau",
    "skills.soft":
      "Analytical Thinking, Problem Solving, Assertive Communication, Teamwork",
    "skills.languages":
      "English (Native), Spanish (Fluent)",
  },
};