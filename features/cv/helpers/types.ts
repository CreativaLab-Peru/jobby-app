import { OpportunityType } from "@prisma/client"
import type { Prisma } from "@prisma/client"

export const MAPPED_CV_SECTIONS = [
  "personal",
  "projects",
  "experience",
  "education",
  "achievements",
  "skills",
  "languages",
  "certifications",
  "volunteering",
  "complements",
  "interests",
] as const

export type MappedCvSection = (typeof MAPPED_CV_SECTIONS)[number]

export type EvaluateCvSectionsPayload = Partial<Record<MappedCvSection, Prisma.JsonValue>>

/**
 * Configuración de ejemplos personalizados por campo
 */
export interface FieldExampleConfig {
  [fieldPath: string]: string // e.g., "personal.summary", "skills.technical"
}

/**
 * Configuración de tips personalizados por campo
 */
export interface FieldTipConfig {
  [fieldPath: string]: string
}

/**
 * Configuración de campos requeridos por fieldPath
 */
export interface FieldRequiredConfig {
  [fieldPath: string]: boolean // e.g., "education.institution": false para Becas
}

/**
 * Configuración completa para una combinación de CvType + OpportunityType
 */
export interface SectionConfig {
  // Qué secciones mostrar y en qué orden
  sections: MappedCvSection[] // ["personal", "projects", "experience", "education", "achievements", "skills"]

  // Ejemplos personalizados por campo
  examples: FieldExampleConfig

  // Tips personalizados (opcional, si no se especifica usa el default)
  tips?: FieldTipConfig

  // Campos requeridos personalizados (opcional, si no se especifica usa el default)
  requiredFields?: FieldRequiredConfig
}

/**
 * Función para obtener configuración según CvType + OpportunityType
 */
export type ConfigGetter = (opportunityType: OpportunityType) => SectionConfig
