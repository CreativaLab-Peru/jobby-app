import type { SectionConfig } from "../../../../types";

export const marketingStrategyExchangeProgram: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "volunteering"],
  requiredFields: {
    // Summary optional for all CVs
    "personal.summary": false,
    // Education required for exchange programs
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    // Personal
    "personal.summary":
      "Marketing student focused on digital strategy and consumer analysis. Experienced in developing advertising campaigns, managing social media, and branding. Skilled at designing effective communication strategies and optimizing brand positioning in digital environments.",

    // Education
    "education.title": "Bachelor’s Degree in Marketing",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2025",
    "education.honors":
      "GPA: 16.2/20, Active member of the Digital Marketing Club",

    // Skills
    "skills.technical":
      "Google Ads, Meta Ads, Google Analytics, SEO/SEM, Email Marketing, CRM, Canva, Adobe Photoshop, Hootsuite, Marketing Automation",
    "skills.soft":
      "Creativity, Strategic thinking, Effective communication, Multicultural collaboration, Data analysis, Adaptability",
    "skills.languages":
      "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

    // Projects
    "projects.title": "Digital Marketing Campaign for Local Brand",
    "projects.description":
      "Developed and executed a comprehensive digital marketing campaign that increased engagement by 45% and generated 30% more conversions for a local brand. Included content strategy, social media management, and targeted digital advertising.",
    "projects.technologies":
      "Meta Ads, Google Ads, Canva, Google Analytics, Mailchimp",
    "projects.duration": "5 months (Feb 2024 - Jun 2024)",

    // Volunteering
    "volunteering.organization": "Fundación Ayuda al Niño",
    "volunteering.location": "Cusco, Peru",
    "volunteering.position": "Communications Volunteer",
    "volunteering.responsibilities":
      "Assisted in creating content for social media and promotional materials for fundraising campaigns, helping to increase the organization’s visibility.",
    "volunteering.duration": "6 months (Jul 2023 - Dec 2023)",
  },
};