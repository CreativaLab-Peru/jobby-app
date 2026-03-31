import type { SectionConfig } from "../../../../types";

export const designCreativityInternship: SectionConfig = {
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
      "Student of Design and Creativity with a passion for exploring innovative approaches to visual communication. Eager to gain practical experience and collaborate with industry professionals to enhance my design skills and contribute to impactful projects.",

    // Education
    "education.title":
        "Design and Creativity",
    "education.institution":
        "National University of San Antonio Abad del Cusco",
    "education.location":
        "Cusco, Peru",
    "education.year":
        "Expected December 2026",
    "education.honors":
        "Dean's List, Design Excellence Award 2023",

    // Projects
    "projects.title":
        "Brand Design for Food Company",
    "projects.description":
        "I created the visual identity of a new line of food products, including logo, color palette and typography. I conducted market research to ensure the design resonated with the target audience.",
    "projects.technologies":
        "Adobe Illustrator, Adobe Photoshop, Figma",
    "projects.duration":
        "5 months (Jun 2024 - Oct 2024)",

    // Skills
    "skills.technical":
        "Adobe Creative Suite (Photoshop, Illustrator, InDesign), Figma, Sketch, Prototyping, UX/UI Design, Branding, Typography, Visual Communication",
    "skills.soft":
        "Creativity, Critical thinking, Effective communication, Time management, Adaptability",
    "skills.languages":
        "Spanish (Native), English (Intermediate - B1), Quechua (Basic)",

    // Certifications
    "certifications.name":
        "Certification in Graphic Design",
    "certifications.issuer":
        "Coursera",
    "certifications.date":
        "November 2023",
  },
};
