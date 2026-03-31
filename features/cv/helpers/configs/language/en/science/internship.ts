import type { SectionConfig } from "../../../../types";

export const scienceInternship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "skills",
    "certifications",
  ],
  requiredFields: {
    // Summary optional for all CVs
    "personal.summary": false,
    // Education required for internships
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },

  examples: {
    // Personal
    "personal.summary":
      "Science student with a strong background in scientific methodology and research experience. Passionate about scientific discovery and data analysis. Seeking a research internship to contribute to innovative projects and further develop skills in a professional scientific environment.",

    // Education
    "education.title": "Biology / Chemistry",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2026",
    "education.honors": "Top Third, Best Research Project 2023",

    // Projects
    "projects.title": "Biodiversity Analysis in Andean Ecosystems",
    "projects.description":
      "Conducted a field study on species diversity in the Andean region. Collected and analyzed samples, documented findings, and presented results at a university symposium. The project contributed to the regional conservation database.",
    "projects.technologies":
      "Microscopy, Statistical Analysis (R, SPSS), Excel, Sampling Techniques",
    "projects.duration": "6 months (May 2024 - Oct 2024)",

    // Skills
    "skills.technical":
      "Scientific Methodology, Data Analysis, Laboratory Techniques, Microscopy, Scientific Writing, R/Python, SPSS, Database Management, Safety Protocols",
    "skills.soft":
      "Analytical Thinking, Attention to Detail, Teamwork, Problem-Solving, Perseverance",
    "skills.languages":
      "Spanish (Native), English (Intermediate - B1), Quechua (Basic)",

    // Certifications
    "certifications.name":
      "Certification in Scientific Research Methods",
    "certifications.issuer": "Coursera",
    "certifications.date": "November 2023",
  },
};