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
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo electrónico inválido"),
  // Contraseñas opcionales para usuarios OAuth
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .optional()
    .or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
  opportunityType: z.array(z.string()).min(1, "Selecciona al menos un tipo de oportunidad"),
});

// 2. Esquema Final (Con refinamientos para el registro final)
export const talentOnboardingSchema = talentOnboardingBaseSchema.refine(
  (data) => {
    // Si hay contraseña, debe coincidir con confirmPassword
    if (data.password && data.password.length > 0) {
      return data.password === data.confirmPassword;
    }
    // Si no hay contraseña (usuario OAuth), es válido
    return true;
  },
  {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  },

);

export type TalentOnboardingFormData = z.infer<typeof talentOnboardingSchema>;
