import type { SectionConfig } from "../../../../types";
export const managementBusinessEmployment: SectionConfig = {
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
            "Business professional with over 5 years of experience in project management and team leadership. Strong skills in financial analysis, strategic planning, and process optimization. Committed to sustainable development and business innovation.",

        // Education
        "education.title":
                "Bachelor’s Degree in Business Administration",
        "education.institution":
                "National University of San Antonio Abad of Cusco",
        "education.location":
                "Cusco, Peru",
        "education.year":
                "Expected graduation December 2025",
        "education.honors":
                "GPA: 3.3/4.0, Member of the Entrepreneurship Club",

        // Experience
        "experience.company":
                "TechSolutions Mexico S.A. de C.V.",
        "experience.location":
                "Lima, Peru",
        "experience.position":
                "Project Management Analyst",
        "experience.duration":
                "January 2023 - Present",
        "experience.responsibilities":
                "• Led the implementation of a new project management system that increased team efficiency by 25%.\n• Coordinated cross-functional teams to ensure timely delivery of key projects.\n• Conducted detailed financial analysis to evaluate the feasibility of new projects and optimize resources.",

        // Achievements
        "achievements.title":
                "Best Business Innovation Project Award",
        "achievements.description":
                "Led a team of 5 members to develop an innovative business plan recognized at the national level for its sustainable approach and economic viability.",
        "achievements.date":
                "November 2023",

        // Certifications
        "certifications.name":
                "Project Management Professional (PMP) Certification",
        "certifications.issuer":
                "Project Management Institute",
        "certifications.date":
                "2022",

        // Skills
        "skills.technical":
                "Project management, Financial analysis, Strategic planning, Microsoft Office (Excel, PowerPoint, Word), ERP systems (SAP, Oracle)",
        "skills.soft":
                "Leadership, Effective communication, Problem solving, Teamwork, Critical thinking",
    },
};