import type { SectionConfig } from "../../../../types";

export const scienceEmployment: SectionConfig = {
  sections: [
    "personal",
    "education",
    "experience",
    "achievements",
    "certifications",
    "skills",
  ],
  requiredFields: {
    // Summary optional for all CVs
    "personal.summary": false,
    // Education optional for employment
    "education.level": false,
    "education.title": false,
    "education.institution": false,
    "education.location": false,
    "education.year": false,
  },
  examples: {
    "personal.summary":
      "Research scientist with over 7 years of experience in biotechnology and drug development. Specialized in molecular biology and genomic data analysis, with publications in high-impact journals. Committed to scientific innovation and interdisciplinary collaboration to tackle complex challenges in human health.",

    // Education
    "education.title": "PhD in Molecular Biology",
    "education.institution": "Universidad Complutense de Madrid",
    "education.location": "Madrid, Spain",
    "education.year": "Graduated September 2018",
    "education.honors": "Cum Laude, FPI Fellowship from the Spanish Ministry of Science and Innovation",

    // Experience
    "experience.company": "Biomedical Research Institute",
    "experience.location": "Barcelona, Spain",
    "experience.position": "Postdoctoral Researcher",
    "experience.duration": "January 2019 - Present",
    "experience.responsibilities":
      "• Designed and executed gene expression experiments identifying 3 novel potential biomarkers for colorectal cancer.\n• Supervised 2 PhD students and 3 Master’s students in collaborative research projects.\n• Published 8 peer-reviewed articles (Q1) with an average impact factor of 7.5.\n• Secured €150,000 in funding through coordination of European H2020 projects.",

    // Achievements
    "achievements.title": "Young Investigator Award in Molecular Oncology",
    "achievements.description":
      "Recognized for identifying a new drug resistance mechanism in tumor cells, contributing to the development of more effective combination therapies. Work highlighted on the cover of Nature Communications.",
    "achievements.date": "November 2022",

    // Certifications
    "certifications.name": "Certification in Bioinformatics and NGS Analysis",
    "certifications.issuer": "European Bioinformatics Institute (EMBL-EBI)",
    "certifications.date": "2020",

    // Skills
    "skills.technical":
      "PCR, Western Blot, NGS Sequencing, Bioinformatics (R, Python), Cell Culture, CRISPR-Cas9, Mass Spectrometry, ImageJ, GraphPad Prism",
    "skills.soft":
      "Critical thinking, Complex problem-solving, Multidisciplinary teamwork, Scientific communication, Project management",
    "skills.languages":
      "Spanish (Native), English (Fluent - C1), French (Intermediate)",
  },
};