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
 * Aplica ejemplos, tips y configuración de required personalizados a una sección base
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
    const customRequired = config.requiredFields?.[fieldPath];


    return {
      ...field,
      example: customExample !== undefined ? customExample : field.example,
      tip: customTip !== undefined ? customTip : field.tip,
      required: customRequired !== undefined ? customRequired : field.required,
    };
  });

  return customizedSection;
}

/**
 * Función principal que genera las secciones del CV
 * @param opportunityType - Tipo de oportunidad (INTERNSHIP, FULL_TIME, etc.)
 * @param cvType - Tipo de CV (TECHNOLOGY_ENGINEERING, DESIGN_CREATIVITY, etc.)
 * @param templateId - ID del template (e.g. "europass" agrega campos específicos)
 */
export function getSections(
  opportunityType: OpportunityType,
  cvType: CvType = CvType.TECHNOLOGY_ENGINEERING,
  templateId?: string
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

  // Ajustes por template: campos adicionales específicos
  if (templateId === "europass") {
    const personalIdx = sections.findIndex((s) => s.id === "personal");
    if (personalIdx !== -1) {
      const hasNationality = sections[personalIdx].fields.some((f) => f.name === "nationality");
      const hasImage = sections[personalIdx].fields.some((f) => f.name === "image");

      let fields = [...sections[personalIdx].fields];

      // Insertar "image" justo después de fullName (índice 0)
      if (!hasImage) {
        const afterFullName = fields.findIndex((f) => f.name === "fullName");
        fields.splice(afterFullName + 1, 0, {
          name: "image",
          label: "Foto de perfil (Europass)",
          type: "photo" as const,
          required: false,
          tip: "El formato Europass recomienda incluir una foto profesional. Sube una imagen JPG o PNG de hasta 2MB.",
          example: "",
        });
      }

      // Insertar "nationality" justo después de "address"
      if (!hasNationality) {
        const afterAddress = fields.findIndex((f) => f.name === "address");
        const insertAt = afterAddress >= 0 ? afterAddress + 1 : fields.length;
        fields.splice(insertAt, 0, {
          name: "nationality",
          label: "Nacionalidad",
          type: "text" as const,
          required: false,
          tip: "Requerido por el formato Europass. Ej: Peruana, Colombiana...",
          example: "Peruana",
        });
      }

      sections[personalIdx] = {
        ...sections[personalIdx],
        fields,
      };
    }
  }

  return sections;
}

export type {
  SectionConfig,
  FieldExampleConfig,
  FieldTipConfig,
  FieldRequiredConfig,
  ConfigGetter,
} from "./types";
