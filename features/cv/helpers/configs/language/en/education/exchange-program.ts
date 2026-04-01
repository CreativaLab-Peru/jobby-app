import type { SectionConfig } from "../../../../types";
export const educationExchangeProgram: SectionConfig = {
  sections: [
    "personal",
    "education",
    "experience",
    "skills",
    "languages",
    "certifications",
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
      "Educator with 8 years of experience teaching mathematics and science. Passionate about creating inclusive learning environments and developing innovative methodologies that foster critical thinking in secondary school students.",

    // Education
    "education.title": "Bachelor’s Degree in Secondary Education - Mathematics",
    "education.institution": "National Pedagogical University",
    "education.location": "Bogotá, Colombia",
    "education.year": "2012 - 2016",
    "education.honors":
      "Graduated with Honors, Best Pedagogical Innovation Project",

    // Experience
    "experience.title": "Mathematics Teacher",
    "experience.company": "San José School",
    "experience.period": "2016 - Present",
    "experience.achievements":
      "Implemented active learning methodologies that increased student performance by 30%, Coordinated teacher training workshops on educational technologies",

    // Skills
    "skills.technical":
      "Educational platforms (Moodle, Google Classroom), Digital assessment tools, Microsoft Office, Instructional material design",
    "skills.soft":
      "Effective communication, Empathy, Conflict resolution, Curriculum planning, Educational leadership",

    // Languages
    "languages.native": "Spanish",
    "languages.advanced": "English (C1)",

    // Certifications
    "certifications.title":
      "Certification in Active Teaching Methodologies",
    "certifications.issuer": "Ministry of National Education",
    "certifications.date": "March 2023",
  },
};