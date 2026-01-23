import { z } from "zod";

export const talentOnboardingBaseSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  birthDate: z.string().optional(),
  country: z.string().min(1, "El país es requerido"),
  targetIndustries: z.array(z.string()).min(1, "Selecciona al menos una industria"),
  preferredRoles: z.array(z.string()).min(1, "Selecciona al menos un rol"),
  expLevel: z.string().min(1, "Selecciona tu nivel de experiencia"),
  workModality: z.array(z.string()).min(1, "Selecciona al menos una modalidad"),
  relocation: z.boolean().default(false),
  availability: z.array(z.string()).min(1, "Selecciona disponibilidad"),
  skills: z.array(z.object({
    name: z.string(),
    level: z.enum(['Intermedio', 'Avanzado'])
  })).min(3, "Agrega al menos 3 habilidades"),
  portfolioUrl: z.string().optional().or(z.literal("")),
  minSalary: z.coerce.number().min(0).optional(),
  currency: z.enum(['PEN', 'USD']).default('USD'),
  work: z.enum(['Remoto', 'Presencial', 'Híbrido']).optional(),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
  acceptedTerms: z.boolean().default(false),
});

// 2. Esquema Final (Con refinamientos para el registro final)
export const talentOnboardingSchema = talentOnboardingBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  }
);

export type TalentOnboardingFormData = z.infer<typeof talentOnboardingSchema>;
