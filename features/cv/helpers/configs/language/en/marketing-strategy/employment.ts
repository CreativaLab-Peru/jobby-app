import type { SectionConfig } from "../../../../types";
export const marketingStrategyEmployment: SectionConfig = {
  sections: [
    "personal",
    "education",
    "experience",
    "achievements",
    "certifications",
    "skills",
  ],
  requiredFields: {
    // Summary opcional en todos los CVs
    "personal.summary": false,
    // Educación opcional para empleo
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },
  examples: {
    "personal.summary":
      "Marketing professional with over 5 years of experience developing and implementing digital strategies that increased brand visibility and sales by 30%. Expert in market analysis, campaign management, and SEO optimization. Passionate about emerging trends and innovation in marketing.",

    // Education
    "education.title": "Bachelor’s Degree in Marketing",
    "education.institution": "Advanced Marketing University",
    "education.location": "Madrid, Spain",
    "education.year": "Expected graduation June 2024",
    "education.honors":
      "GPA: 3.8/4.0, Member of the Digital Marketing Club",

    // Experience
    "experience.company": "Global Creative Agency S.L.",
    "experience.location": "Madrid, Spain",
    "experience.position": "Marketing Strategy Specialist",
    "experience.duration": "February 2020 - Present",
    "experience.responsibilities":
      "• Developed and implemented digital marketing strategies that increased website traffic by 40% and conversions by 25%.\n• Managed advertising campaigns on Google Ads and social media, optimizing ROI by 30%.\n• Conducted market and competitor analysis to identify growth opportunities and brand positioning.\n• Collaborated with creative teams to develop engaging and relevant content for diverse audiences.",

    // Achievements
    "achievements.title": "Best Digital Marketing Campaign Award",
    "achievements.description":
      "Led a team of 6 to design and execute a digital marketing campaign that increased sales by 50% during the campaign period. The campaign was recognized for its creativity and market impact.",
    "achievements.date": "December 2022",

    // Certifications
    "certifications.name": "Advanced Digital Marketing Certification",
    "certifications.issuer": "Digital Marketing Institute",
    "certifications.date": "2021",

    // Skills
    "skills.technical":
      "SEO, SEM, Google Analytics, Google Ads, Facebook Ads, Content Marketing, Email Marketing, CRM (HubSpot, Salesforce)",
    "skills.soft":
      "Creativity, Strategic thinking, Data analysis, Effective communication, Time management",
    "skills.languages": "Spanish (Native), English (Advanced), German (Basic)",
  },
};