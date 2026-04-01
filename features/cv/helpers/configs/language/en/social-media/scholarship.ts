import type { SectionConfig } from "../../../../types";

export const socialMediaScholarship: SectionConfig = {
  sections: ["personal", "projects", "achievements", "education"],

  // Educación opcional para becas
  requiredFields: {
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
      "Student passionate about social media and digital communication, with experience in content creation, community management, and international collaboration. Seeking a scholarship to further develop skills in social media strategy and contribute creativity to global projects.",

    // Projects
    "projects.title": "Multicultural Digital Content Project",
    "projects.description":
      "Design and execution of a content series about Peruvian culture for international audiences, achieving 50K views and collaborating with content creators from 5 different countries. Focused on traditions, cuisine, and local perspectives.",
    "projects.technologies": "Instagram, TikTok, Canva, CapCut, Academic Collaboration Platforms",
    "projects.duration": "6 months (Jan 2024 - Jun 2024)",

    // Achievements
    "achievements.title": "Recognition for Academic Excellence and Leadership in Digital Projects",
    "achievements.description":
      "Selected among numerous candidates for outstanding academic performance and leadership in digital communication projects. Active participation in social media initiatives with measurable results and contribution to the student community.",
    "achievements.date": "2023",

    // Education
    "education.title": "Bachelor's in Digital Communication",
    "education.institution": "National University of San Antonio Abad of Cusco",
    "education.location": "Cusco, Peru",
    "education.year": "Expected 2026",
    "education.honors":
      "Top Third (Top 10%), Academic Excellence Recognition, Participation in Digital Media Excellence Programs",
  },
};