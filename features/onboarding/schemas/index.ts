import { z } from "zod";

export const talentOnboardingSchema = z.object({
  // Paso 1: Preferencias de Rol
  preferredRoles: z.array(z.string()).min(1, "Selecciona al menos un rol"),

  // Paso 2: Logística y Dinero
  minSalary: z.coerce.number().min(0, "El salario debe ser mayor a 0"),
  currency: z.string().default("USD"),
  work: z.array(z.string()).min(1, "Selecciona al menos una modalidad"),

  // Paso 3: Disponibilidad y Cultura
  availability: z.string().min(1, "Selecciona tu disponibilidad"),
  relocation: z.boolean().default(false),
  targetIndustries: z.array(z.string()).min(1, "Selecciona al menos una industria"),
});

export type TalentOnboardingFormData = z.infer<typeof talentOnboardingSchema>;
