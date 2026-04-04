import type { SectionConfig } from "../../../../types";

export const managementBusinessInternship: SectionConfig = {
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
            "Business Administration student with a strong foundation in business analysis and project management. Experienced in teamwork and solving business problems. Seeking an internship to apply theoretical knowledge in a corporate environment and contribute to organizational growth.",

        // Education
        "education.title":
                "Bachelor’s Degree in Business Administration",
        "education.institution":
                "National University of San Marcos",
        "education.location":
                "Lima, Peru",
        "education.year":
                "Expected July 2026",
        "education.honors":
                "Top Third, Member of the Entrepreneurship Club",

        // Projects
        "projects.title":
                "Feasibility Analysis for a Delivery Startup",
        "projects.description":
                "Developed a comprehensive business plan including SWOT analysis, financial projections, and marketing strategies. Presented operational improvement proposals that reduced projected costs by 15%.",
        "projects.technologies":
                "Excel, Power BI, Google Analytics, Canva",
        "projects.duration":
                "4 months (Aug 2024 - Nov 2024)",

        // Skills
        "skills.technical":
                "Microsoft Office (Advanced Excel, PowerPoint, Word), Power BI, Financial analysis, Project management, Digital marketing, Google Workspace",
        "skills.soft":
                "Leadership, Teamwork, Problem-solving, Effective communication, Strategic thinking, Adaptability",
        "skills.languages":
                "Spanish (Native), English (Intermediate - B2), Portuguese (Basic)",

        // Certifications
        "certifications.name":
                "Project Management Fundamentals",
        "certifications.issuer":
                "Google Career Certificates",
        "certifications.date":
                "September 2024",
    },
};