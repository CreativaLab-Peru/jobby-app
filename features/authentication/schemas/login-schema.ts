import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z
    .string()
    .regex(EMAIL_REGEX, "Email inválido"),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
