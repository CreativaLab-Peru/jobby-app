import type { SectionConfig } from "../../../../types";

export const marketingStrategyScholarship: SectionConfig = {
  sections: ["personal", "projects", "achievements", "education"],

  // Education optional for scholarships
  requiredFields: {
    // Summary optional for all CVs
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
      "Marketing student with a GPA of 16.5/20 and strong interest in digital marketing and data analysis. Seeking a scholarship to deepen knowledge in communication strategies and contribute to the development of innovative campaigns with social and commercial impact.",

    // Projects
    "projects.title": "Digital Marketing Campaign for a Local Startup",
    "projects.description":
      "Led an academic digital marketing campaign project for a local SME, increasing social media engagement by 40% and generating a 25% increase in monthly sales. Implemented content strategies and metrics analysis.",
    "projects.technologies": "Google Analytics, Meta Business Suite, Canva, Mailchimp",
    "projects.duration": "6 months (Mar 2024 - Aug 2024)",

    // Achievements
    "achievements.title": "PRONABEC Academic Excellence Scholarship Winner",
    "achievements.description":
      "Selected among over 5,000 applicants nationwide to receive a full university scholarship based on academic merit and student leadership. Maintained GPA above 16/20 throughout all academic cycles and actively participated in student marketing projects.",
    "achievements.date": "Jan 2023",

    // Education
    "education.title": "Bachelor's Degree in Marketing",
    "education.institution": "National University of San Antonio Abad of Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected July 2026",
    "education.honors":
      "Top 10% (Highest Honors), Best Grade in Strategic Marketing Course, Academic Excellence Scholarship 2023",
  },
};