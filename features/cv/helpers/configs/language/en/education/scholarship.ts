import type { SectionConfig } from "../../../../types";

export const educationScholarship: SectionConfig = {
  sections: ["personal", "projects", "achievements", "education"],

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
      "Education is my vocation and a tool to transform lives. As an Education student specializing in Mathematics, I am passionate about creating meaningful learning experiences that inspire my students to reach their full potential. My commitment to pedagogical innovation and inclusive education drives me to develop methodologies that respond to the diverse needs of the modern classroom.",

    // Projects
    "projects.title":
      "Mathematics Reinforcement Program for Rural Students",
    "projects.description":
      "Designed and implemented a pilot tutoring program in mathematics for students in rural areas, using playful methodologies and teaching materials adapted to the local context. Achieved a 40% increase in academic performance during the school term.",
    "projects.technologies":
      "Active methodologies, Manipulative teaching materials, Formative assessment",
    "projects.duration": "6 months (March 2024 - August 2024)",

    // Achievements
    "achievements.title": "Winner of Vocación Maestro Scholarship - PRONABEC",
    "achievements.description":
      "Selected among more than 8,000 applicants nationwide to receive a full scholarship for education studies based on teaching vocation, academic merit, and social commitment. Maintained a GPA above 16/20 and participated in educational volunteer projects in vulnerable communities.",
    "achievements.date": "January 2023",

    // Education
    "education.title": "Education - Specialization in Mathematics",
    "education.institution":
      "National University of San Antonio Abad of Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected July 2026",
    "education.honors":
      "Top Third (Top 10%), Highest GPA in Mathematics Didactics, Vocación Maestro Scholarship 2023",
  },
};