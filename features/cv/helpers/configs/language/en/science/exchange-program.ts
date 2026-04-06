import type { SectionConfig } from "../../../../types";

export const scienceExchangeProgram: SectionConfig = {
  sections: ["personal", "education", "skills", "projects", "volunteering"],
  requiredFields: {
    // Summary optional for all CVs
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
      "Biology student participating in an academic exchange at the University of São Paulo, Brazil. Passionate about scientific research and molecular biology, with experience in international collaborative research projects and rigorous scientific methodology.",

    // Education
    "education.title": "Bachelor's in Biology",
    "education.institution":
      "National University of San Antonio Abad of Cusco", // Mantener el nombre en inglés para el CV en inglés
    "education.location": "Cusco, Peru",
    "education.year": "Expected December 2025",
    "education.honors":
      "GPA: 17.5/20, Member of the Andean Biodiversity Research Group",

    // Skills
    "skills.technical":
      "Laboratory techniques, Statistical analysis (R, SPSS), Microscopy, PCR and electrophoresis, Cell culture, Experimental design, Basic bioinformatics, Scientific database management",
    "skills.soft":
      "Analytical thinking, Problem-solving, Scientific communication, Teamwork, Laboratory time management, Attention to detail",
    "skills.languages":
      "Spanish (Native), English (Advanced - C1), Portuguese (Intermediate - B1)",

    // Projects
    "projects.title":
      "Study of Microbial Biodiversity in High-Andean Ecosystems",
    "projects.description":
      "Conducted research on extremophilic microorganisms in high-altitude lakes, including field sampling, lab analysis, and molecular characterization of species.",
    "projects.technologies":
      "PCR, Genetic sequencing, Phylogenetic analysis, R software, Optical microscopy",
    "projects.duration": "8 months (Jan 2024 - Aug 2024)",

    // Volunteering
    "volunteering.title":
      "Science Outreach Volunteer in Environmental Education Program",
    "volunteering.organization": "Science for Everyone",
    "volunteering.location": "Cusco, Peru",
    "volunteering.position": "Scientific Outreach Volunteer",
    "volunteering.duration": "3 months (Jun 2023 - Aug 2023)",
    "volunteering.responsibilities":
      "Designed and conducted natural science workshops for high school students, including hands-on experiments and lectures on Andean biodiversity conservation, reaching over 200 students.",
  },
};