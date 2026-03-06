import { z } from "zod";

export const complaintSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/, "El nombre solo puede contener letras"),
  email: z
    .string()
    .trim()
    .email("Correo electrónico inválido")
    .max(200, "El correo es demasiado largo"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Teléfono inválido")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  complaint: z
    .string()
    .trim()
    .min(100, "El reclamo debe tener al menos 100 caracteres")
    .max(2000, "El reclamo no puede superar los 2000 caracteres"),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;
