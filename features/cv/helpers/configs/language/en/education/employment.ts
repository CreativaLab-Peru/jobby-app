import type { SectionConfig } from "../../../../types";
export const educationEmployment: SectionConfig = {
  sections: ["personal", "education", "achievements", "certifications", "skills"],
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
    // Personal
    "personal.summary":
      "Finance student with a strong interest in investment analysis and financial modeling. I have experience in financial research and a proven track record of academic excellence. I am eager to apply my analytical skills and passion for finance in a dynamic work environment to contribute to the success of a forward-thinking company.",

    // Education
    "education.title": "Licenciature in Finance",
    "education.institution": "National University of San Antonio Abad del Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2025",
    "education.honors": "Weighted Average: 16.2/20, Member of the Finance and Investments Club",

    //Achievements
    "achievements.title": "First Place in National University Investment Challenge",
    "achievements.description":
      "Awarded first place in the National University Investment Challenge for developing a comprehensive investment proposal that achieved the highest simulated returns among 20 participating teams. The project involved in-depth market analysis, financial modeling, and a well-structured presentation to a panel of industry experts.",
    "achievements.date": "October 2023",

    // Certifications
    "certifications.name": "Certification in Financial Analysis (CFA Level 1)",
    "certifications.issuer": "CFA Institute",
    "certifications.date": "2023",

    // Skills
    "skills.technical":
      "Advanced Excel, Power BI, financial modeling, ratio analysis, project evaluation (NPV, IRR), Bloomberg terminal and financial management software.",
    "skills.soft":
      "Analytical thinking, attention to detail, effective communication of financial results, work under pressure, negotiation skills and strategic decision-making.",
  },
};
