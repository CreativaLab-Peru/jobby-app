import type { SectionConfig } from "../../../../types";

export const designCreativityScholarship: SectionConfig = {
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
        "Student of Design and Creativity with a passion for exploring innovative approaches to visual communication. Eager to gain international experience and collaborate with diverse teams to enhance my design skills and cultural understanding.",

    // Projects
    "projects.title":
        "Logo for Educational Technology Startup",
    "projects.description":
        "Design of a modern and versatile logo for a new startup focused on educational technology solutions. The process included competitive research and the creation of a brand manual.",
    "projects.technologies":
        "Adobe Illustrator, Figma",
    "projects.duration":
        "3 months (Sept 2023 - Nov 2023)",

    // Achievements
    "achievements.title":
        "Winner of National Design Scholarship",
    "achievements.description":
        "Selected among more than 5,000 applicants at the national level to receive a full scholarship for university studies based on academic merit and student leadership. I maintained a GPA above 16/20 throughout all academic cycles and actively participated in student organizations related to technology.",
    "achievements.date":
        "January 2023",

    // Education
    "education.title":
        "Design and Creativity",
    "education.institution":
        "National University of San Antonio Abad del Cusco",
    "education.location":
        "Cusco, Peru",
    "education.year":
        "Expected July 2026",
    "education.honors":
        "Top 10% (Dean's List), Best Average in Advanced Algorithms Course, Academic Excellence Scholarship 2023",
  },
};
