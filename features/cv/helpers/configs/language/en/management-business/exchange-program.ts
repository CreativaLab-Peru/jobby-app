import type { SectionConfig } from "../../../../types"
export const managementBusinessExchangeProgram: SectionConfig = {
    sections: [
        "personal",
        "education",
        "projects",
        "skills",
        "volunteering",
    ],
    requiredFields: {
        // Summary opcional en todos los CVs
        "personal.summary": false,
        // Educación obligatoria para intercambios
        "education.level": true,
        "education.title": true,
        "education.institution": true,
        "education.location": true,
        "education.year": true,
    },
    examples: {
        // Personal
        "personal.summary":
                "Business Administration student participating in an academic exchange program at the University of Buenos Aires, Argentina. Focused on international business and corporate strategy. Experience in market analysis and strong adaptability to multicultural environments.",

        // Education
        "education.title":
                "Bachelor’s Degree in Business Administration",
        "education.institution":
                "National University of San Antonio Abad of Cusco",
        "education.location":
                "Cusco, Peru",
        "education.year":
                "Expected December 2025",
        "education.honors":
                "Weighted GPA: 15.8/20, Member of the Student Entrepreneurship Club",

        // Skills
        "skills.technical":
                "Financial analysis, Advanced Excel, Power BI, Project management, Market research, Strategic planning, Budgeting, Business intelligence",
        "skills.soft":
                "Leadership, Decision-making, Negotiation, Multicultural teamwork, Problem solving, Cultural adaptability",
        "skills.languages":
                "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

        // projects
        "projects.title":
                "Business Plan for a Sustainable Tourism Startup",
        "projects.description":
                "Developed a comprehensive business plan for a startup focused on sustainable tourism in Cusco, including market analysis, financial modeling, and digital marketing strategy.",
        "projects.technologies":
                "Excel, Power BI, Business Model Canvas, Google Analytics",
        "projects.duration":
                "4 months (Mar 2024 - Jun 2024)",

        // Volunteering
        "volunteering.title":
                "Volunteer Consultant for Local Businesses",
        "volunteering.organization":
                "Cusco Entrepreneurs Network",
        "volunteering.location":
                "Cusco, Peru",
        "volunteering.position":
                "Business Advisor",
        "volunteering.duration":
                "3 months (Jul 2023 - Sep 2023)",
        "volunteering.responsibilities":
                "Advised 5 small local businesses on financial management and growth strategies, contributing to an average 25% increase in their monthly sales.",
        }
};