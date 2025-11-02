import { CvType, OpportunityType } from "@prisma/client";
import type { CVSection } from "@/types/cv";
import { baseSectionsMap } from "./base-sections";
import type { SectionConfig } from "./types";
import { getDefaultConfig } from "./configs/default";
import { getFinanceProjectsConfig } from "./configs/finance-projects";
import { getTechnologyEngineeringConfig } from "./configs/technology-engineering";
import { getDesignCreativityConfig } from "./configs/design-creativity";
import { getMarketingStrategyConfig } from "./configs/marketing-strategy";
import { getManagementBusinessConfig } from "./configs/management-business";
import { getSocialMediaConfig } from "./configs/social-media";
import { getEducationConfig } from "./configs/education";
import { getScienceConfig } from "./configs/science";

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
    case CvType.MARKETING_STRATEGY:
      return getMarketingStrategyConfig(opportunityType);
    case CvType.MANAGEMENT_BUSINESS:
      return getManagementBusinessConfig(opportunityType);
    case CvType.SOCIAL_MEDIA:
      return getSocialMediaConfig(opportunityType);
    case CvType.EDUCATION:
      return getEducationConfig(opportunityType);
    case CvType.SCIENCE:
      return getScienceConfig(opportunityType);
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
  cvType: CvType = CvType.TECHNOLOGY_ENGINEERING
): CVSection[] {
  // Obtener configuración específica
  const config = getConfig(cvType, opportunityType);

  // Construir secciones según el orden especificado en la config de cada CvType
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

export type {
  SectionConfig,
  FieldExampleConfig,
  FieldTipConfig,
  ConfigGetter,
} from "./types";
