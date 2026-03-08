import { CvSectionType } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

export const getDefaultCvSections = () => [
  {
    sectionType: CvSectionType.SUMMARY,
    title: "Summary",
    order: 0,
    contentJson: { text: "" } as JsonObject,
  },
  {
    sectionType: CvSectionType.CONTACT,
    title: "Contact",
    order: 1,
    contentJson: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      address: "",
    },
  },
  {
    sectionType: CvSectionType.EXPERIENCE,
    title: "Work Experience",
    order: 2,
    contentJson: [],
  },
  {
    sectionType: CvSectionType.EDUCATION,
    title: "Education",
    order: 3,
    contentJson: [],
  },
  {
    sectionType: CvSectionType.SKILLS,
    title: "Skills",
    order: 4,
    contentJson: [],
  },
  {
    sectionType: CvSectionType.PROJECTS,
    title: "Projects",
    order: 5,
    contentJson: [],
  },
  {
    sectionType: CvSectionType.CERTIFICATIONS,
    title: "Certifications",
    order: 6,
    contentJson: [],
  },
  {
    sectionType: CvSectionType.LANGUAGES,
    title: "Languages",
    order: 7,
    contentJson: [],
  },
];

