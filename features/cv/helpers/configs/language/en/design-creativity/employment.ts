import type { SectionConfig } from "../../../../types"
export const designCreativityEmployment: SectionConfig = {
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
        "Graphic Designer with experience creating innovative visual solutions for various industries. Skilled at teamwork and adapting to dynamic environments, with a focus on user-centered design and applied creativity.",

    // Education
    "education.title":
        "Design and Creativity",
    "education.institution":
        "National University of San Antonio Abad del Cusco",
    "education.location":
        "Cusco, Peru",
    "education.year":
        "Expected December 2026",
    "education.honors":
        "Top 10% of the class, Dean's List, Scholarship for Academic Excellence",

    // Experience
    "experience.title":
        "Junior Graphic Designer at Creative Agency XYZ",
    "experience.location":
        "Lima, Peru",
    "experience.year":
        "2022 - Present",
    "experience.description":
        "As a Junior Graphic Designer at Creative Agency XYZ, I have contributed to the development of visual content for a variety of clients, including startups and established companies. My responsibilities include creating graphics for social media, designing logos and branding materials, and participating in brainstorming sessions for creative campaigns. I have collaborated closely with senior designers and marketing teams to ensure that our designs effectively communicate the client's message and meet their needs.",
    "experience.responsibilities":
        "Developed visual content for social media platforms, increasing engagement by 30%.\n• Designed logos and branding materials for 10+ clients, contributing to their brand identity.\n• Participated in brainstorming sessions, providing creative input that led to successful campaigns.\n• Collaborated with senior designers and marketing teams to ensure design quality and client satisfaction.",

    // Achievements
    "achievements.title":
        "Winner of the National Design Competition 2023",
    "achievements.description":
        "Received first place in the National Design Competition 2023 for my innovative poster design promoting environmental awareness. The competition included over 500 participants from across the country, and my design was recognized for its creativity, visual impact, and effective communication of the message.",
    "achievements.date":
        "November 2023",

    // Certifications
    "certifications.name":
        "Certification in UX/UI Design",
    "certifications.issuer":
        "Coursera",
    "certifications.date":
        "2023",

    // Skills
    "skills.technical":
        "Adobe Creative Suite (Photoshop, Illustrator, InDesign), Sketch, Figma, Prototyping, Typography, Color Theory, Branding, Visual Communication",
    "skills.soft":
        "Creativity, Teamwork, Adaptability, Communication, Problem-Solving, Time Management",
    }
};
