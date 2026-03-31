import type { SectionConfig } from "../../../../types"
export const financeProjectsExchangeProgram: SectionConfig = {
  sections: [
    "personal",
    "education",
    "skills",
    "projects",
    "volunteering",
  ],
  requiredFields: {
    // Summary opcional en todos los CVs
    "personal.summary": false,
    // Educación obligatoria para intercambios
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    // Personal
    "personal.summary":
        "Business Administration and Finance student with an interest in business management and market analysis. Experience in academic projects involving strategic planning and digital marketing, applying methodologies such as Canvas and OKRs. Able to contribute to process organization and the development of commercial strategies.",

    // Education
    "education.title":
        "Bachelor’s Degree in Finance",
    "education.institution":
        "National University of San Antonio Abad of Cusco",
    "education.location":
        "Cusco, Peru",
    "education.year":
        "Expected December 2025",
    "education.honors":
        "Weighted GPA: 16.2/20, Active participant in the Finance and Economics Club",

    // Skills
    "skills.technical":
        "Adobe Creative Suite (Photoshop, Illustrator, InDesign), Figma, Sketch, Prototyping, UX/UI Design, Branding, Typography, Visual Communication, User Research",
    "skills.soft":
        "Creativity, Critical thinking, Effective communication, Multicultural collaboration, Time management, Adaptability",
    "skills.languages":
        "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

    // projects
    "projects.title":
        "Digital Marketing Plan for a Textile SME",
    "projects.description":
        "Designed and implemented a digital marketing strategy that increased the online visibility of a textile company by 35%. Included social media management, targeted Meta Ads campaigns, and content optimization.",
    "projects.technologies":
        "Meta Ads, Canva, Google Analytics",
    "projects.duration":
        "5 months (Feb 2024 - Jun 2024)",

    // Volunteering
    "volunteering.organization":
        "Help the Child Foundation",
    "volunteering.location":
        "Cusco, Peru",
    "volunteering.position":
        "Volunteer",
    "volunteering.duration":
        "6 months (Jul 2023 - Dec 2023)",
    "volunteering.responsibilities":
        "Collaborated in organizing recreational and educational activities for children in vulnerable situations, supporting logistics and the creation of teaching materials.",
    }
};