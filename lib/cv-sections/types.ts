import { OpportunityType } from "@prisma/client"

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
 * Configuración completa para una combinación de CvType + OpportunityType
 */
export interface SectionConfig {
  // Qué secciones mostrar y en qué orden
  sections: string[] // ["personal", "projects", "experience", "education", "achievements", "skills"]
  
  // Ejemplos personalizados por campo
  examples: FieldExampleConfig
  
  // Tips personalizados (opcional, si no se especifica usa el default)
  tips?: FieldTipConfig
}

/**
 * Función para obtener configuración según CvType + OpportunityType
 */
export type ConfigGetter = (opportunityType: OpportunityType) => SectionConfig
