import type { SectionConfig } from "../../../../types";

export const scienceScholarship: SectionConfig = {
  sections: ["personal", "projects", "achievements", "education"],

  // Education optional for scholarships
  requiredFields: {
    "personal.summary": false,
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },

  examples: {
    // Personal - Summary
    "personal.summary":
      "Scientific research and rigorous analysis define my passion for discovering new knowledge. As a Biology student specializing in microbiology and biotechnology, I aim to contribute to scientific advancement through innovative research and experimental methodologies. My critical thinking and commitment to academic excellence drive me to make meaningful contributions to the scientific field.",

    // Projects
    "projects.title": "Antimicrobial Resistance Analysis in Local Bacteria",
    "projects.description":
      "Conducted research on antibiotic resistance patterns in bacterial strains isolated from environmental samples. The project included bacterial culturing, antimicrobial susceptibility testing, and statistical analysis to identify emerging trends.",
    "projects.technologies": "PCR, Spectrophotometry, SPSS, Python (data analysis)",
    "projects.duration": "6 months (Mar 2023 - Aug 2023)",

    // Achievements
    "achievements.title": "Recipient of PRONABEC Academic Excellence Scholarship",
    "achievements.description":
      "Selected among over 5,000 applicants nationwide for a full university scholarship based on academic merit and research potential. Maintained a GPA above 16/20 throughout all semesters and actively participated in research projects within the Department of Biological Sciences.",
    "achievements.date": "Jan 2023",

    // Education
    "education.title": "Biology",
    "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected July 2026",
    "education.honors":
      "Top Third (Top 10%), Highest GPA in Advanced Microbiology, PRONABEC Academic Excellence Scholarship 2023",
  },
};