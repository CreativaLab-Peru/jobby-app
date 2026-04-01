import type { SectionConfig } from "../../../../types";

export const technologyEngineeringInternship: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "certifications"],
  requiredFields: {
    "personal.summary": false,
    "education.level": true,
    "education.title": true,
    "education.institution": true,
    "education.location": true,
    "education.year": true,
  },
  examples: {
    "personal.summary":
      "Systems Engineering student with a strong passion for software development and a focus on web technologies. I have participated in various academic projects and hackathons, developing skills in programming languages such as JavaScript and Python, as well as frameworks like React and Node.js. I am eager to apply my knowledge in a real-world internship to gain practical experience and contribute to innovative technology solutions.",

    "education.title": "Bachelor's Degree in Systems and Computer Engineering",
    "education.institution": "National University of San Antonio Abad in Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2026",
    "education.honors": "Top Third, Participant in University Hackathon 2023",

    "projects.title": "Educational Web Platform with Gamification",
    "projects.description":
      "Developed an educational web platform that implements game mechanics to increase student engagement. I used React for the frontend, Node.js/Express for the backend, and PostgreSQL for data management. The project successfully increased student participation by 45% during pilot tests with 200 users.",
    "projects.technologies": "React, Node.js, Express, PostgreSQL, JWT, TailwindCSS, Git",
    "projects.duration": "4 months (July 2024 - October 2024)",

    "skills.technical":
      "JavaScript, TypeScript, Python, React, Node.js, Express, PostgreSQL, MongoDB, Git, Docker, REST APIs, HTML/CSS",
    "skills.soft":
      "Teamwork, Quick Learning, Problem Solving, Effective Communication, Analytical Thinking, Adaptability",
    "skills.languages": "Spanish (Native), English (Intermediate - B1), Quechua (BBasic)",

    "certifications.name": "Certification in Full-Stack Web Development",
    "certifications.issuer": "Platzi",
    "certifications.date": "November 2023",
  },
};