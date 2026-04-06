import type { SectionConfig } from "../../../../types";
export const financeProjectsEmployment: SectionConfig = {
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
    // Personal
    "personal.summary":
      "Finance professional with strong experience in financial analysis, investment portfolio management, and strategic financial planning. Specialized in evaluating investment opportunities, resource optimization, and value creation through data-driven financial decisions and market analysis.",

    // Education
    "education.title": "Bachelor’s Degree in Finance",
    "education.institution":
      "National University of San Antonio Abad of Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2025",
    "education.honors":
      "Weighted GPA: 16.2/20, Member of the Finance and Investment Club",

    // Experience
    "experience.title": "Financial Analyst",
    "experience.location": "Lima, Peru",
    "experience.year": "2022 - Present",
    "experience.description":
      "Comprehensive financial analysis, investment evaluation, portfolio management, and preparation of financial reports for strategic decision-making.",
    "experience.responsibilities":
      "Financial statement analysis, evaluation of investments and assets, financial modeling and forecasting, market and economic trend analysis, risk management, and preparation of executive reports.",

    //Achievements
    "achievements.title": "Best Student Investment Analysis Award",
    "achievements.description":
      "Developed a comprehensive investment portfolio analysis recognized at the university level for its rigorous quantitative approach and strategic recommendations.",
    "achievements.date": "October 2023",

    // Certifications
    "certifications.name": "Financial Analysis Certification (CFA Level 1)",
    "certifications.issuer": "CFA Institute",
    "certifications.date": "2023",

    // Skills
    "skills.technical":
      "Advanced Excel, Power BI, financial modeling, financial statement analysis, company valuation (DCF, multiples), financial ratio analysis, Bloomberg Terminal, financial ERP systems.",
    "skills.soft":
      "Analytical thinking, attention to detail, interpretation of financial data, communication of complex results, ability to work under pressure, data-driven decision-making, and strategic vision.",
  },
};