
import { CvSectionType, OpportunityType, Prisma } from "@prisma/client";
import type { EvaluateCvSectionsPayload } from "@/features/cv/helpers/types";

type JsonInput = Prisma.JsonValue | null;
type JsonRecord = Record<string, Prisma.JsonValue>;

export type CvSectionInput = {
  sectionType?: CvSectionType | string;
  contentJson?: Prisma.JsonValue | null;
};

export interface AiEvaluationResult {
  overallScore: number;
  summary: string;
  sectionScores: {
    sectionType: string;
    score: number;
    details: Record<string, any>;
  }[];
  improvedTexts: {
    sectionType: string;
    originalSnippet: string;
    improvedText: string;
    changeReason: string;
  }[];
  suggestedAdditions: {
    sectionType: string;
    title: string;
    suggestedText: string;
    impact: "LOW" | "MEDIUM" | "HIGH";
    reason: string;
  }[];
  description?: string; // Para el consumo de créditos
}

// Mapa de configuración para secciones requeridas (Mantenible y escalable)
const REQUIRED_SECTIONS_BY_OPPORTUNITY: Record<OpportunityType, string[]> = {
  [OpportunityType.SCHOLARSHIP]: ["personal", "education", "projects", "achievements", "skills", "volunteering"],
  [OpportunityType.EXCHANGE_PROGRAM]: ["personal", "education", "languages", "volunteering", "skills"],
  [OpportunityType.STARTUP]: ["personal", "projects", "experience", "skills", "achievements"],
  [OpportunityType.INTERNSHIP]: ["personal", "education", "projects", "skills", "languages"],
  [OpportunityType.EMPLOYMENT]: ["personal", "experience", "skills", "education", "certifications"],
};

const isRecord = (value: JsonInput): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toRecordArray = (value: JsonInput): JsonRecord[] => {
  if (Array.isArray(value)) return value.filter(isRecord);
  return isRecord(value) ? [value] : [];
};

const toStringArray = (value: JsonInput): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : (isRecord(item) && typeof item.name === "string" ? item.name : "")))
    .map((item) => item.trim())
    .filter(Boolean);
};

const hasText = (value: JsonInput): boolean => typeof value === "string" && value.trim().length > 0;

const hasMeaningfulValue = (value: JsonInput): boolean => {
  if (hasText(value)) return true;
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (isRecord(value)) return Object.values(value).some(hasMeaningfulValue);
  return false;
};

const filterNonEmptyRecords = (items: JsonRecord[]): JsonRecord[] =>
  items.filter((item) => hasMeaningfulValue(item));

const cleanPersonal = (value: JsonRecord): JsonRecord => {
  const allowedKeys = ["fullName", "address", "linkedin", "phone", "email", "summary", "nationality"];
  return Object.fromEntries(
    Object.entries(value).filter(([key, val]) => allowedKeys.includes(key) && hasMeaningfulValue(val))
  ) as JsonRecord;
};

export function buildMappedSectionsPayload(sections: CvSectionInput[]): EvaluateCvSectionsPayload {
  const payload: EvaluateCvSectionsPayload = {};
  const personal: JsonRecord = {};
  const skills: JsonRecord = {};

  for (const section of sections) {
    const content = section.contentJson;
    if (!content) continue;

    switch (section.sectionType) {
      case CvSectionType.SUMMARY:
        if (typeof content === "string" && content.trim()) personal.summary = content.trim();
        else if (isRecord(content) && typeof content.text === "string" && content.text.trim()) {
          personal.summary = content.text.trim();
        }
        break;
      case CvSectionType.CONTACT:
        if (isRecord(content)) Object.assign(personal, cleanPersonal(content));
        break;
      case CvSectionType.EXPERIENCE: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.experience = { items };
        break;
      }
      case CvSectionType.EDUCATION: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.education = { items };
        break;
      }
      case CvSectionType.PROJECTS: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.projects = { items };
        break;
      }
      case CvSectionType.ACHIEVEMENTS: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.achievements = { items };
        break;
      }
      case CvSectionType.CERTIFICATIONS: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.certifications = { items };
        break;
      }
      case CvSectionType.VOLUNTEERING: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.volunteering = { items };
        break;
      }
      case CvSectionType.COMPLEMENTS: {
        if (Array.isArray(content)) {
          const items = filterNonEmptyRecords(toRecordArray(content));
          if (items.length) payload.complements = { items };
        } else if (isRecord(content) && hasMeaningfulValue(content)) {
          payload.complements = content;
        }
        break;
      }
      case CvSectionType.INTERESTS: {
        const items = filterNonEmptyRecords(toRecordArray(content));
        if (items.length) payload.interests = { items };
        break;
      }
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

  const hasSkills =
    (Array.isArray(skills.technical) && skills.technical.length > 0) ||
    (Array.isArray(skills.soft) && skills.soft.length > 0) ||
    (Array.isArray(skills.languages) && skills.languages.length > 0);
  if (hasSkills) payload.skills = skills;

  return payload;
}

