import type { SectionConfig } from "../../../../types";

export const socialMediaInternship: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "certifications", "volunteering"],
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
      "Passionate student of social media and digital marketing, experienced in content creation and community management, seeking an internship to enhance skills in social media strategy and digital analytics.",

    // Education
    "education.title": "Digital Communication / Marketing",
    "education.institution": "National University of San Antonio Abad of Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "2023",
    "education.honors": "Honorable Mention in Digital Content Strategy Project",

    // Projects
    "projects.title": "Social Media Management for Local Brand",
    "projects.description":
      "Planned and executed Instagram and TikTok content strategy for a small business, creating editorial calendars, designing posts and reels, achieving a 200% increase in followers and 150% growth in engagement over 3 months.",
    "projects.technologies": "Instagram, TikTok, Canva, Meta Business Suite, CapCut",
    "projects.duration": "3 months (Jan 2023 - Mar 2023)",

    // Skills
    "skills.technical":
      "Community Management, Content Creation, Meta Ads, Canva, CapCut, Social Media Analytics, Copywriting",
    "skills.soft":
      "Creativity, Communication, Adaptability, Teamwork, Time Management",
    "skills.languages": "Spanish (Native), English (Intermediate)",

    // Certifications
    "certifications.name": "Certification in Social Media Marketing",
    "certifications.issuer": "Coursera / HubSpot Academy",
    "certifications.date": "2022",

    // Volunteering
    "volunteering.organization": "Community Collective for Social Change",
    "volunteering.location": "Cusco, Peru",
    "volunteering.position": "Volunteer Community Manager",
    "volunteering.duration": "Jun 2022 - Dec 2022",
    "volunteering.responsibilities":
      "Managed the collective’s social media channels, creating educational content on social issues, scheduling posts, and engaging with the community, growing followers from 500 to 2,000.",
  },
};