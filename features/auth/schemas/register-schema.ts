import { z } from "zod";

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres"),

    email: z
      .string()
      .min(2, "El email debe tener al menos 2 caracteres")
      .regex(EMAIL_REGEX, "Email inválido"),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),

    confirmPassword: z.string(),

    acceptedTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "Debes aceptar los términos y condiciones",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
        code: "custom"
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
