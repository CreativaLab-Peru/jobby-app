import type { SectionConfig } from "../../../../types";
export const designCreativityExchangeProgram: SectionConfig = {
    sections: ["personal", "education", "skills", "projects", "volunteering"],
    requiredFields: {
        // Summary optional in all CVs
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
            "Student of Design and Creativity with a passion for exploring innovative approaches to visual communication. Eager to gain international experience and collaborate with diverse teams to enhance my design skills and cultural understanding.",

        // Education
        "education.title": "Design and Creativity",
        "education.institution": "National University of San Antonio Abad del Cusco",
        "education.location": "Cusco, Peru",
        "education.year": "Expected December 2025",
        "education.honors": "Dean's List (2023), Design Excellence Award (2024)",

        // Skills
        "skills.technical":
            "Adobe Creative Suite (Photoshop, Illustrator, InDesign), Figma, Sketch, Prototyping, UX/UI Design, Branding, Typography, Visual Communication, User Research",
        "skills.soft":
            "Creativity, Critical thinking, Effective communication, Multicultural collaboration, Time management, Adaptability",
        "skills.languages": "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

        // Projects
        "projects.title": "Academic Tutoring Web Platform",
        "projects.description":
            "Implemented a platform that connects students with specialized tutors in various subjects, incorporating a payment system and real-time notifications.",
        "projects.technologies": "React, Node.js, Express, MongoDB, Socket.io",
        "projects.duration": "6 months (Feb 2024 - Jul 2024)",

        // Volunteering
        "volunteering.title": "Programming Mentor at University Hackathon",
        "volunteering.organization": "Creatives of the Future",
        "volunteering.location": "Cusco, Peru",
        "volunteering.position": "Volunteer Instructor",
        "volunteering.duration": "48h + 1 month follow-up (Sept 2023)",
        "volunteering.responsibilities":
            "Guided a team of 4 students in developing a prototype urban mobility app. The team achieved second place among 20 participating groups.",
    },
};
