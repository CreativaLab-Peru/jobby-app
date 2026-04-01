import type { SectionConfig } from "../../../../types";

export const financeProjectsScholarship: SectionConfig = {
  sections: [
    "personal",
    "projects",
    "achievements",
    "education",
  ],

  // Educación opcional para becas
  requiredFields: {
    // Summary opcional en todos los CVs
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
        "Business Administration student with a weighted GPA of 16.5/20 and a strong interest in artificial intelligence and machine learning. Seeking a scholarship to deepen my knowledge in applied research and contribute to the development of technological solutions with social and academic impact.",

    // Projects
    "projects.title":
        "Administrative Process Optimization",
    "projects.description":
        "Led an academic project to map internal processes of an SME, reducing response times by 20%. Proposed the adoption of digital tools for inventory and financial management.",
    "projects.technologies":
        "Advanced Excel, Google Sheets, Slack",
    "projects.duration":
        "6 months (March 2024 - August 2024)",

    // Achievements
    "achievements.title":
        "Winner of Academic Excellence Scholarship - PRONABEC",
    "achievements.description":
        "Selected among more than 5,000 applicants nationwide to receive a full university scholarship based on academic merit and student leadership. Maintained a GPA above 16/20 throughout all academic terms and actively participated in student technology organizations.",
    "achievements.date":
        "January 2023",

    // Education
    "education.title":
        "Bachelor’s Degree in Business Administration",
    "education.institution":
        "National University of San Antonio Abad of Cusco",
    "education.location":
        "Cusco, Peru",
    "education.year":
        "Expected July 2026",
    "education.honors":
        "Top Third (Top 10%), Highest GPA in Business Management course, Academic Excellence Scholarship 2023",
  },
};