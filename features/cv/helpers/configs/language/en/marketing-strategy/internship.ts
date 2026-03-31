import type { SectionConfig } from "../../../../types";

export const marketingStrategyInternship: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "volunteering"],
  requiredFields: {
    // Summary optional for all CVs
    "personal.summary": false,
    // Education required for internships
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    // Personal
    "personal.summary":
      "Enthusiastic marketing professional with strong background in brand strategies, market research, and advertising campaigns, seeking to develop skills in a challenging internship environment.",

    // Education
    "education.title": "Marketing",
    "education.institution": "Universidad de Negocios",
    "education.location": "Mexico City, CDMX, Mexico",
    "education.year": "2023",
    "education.honors":
      "Academic Excellence Recognition with GPA of 9.2/10.0",

    // Projects
    "projects.title": "Product Launch Campaign",
    "projects.description":
      "Developed a comprehensive marketing campaign for the launch of a local product, including market analysis, positioning strategy, and execution on digital platforms, generating 500+ leads in the first month.",
    "projects.technologies": "Mailchimp, Hootsuite, Canva, HubSpot",
    "projects.duration": "2 months (Feb 2023 - Mar 2023)",

    // Skills
    "skills.technical":
      "Email Marketing, Content Marketing, CRM, Data Analysis, Basic Graphic Design",
    "skills.soft":
      "Creativity, Strategic Analysis, Collaboration, Time Management",
    "skills.languages": "Spanish (Native), English (Intermediate)",

    // Volunteering
    "volunteering.organization": "ONG Emprende+",
    "volunteering.location": "Mexico City, CDMX, Mexico",
    "volunteering.position": "Marketing Assistant",
    "volunteering.duration": "Jan 2023 - Jun 2023",
    "volunteering.responsibilities":
      "Assisted in creating promotional materials and managing social media campaigns to promote entrepreneurship programs, achieving a 30% increase in engagement.",
  },
};