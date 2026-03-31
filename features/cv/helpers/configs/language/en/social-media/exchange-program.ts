import type { SectionConfig } from "../../../../types";

export const socialMediaExchangeProgram: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "volunteering"],
  requiredFields: {
    "personal.summary": false,
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    // Personal
    "personal.summary":
      "Passionate student of social media and international digital communication. Experienced in creating multicultural content, managing online communities, and collaborating with diverse teams. Seeking exchange opportunities to broaden my global perspective and contribute creativity to international projects.",

    // Education
    "education.title": "Bachelor’s in Digital Communication",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2025",
    "education.honors":
      "Weighted GPA: 16.2/20, Active member of the Digital Media Club",

    // Skills
    "skills.technical":
      "Instagram, TikTok, Facebook, X/Twitter, LinkedIn, Canva, CapCut, Adobe Premiere, Hootsuite, Community Management",
    "skills.soft":
      "Creativity, Intercultural Communication, Teamwork, Cultural Adaptability, Curiosity, Digital Empathy",
    "skills.languages":
      "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

    // Projects
    "projects.title": "Multicultural Social Media Content Project",
    "projects.description":
      "Created a series of content about Peruvian culture for international audiences, reaching 50K views and collaborating with content creators from 5 different countries. Focused on traditions, cuisine, and local perspectives.",
    "projects.technologies":
      "Instagram, TikTok, Canva, CapCut, Linktree",
    "projects.duration": "4 months (Mar 2024 - Jun 2024)",

    // Volunteering
    "volunteering.organization": "Digital Cultural Exchange Project",
    "volunteering.location": "Online / Cusco, Peru",
    "volunteering.position": "Digital Ambassador",
    "volunteering.responsibilities":
      "Facilitated intercultural conversations between students from Latin America and Europe through social media, creating content that promoted mutual understanding and collaboration between communities.",
    "volunteering.duration": "8 months (Jan 2024 - Aug 2024)",
  },
};