export function filterSectionsByOpportunity(
  payload: EvaluateCvSectionsPayload,
  type: OpportunityType | null | string
): EvaluateCvSectionsPayload {
  const allowed = REQUIRED_SECTIONS_BY_OPPORTUNITY[type as OpportunityType];
  if (!allowed) return payload;

  const filtered: EvaluateCvSectionsPayload = {};
  for (const key of Object.keys(payload) as (keyof EvaluateCvSectionsPayload)[]) {
    if (allowed.includes(key as string)) {
      filtered[key] = payload[key];
    }
  }

  return filtered;
}

/**
 * Orquestador principal para construir el payload de evaluación.
 * Prioriza las secciones editadas manualmente y ofrece fallback al JSON extraído del PDF.
 */
export function buildCvPayloadForEvaluation(cv: {
  sections?: CvSectionInput[];
  extractedJson?: Prisma.JsonValue | null
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
function buildMappedSectionsFromLegacyExtractedJson(raw: JsonRecord): EvaluateCvSectionsPayload {
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
    complements: CvSectionType.COMPLEMENTS,
    interests: CvSectionType.INTERESTS,
  };

  Object.entries(fieldMapping).forEach(([key, sectionType]) => {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      mappedSections.push({
        sectionType,
        contentJson: raw[key],
      });
    }
  });

  // Reutilizamos la lógica de mapeo estándar para garantizar consistencia
  return buildMappedSectionsPayload(mappedSections);
}

// Obtenemos los valores válidos del Enum de Prisma
const VALID_CV_SECTIONS = Object.values(CvSectionType);

/**
 * Asegura que el string enviado por la IA sea un miembro válido del Enum.
 * Si no lo es, intenta convertirlo a mayúsculas o usa un fallback.
 */
export const sanitizeSectionType = (rawType: string): CvSectionType | null => {
  if (!rawType) return null;
  const normalized = rawType.toUpperCase().trim() as CvSectionType;

  if (VALID_CV_SECTIONS.includes(normalized)) {
    return normalized;
  }

  return null;
};

export const allowedSectionTypesFromPayload = (payload: EvaluateCvSectionsPayload): Set<CvSectionType> => {
  const allowed = new Set<CvSectionType>();

  if (payload.personal && isRecord(payload.personal)) {
    const personal = payload.personal as JsonRecord;
    const hasSummary = hasText(personal.summary);
    const hasContact = Object.entries(personal).some(
      ([key, value]) => key !== "summary" && hasMeaningfulValue(value)
    );
    if (hasSummary) allowed.add(CvSectionType.SUMMARY);
    if (hasContact) allowed.add(CvSectionType.CONTACT);
  }

  if (payload.experience) allowed.add(CvSectionType.EXPERIENCE);
  if (payload.education) allowed.add(CvSectionType.EDUCATION);
  if (payload.skills) allowed.add(CvSectionType.SKILLS);
  if (payload.projects) allowed.add(CvSectionType.PROJECTS);
  if (payload.volunteering) allowed.add(CvSectionType.VOLUNTEERING);
  if (payload.certifications) allowed.add(CvSectionType.CERTIFICATIONS);
  if (payload.achievements) allowed.add(CvSectionType.ACHIEVEMENTS);
  if (payload.complements) allowed.add(CvSectionType.COMPLEMENTS);
  if (payload.interests) allowed.add(CvSectionType.INTERESTS);

  return allowed;
};
