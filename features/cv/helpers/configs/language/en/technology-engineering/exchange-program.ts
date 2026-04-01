import type { SectionConfig } from "../../../../types";

export const technologyEngineeringExchangeProgram: SectionConfig = {
  sections: ["personal", "education", "skills", "volunteering"],
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
      "Student of Systems and Computer Engineering with a strong passion for software development and international collaboration. Currently participating in an exchange program at the University of Technology in Sydney, Australia, where I am expanding my knowledge in software engineering and gaining valuable cross-cultural experience. Eager to apply my skills in real-world projects and contribute to innovative solutions in the technology industry.",

    "education.title": "Bachelor's Degree in Systems and Computer Engineering",
    "education.institution": "National University of San Antonio Abad in Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2026",
    "education.honors":
      "Weighted Average: 15.8/20, Active Member of the Competitive Programming Club",

    "skills.technical":
      "JavaScript, TypeScript, Python, React, React Native, Node.js, Express, MongoDB, PostgreSQL, AWS, Google Cloud, Docker, Git, CI/CD",
    "skills.soft":
      "Cultural Adaptability, Community Leadership, International Collaboration, Intercultural Communication, Project Management, Remote Work",
    "skills.languages":
      "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

    "volunteering.organization": "Code for Good",
    "volunteering.location": "Cusco, Peru",
    "volunteering.position": "Volunteer Software Developer",
    "volunteering.duration": "March 2023 - December 2023",
    "volunteering.responsibilities":
      "I conducted weekly basic programming workshops (HTML, CSS, JavaScript) for children aged 10-14.\n• I developed interactive educational materials to facilitate learning, I fostered an inclusive and motivating environment for the students.\n• I collaborated with other volunteers to organize community technology events.",
  },
};