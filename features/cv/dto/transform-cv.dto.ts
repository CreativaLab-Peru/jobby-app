import { CVData } from "@/types/cv";
import { CvSectionType } from "@prisma/client";
import { CVWithSections } from "../actions/get-cv-by-id";
import { parseJsonArray } from "@/utils/parse-json-to-array";

export function transformCVToDTO(cv: CVWithSections): CVData {
  // 1️⃣ Crear un helper para encontrar una sección
  const getSection = (type: CvSectionType) =>
    cv.sections.find((s) => s.sectionType === type);

  // 2️⃣ Extraer los datos de cada sección
  const education = parseJsonArray(getSection(CvSectionType.EDUCATION)?.contentJson);
  const experience = parseJsonArray(getSection(CvSectionType.EXPERIENCE)?.contentJson);
  const projects = parseJsonArray(getSection(CvSectionType.PROJECTS)?.contentJson);
  const certifications = parseJsonArray(getSection(CvSectionType.CERTIFICATIONS)?.contentJson);
  const achievements = parseJsonArray(getSection(CvSectionType.ACHIEVEMENTS)?.contentJson);
  const volunteering = parseJsonArray(getSection(CvSectionType.VOLUNTEERING)?.contentJson);

  const summary = getSection(CvSectionType.SUMMARY)?.contentJson as
    | { text?: string }
    | null
    | undefined;
  const contact = getSection(CvSectionType.CONTACT)?.contentJson as
    | {
      fullName?: string;
      address?: string;
      linkedin?: string;
      phone?: string;
      email?: string;
    }
    | null
    | undefined;

  const skills = getSection(CvSectionType.SKILLS)?.contentJson as
    | {
      technical?: string[];
      soft?: string[];
      languages?: string[];
    }
    | null
    | undefined;

  // 3️⃣ Mapear el DTO
  return {
    personal: {
      fullName: contact?.fullName ?? "",
      address: contact?.address ?? "",
      linkedin: contact?.linkedin ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
      summary: summary?.text ?? "",
    },
    education: {
      items: education.map((item) => ({
        id: item.id,
        level: item.level ?? "",
        title: item.title ?? "",
        institution: item.institution ?? "",
        location: item.location ?? "",
        year: item.year ?? "",
        honors: item.honors ?? "",
      })),
    },
    experience: {
      items: experience.map((item) => ({
        id: item.id,
        position: item.position ?? "",
        company: item.company ?? "",
        location: item.location ?? "",
        duration: item.duration ?? "",
        responsibilities: item.responsibilities ?? "",
      })),
    },
    projects: {
      items: projects.map((item) => ({
        id: item.id,
        title: item.title ?? "",
        description: item.description ?? "",
        technologies: item.technologies ?? "",
        duration: item.duration ?? "",
      })),
    },
    certifications: {
      items: certifications.map((item) => ({
        id: item.id,
        name: item.name ?? "",
        issuer: item.issuer ?? "",
        date: item.date ?? "",
      })),
    },
    skills: {
      technical: skills?.technical ?? [],
      soft: skills?.soft ?? [],
      languages: skills?.languages ?? [],
    },
    achievements: {
      items: achievements.map((item) => ({
        id: item.id,
        title: item.title ?? "",
        description: item.description ?? "",
        date: item.date ?? "",
      })),
    },
    volunteering: {
      items: volunteering.map((item) => ({
        id: item.id,
        organization: item.organization ?? "",
        location: item.location ?? "",
        position: item.position ?? "",
        duration: item.duration ?? "",
        responsibilities: item.responsibilities ?? "",
      })),
    },
  };
}
