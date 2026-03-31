import type { SectionConfig } from "../../../../types";

export const managementBusinessScholarship: SectionConfig = {
    sections: [
        "personal",
        "projects",
        "achievements",
        "education",
    ],

    // Educación opcional para becas
    requiredFields: {
        // Summary opcional en todos los CVs
        "personal.summary": false,
        "education.level": false,
        "education.title": false,
        "education.institution": false,
        "education.location": false,
        "education.year": false,
    },

    examples: {
        // Personal - Summary
        "personal.summary":
                "Business Administration student with strong training in strategic management and financial analysis. Passionate about entrepreneurship and business innovation, seeking to apply knowledge in planning, leadership, and decision-making to contribute to organizational growth. Recognized for analytical skills, teamwork, and ability to identify opportunities for process improvement.",

        // Projects
        "projects.title":
                "Business Plan for a Social Enterprise",
        "projects.description":
                "Developed a comprehensive business plan for a social enterprise focused on fair trade of artisanal products. Includes market analysis, financial projections, marketing strategy, and sustainability model.",
        "projects.technologies":
                "Excel, Power BI, Business Model Canvas",
        "projects.duration":
                "4 months (Aug 2023 - Dec 2023)",

        // Achievements
        "achievements.title":
                "PRONABEC Academic Excellence Scholarship Winner",
        "achievements.description":
                "Selected among more than 5,000 national applicants to receive a full university scholarship in Business Management based on academic merit and leadership potential. Maintained a GPA above 16/20 and led student projects in corporate social responsibility.",
        "achievements.date":
                "January 2023",

        // Education
        "education.title":
                "Bachelor’s Degree in Business Administration",
        "education.institution":
                "National University of San Antonio Abad of Cusco",
        "education.location":
                "Cusco, Peru",
        "education.year":
                "Expected July 2026",
        "education.honors":
                "Top Third (Top 10%), Best Strategic Management Project, Academic Excellence Scholarship 2023",
    },
};