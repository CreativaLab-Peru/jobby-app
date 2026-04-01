import type { SectionConfig } from "../../../../types";

export const educationInternship: SectionConfig = {
  sections: ["personal", "education", "projects", "skills", "certifications"],

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
      "Education student with experience in developing pedagogical projects and skills in innovative teaching methodologies. Passionate about the comprehensive development of students and the use of modern educational tools. Seeking an internship to apply my knowledge and grow professionally in a dynamic educational environment.",

    // Education
    "education.title": "Secondary Education - Specialization in Communication",
    "education.institution":
      "National University of San Antonio Abad of Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2026",
    "education.honors": "Top Third, Best Pre-Professional Internship 2023",

    // Projects
    "projects.title": "Reading Comprehension Project in Secondary Education",
    "projects.description":
      "Developed and implemented a reading comprehension program for secondary school students using active methodologies and digital resources. The project improved students' academic performance by 25% during the semester.",
    "projects.technologies": "Google Classroom, Kahoot, Canva, Microsoft Teams",
    "projects.duration": "5 months (Jun 2024 - Oct 2024)",

    // Skills
    "skills.technical":
      "Curriculum planning, Educational assessment, Use of LMS platforms, Google Workspace, Microsoft Office, Instructional material design, Virtual classroom, Active methodologies",
    "skills.soft":
      "Effective communication, Empathy, Patience, Leadership, Conflict resolution, Pedagogical creativity",
    "skills.languages":
      "Spanish (Native), English (Intermediate - B1), Quechua (Basic)",

    // Certifications
    "certifications.name":
      "Certification in Innovative Teaching Strategies",
    "certifications.issuer": "Coursera - Autonomous University of Barcelona",
    "certifications.date": "November 2023",
  },
};