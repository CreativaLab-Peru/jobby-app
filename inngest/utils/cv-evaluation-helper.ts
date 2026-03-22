
import { CvSectionType, OpportunityType } from "@prisma/client";
import type { EvaluateCvSectionsPayload } from "@/features/cv/helpers/types";

export type CvSectionInput = {
  sectionType?: CvSectionType | string;
  contentJson?: unknown;
};

// Mapa de configuración para secciones requeridas (Mantenible y escalable)
const REQUIRED_SECTIONS_BY_OPPORTUNITY: Record<OpportunityType, string[]> = {
  [OpportunityType.SCHOLARSHIP]: ["personal", "education", "projects", "achievements", "skills", "volunteering"],
  [OpportunityType.EXCHANGE_PROGRAM]: ["personal", "education", "languages", "volunteering", "skills"],
  [OpportunityType.STARTUP]: ["personal", "projects", "experience", "skills", "achievements"],
  [OpportunityType.INTERNSHIP]: ["personal", "education", "projects", "skills", "languages"],
  [OpportunityType.EMPLOYMENT]: ["personal", "experience", "skills", "education", "certifications"],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) return value.filter(isRecord);
  return isRecord(value) ? [value] : [];
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : (isRecord(item) && typeof item.name === "string" ? item.name : "")))
    .filter(Boolean);
};

export function buildMappedSectionsPayload(sections: CvSectionInput[]): EvaluateCvSectionsPayload {
  const payload: EvaluateCvSectionsPayload = {};
  const personal: Record<string, unknown> = {};
  const skills: Record<string, unknown> = {};

  for (const section of sections) {
    const content = section.contentJson;
    if (!content) continue;

    switch (section.sectionType) {
      case CvSectionType.SUMMARY:
        if (typeof content === "string") personal.summary = content;
        else if (isRecord(content) && typeof content.text === "string") personal.summary = content.text;
        break;
      case CvSectionType.CONTACT:
        if (isRecord(content)) Object.assign(personal, content);
        break;
      case CvSectionType.EXPERIENCE: payload.experience = { items: toRecordArray(content) }; break;
      case CvSectionType.EDUCATION: payload.education = { items: toRecordArray(content) }; break;
      case CvSectionType.PROJECTS: payload.projects = { items: toRecordArray(content) }; break;
      case CvSectionType.ACHIEVEMENTS: payload.achievements = { items: toRecordArray(content) }; break;
      case CvSectionType.CERTIFICATIONS: payload.certifications = { items: toRecordArray(content) }; break;
      case CvSectionType.VOLUNTEERING: payload.volunteering = { items: toRecordArray(content) }; break;
      case CvSectionType.SKILLS:
        if (isRecord(content)) {
          skills.technical = toStringArray(content.technical);
          skills.soft = toStringArray(content.soft);
          skills.languages = toStringArray(content.languages);
        } else skills.technical = toStringArray(content);
        break;
      case CvSectionType.LANGUAGES:
        const currentLangs = Array.isArray(skills.languages) ? (skills.languages as string[]) : [];
        skills.languages = Array.from(new Set([...currentLangs, ...toStringArray(content)]));
        break;
    }
  }

  if (Object.keys(personal).length > 0) payload.personal = personal;
  if (Object.keys(skills).length > 0) payload.skills = skills;
  return payload;
}

export function filterSectionsByOpportunity(
  payload: EvaluateCvSectionsPayload,
  type: OpportunityType | null | string
): EvaluateCvSectionsPayload {
  const allowed = REQUIRED_SECTIONS_BY_OPPORTUNITY[type as OpportunityType];
  if (!allowed) return payload;

  return Object.keys(payload)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      // @ts-ignore
      obj[key] = payload[key];
      return obj;
    }, {} as EvaluateCvSectionsPayload);
}

/**
 * Orquestador principal para construir el payload de evaluación.
 * Prioriza las secciones editadas manualmente y ofrece fallback al JSON extraído del PDF.
 */
export function buildCvPayloadForEvaluation(cv: {
  sections?: CvSectionInput[];
  extractedJson?: any
}): EvaluateCvSectionsPayload {

  // 1. Prioridad: Secciones estructuradas (Manuales/Editadas)
  if (Array.isArray(cv.sections) && cv.sections.length > 0) {
    return buildMappedSectionsPayload(cv.sections);
  }

  // 2. Fallback: Procesar el JSON extraído del PDF (Parser)
  if (isRecord(cv.extractedJson)) {
    const extractedSections = cv.extractedJson.sections;

    // Si el parser ya estructuró los datos como un array de secciones
    if (Array.isArray(extractedSections)) {
      return buildMappedSectionsPayload(extractedSections as CvSectionInput[]);
    }

    // Si el JSON es plano (formato legacy o extracción directa de campos)
    return buildMappedSectionsFromLegacyExtractedJson(cv.extractedJson);
  }

  return {};
}

/**
 * Función interna para normalizar un JSON plano (legacy) a la estructura de secciones.
 */
function buildMappedSectionsFromLegacyExtractedJson(raw: Record<string, unknown>): EvaluateCvSectionsPayload {
  const mappedSections: CvSectionInput[] = [];

  // Mapeamos las llaves del JSON plano a los tipos de sección oficiales
  const fieldMapping: Record<string, CvSectionType> = {
    summary: CvSectionType.SUMMARY,
    contact: CvSectionType.CONTACT,
    experience: CvSectionType.EXPERIENCE,
    education: CvSectionType.EDUCATION,
    projects: CvSectionType.PROJECTS,
    achievements: CvSectionType.ACHIEVEMENTS,
    certifications: CvSectionType.CERTIFICATIONS,
    volunteering: CvSectionType.VOLUNTEERING,
    skills: CvSectionType.SKILLS,
    languages: CvSectionType.LANGUAGES,
  };

  Object.entries(fieldMapping).forEach(([key, sectionType]) => {
    if (raw[key] !== undefined) {
      mappedSections.push({
        sectionType,
        contentJson: raw[key],
      });
    }
  });

  // Reutilizamos la lógica de mapeo estándar para garantizar consistencia
  return buildMappedSectionsPayload(mappedSections);
}
