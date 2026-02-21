import { Cv, CvSection, CvSectionType, OpportunityType } from "@prisma/client";
import {Opportunity} from "@/types/analysis";
import {CVAnalysis} from "@/features/opportunities/get-opportunities-from-engine";

/**
 * Normaliza los tipos de oportunidad para el motor externo
 */
export function mapOpportunityType(type: OpportunityType): string {
  const mapping: Partial<Record<OpportunityType, string>> = {
    FULL_TIME: 'EMPLOYMENT',
    PART_TIME: 'EMPLOYMENT',
    FREELANCE: 'EMPLOYMENT',
    RESEARCH_FELLOWSHIP: 'SCHOLARSHIP',
    GRADUATE_PROGRAM: 'SCHOLARSHIP',
  };
  return mapping[type] || type;
}

/**
 * Orquestador de la transformación del CV y Preferencias a CVAnalysis
 */
export function transformCvToAnalysis(
  cv: Cv & { sections: CvSection[], opportunities: Opportunity[] },
  userPrefs?: any // Tabla de preferencias que mencionaste
): CVAnalysis {
  const { sections } = cv;

  // 1. Extraer Skills (Combinando CV + Preferencias)
  const skillsSet = new Set<string>();

  // De las secciones del CV
  const skillsSection = sections.find(s => s.sectionType === CvSectionType.SKILLS);
  if (skillsSection?.contentJson) {
    const json = skillsSection.contentJson as any;
    if (json.soft) json.soft.forEach((s: string) => skillsSet.add(s.toLowerCase()));
    if (json.technical) json.technical.forEach((s: string) => skillsSet.add(s.toLowerCase()));
    if (Array.isArray(json)) {
      json.forEach((s: any) => skillsSet.add((typeof s === 'string' ? s : s.name).toLowerCase()));
    }
  }

  // De las Preferencias (Parseando el JSON con niveles que mostraste)
  if (userPrefs?.skills) {
    try {
      // Manejo del formato extraño de strings-JSON que pasaste
      const prefsSkills = Array.isArray(userPrefs.skills) ? userPrefs.skills : [];
      prefsSkills.forEach((s: string) => {
        try {
          const parsed = JSON.parse(s);
          if (parsed.name) skillsSet.add(parsed.name.toLowerCase());
        } catch { /* ignore individual parse errors */ }
      });
    } catch (e) {
      console.warn("[TRANSFORMER] Error parsing userPrefs skills", e);
    }
  }

  // 2. Extraer Experiencia
  const expSection = sections.find(s => s.sectionType === CvSectionType.EXPERIENCE);
  const experience_text = (expSection?.contentJson as any[])
    ?.map(item => `${item.title || ''} at ${item.company || ''}. ${item.description || ''}`)
    .join('. ') || '';

  // 3. Extraer Resumen (Priorizando el rol deseado de las preferencias)
  const summarySection = sections.find(s => s.sectionType === CvSectionType.SUMMARY);
  const rawSummary = (summarySection?.contentJson as any)?.text || '';
  const preferredRoles = userPrefs?.preferredRoles?.join(", ") || "";
  const summary = preferredRoles
    ? `Target Roles: ${preferredRoles}. ${rawSummary}`
    : rawSummary;

  return {
    skills: Array.from(skillsSet),
    summary,
    experience_text,
    languages: (sections.find(s => s.sectionType === CvSectionType.LANGUAGES)?.contentJson as any[])
      ?.map(item => item.language || item.name || '').filter(Boolean) || [],
    type: mapOpportunityType(cv.opportunityType),
    level: userPrefs?.expLevel || "JUNIOR", // Usamos el dato real de la tabla
    location: userPrefs?.country || undefined,
    countries: userPrefs?.country ? [userPrefs.country] : [],
  };
}
