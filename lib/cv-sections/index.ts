import { CvType, OpportunityType } from "@prisma/client";
import type { CVSection } from "@/types/cv";
import { baseSectionsMap } from "./base-sections";
import { getFinanceProjectsConfig } from "./configs/finance-projects";
import { getTechnologyEngineeringConfig } from "./configs/technology-engineering";
import { getDefaultConfig } from "./configs/default";
import type { SectionConfig } from "./types";
import { getDesignCreativityConfig } from "./configs/design-creativity";

/**
 * Obtiene la configuración específica según CvType + OpportunityType
 */
function getConfig(
  cvType: CvType,
  opportunityType: OpportunityType
): SectionConfig {
  switch (cvType) {
    case CvType.TECHNOLOGY_ENGINEERING:
      return getTechnologyEngineeringConfig(opportunityType);
    case CvType.FINANCE_PROJECTS:
      return getFinanceProjectsConfig(opportunityType);
    case CvType.DESIGN_CREATIVITY:
      return getDesignCreativityConfig(opportunityType);

    // Los demás CvTypes usan configuración por defecto (temporal)
    case CvType.MARKETING_STRATEGY:
    case CvType.MANAGEMENT_BUSINESS:
    case CvType.SOCIAL_MEDIA:
    case CvType.EDUCATION:
    case CvType.SCIENCE:
    default:
      return getDefaultConfig(opportunityType);
  }
}

/**
 * Aplica ejemplos y tips personalizados a una sección base
 */
function applyCustomization(
  baseSection: CVSection,
  config: SectionConfig
): CVSection {
  const customizedSection = { ...baseSection };

  customizedSection.fields = baseSection.fields.map((field) => {
    const fieldPath = `${baseSection.id}.${field.name}`;
    const customExample = config.examples[fieldPath];
    const customTip = config.tips?.[fieldPath];

    return {
      ...field,
      example: customExample !== undefined ? customExample : field.example,
      tip: customTip !== undefined ? customTip : field.tip,
    };
  });

  return customizedSection;
}

/**
 * Función principal que genera las secciones del CV
 * @param opportunityType - Tipo de oportunidad (INTERNSHIP, FULL_TIME, etc.)
 * @param cvType - Tipo de CV (TECHNOLOGY_ENGINEERING, DESIGN_CREATIVITY, etc.)
 */
export function getSections(
  opportunityType: OpportunityType,
  cvType: CvType = CvType.TECHNOLOGY_ENGINEERING // Default para retrocompatibilidad
): CVSection[] {
  // Obtener configuración específica
  const config = getConfig(cvType, opportunityType);

  // Construir secciones según el orden especificado en la config
  const sections: CVSection[] = [];

  for (const sectionId of config.sections) {
    const baseSection = baseSectionsMap[sectionId];

    if (baseSection) {
      const customizedSection = applyCustomization(baseSection, config);
      sections.push(customizedSection);
    }
  }

  return sections;
}

// Re-exportar tipos para conveniencia
export type {
  SectionConfig,
  FieldExampleConfig,
  FieldTipConfig,
  ConfigGetter,
} from "./types";
