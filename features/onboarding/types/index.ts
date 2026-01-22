export type Area =
  | 'DATA_ANALYTICS'
  | 'ENGINEERING_OPERATIONS'
  | 'TECH_SYSTEMS'
  | 'PROJECT_PMO'
  | 'FINANCE_COSTS'
  | 'MARKETING_GROWTH'
  | 'SALES_REVENUE'
  | 'CUSTOMER_SUPPORT';

export type SkillLevel = 'INTERMEDIATE' | 'ADVANCED';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface RegisterFormData {
  // 1. Datos básicos
  fullName: string;
  birthDate: string;
  country: 'Peru';

  // 2. Área & Rol
  area: Area | null;
  role: string | null;

  // 3. Nivel profesional
  experienceLevel: 'GRADUATE' | 'JUNIOR' | 'ONE_TO_THREE_YEARS';

  // 4. Modalidad
  workModes: Array<'REMOTE' | 'HYBRID' | 'ONSITE'>;
  city: string | null;

  // 5. Disponibilidad
  availability: 'FULL_TIME' | 'PART_TIME' | 'PROJECT';

  // 6. Habilidades
  skills: Skill[];

  // 7. Portafolio
  portfolioUrl: string;
}
