import { Cv, CvSection, CvSectionType, Prisma } from "@prisma/client";
import { Opportunity } from "@/types/analysis";
import { CVAnalysis } from "@/features/opportunities/get-opportunities-from-engine";

type CvForMatch = Cv & { sections: CvSection[]; opportunities: Opportunity[] };

type UserPreferenceForMatch = {
  skills?: Prisma.JsonValue[];
  preferredRoles?: string[];
  expLevel?: string | null;
  country?: string | null;
};

function isJsonObject(value: Prisma.JsonValue | string): value is Prisma.JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeToArray(content: Prisma.JsonValue | null): Prisma.JsonValue[] {
  if (content === null) return [];

  let parsed: Prisma.JsonValue | string = content;
  if (typeof content === "string") {
    try {
      parsed = JSON.parse(content) as Prisma.JsonValue;
    } catch {
      parsed = content;
    }
  }

  if (Array.isArray(parsed)) return parsed;
  if (isJsonObject(parsed)) {
    const items = parsed.items;
    if (Array.isArray(items)) return items;
    return [parsed];
  }

  return [];
}

function toObject(value: Prisma.JsonValue): Prisma.JsonObject | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Prisma.JsonObject;
  }
  return null;
}

function getStringFromObject(obj: Prisma.JsonObject, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function mapExperienceLevel(expLevel?: string | null): CVAnalysis["level"] {
  const normalized = (expLevel || "").toUpperCase();
  if (normalized === "JUNIOR") return "JUNIOR";
  if (normalized === "MID" || normalized === "MID_LEVEL") return "MID";
  if (normalized === "SENIOR") return "SENIOR";
  if (normalized === "LEAD") return "LEAD";
  return "JUNIOR";
}

function parsePreferenceSkill(skill: Prisma.JsonValue): string | null {
  if (typeof skill === "string") {
    try {
      const parsed = JSON.parse(skill) as Prisma.JsonValue;
      const obj = toObject(parsed);
      if (obj) {
        const name = getStringFromObject(obj, ["name"]);
        return name || null;
      }
      return skill.trim() ? skill : null;
    } catch {
      return skill.trim() ? skill : null;
    }
  }

  const obj = toObject(skill);
  if (!obj) return null;
  const name = getStringFromObject(obj, ["name"]);
  return name || null;
}

/**
 * Orquestador de la transformación del CV y Preferencias a CVAnalysis
 */
export function transformCvToAnalysis(
  cv: CvForMatch,
  userPrefs?: UserPreferenceForMatch
): CVAnalysis {
  const { sections } = cv;

  // 1. Extraer Skills (Combinando CV + Preferencias)
  const skillsSet = new Set<string>();

  // De las secciones del CV
  const skillsSection = sections.find(s => s.sectionType === CvSectionType.SKILLS);
  if (skillsSection?.contentJson) {
    const json = skillsSection.contentJson;
    const jsonObject = toObject(json);

    if (jsonObject) {
      const soft = jsonObject.soft;
      if (Array.isArray(soft)) {
        soft.forEach((item) => {
          if (typeof item === "string" && item.trim()) skillsSet.add(item.toLowerCase());
        });
      }

      const technical = jsonObject.technical;
      if (Array.isArray(technical)) {
        technical.forEach((item) => {
          if (typeof item === "string" && item.trim()) skillsSet.add(item.toLowerCase());
        });
      }
    }

    normalizeToArray(json).forEach((item) => {
      if (typeof item === "string" && item.trim()) {
        skillsSet.add(item.toLowerCase());
        return;
      }

      const itemObj = toObject(item);
      if (!itemObj) return;
      const name = getStringFromObject(itemObj, ["name", "skill"]);
      if (name) skillsSet.add(name.toLowerCase());
    });
  }

  // De las Preferencias (Parseando el JSON con niveles que mostraste)
  if (userPrefs?.skills) {
    try {
      const prefsSkills = Array.isArray(userPrefs.skills) ? userPrefs.skills : [];
      prefsSkills.forEach((skillItem) => {
        const parsedName = parsePreferenceSkill(skillItem);
        if (parsedName) skillsSet.add(parsedName.toLowerCase());
      });
    } catch (e) {
      console.warn("[TRANSFORMER] Error parsing userPrefs skills", e);
    }
  }

  // 2. Extraer Experiencia
  const expSection = sections.find(s => s.sectionType === CvSectionType.EXPERIENCE);
  const experience_text = normalizeToArray(expSection?.contentJson)
    .map(item => {
      const itemObj = toObject(item);
      if (!itemObj) return "";

      const title = getStringFromObject(itemObj, ["title", "position", "role"]);
      const company = getStringFromObject(itemObj, ["company", "employer", "organization"]);
      const description = getStringFromObject(itemObj, ["description", "responsibilities", "summary"]);
      return `${title} at ${company}. ${description}`.trim();
    })
    .filter(Boolean)
    .join('. ') || '';

  // 3. Extraer Resumen (Priorizando el rol deseado de las preferencias)
  const summarySection = sections.find(s => s.sectionType === CvSectionType.SUMMARY);
  const summaryObj = summarySection?.contentJson ? toObject(summarySection.contentJson) : null;
  const rawSummary = summaryObj ? getStringFromObject(summaryObj, ["text", "summary"]) : "";
  const preferredRoles = userPrefs?.preferredRoles?.join(", ") || "";
  const summary = preferredRoles
    ? `Target Roles: ${preferredRoles}. ${rawSummary}`
    : rawSummary;

  const skills = Array.from(skillsSet);
  const combinedText = [summary, experience_text, skills.join(", ")]
    .filter((part) => Boolean(part && part.trim()))
    .join(". ");

  return {
    text: combinedText || undefined,
    skills,
    summary,
    experience_text,
    languages: normalizeToArray(sections.find(s => s.sectionType === CvSectionType.LANGUAGES)?.contentJson)
      .map((item) => {
        if (typeof item === "string") return item;
        const itemObj = toObject(item);
        if (!itemObj) return "";
        return getStringFromObject(itemObj, ["language", "name"]);
      })
      .filter((lang) => Boolean(lang && lang.trim())),
    type: cv.opportunityType,
    level: mapExperienceLevel(userPrefs?.expLevel),
    location: userPrefs?.country || undefined,
    countries: userPrefs?.country ? [userPrefs.country] : [],
  };
}
