import { z } from "zod";

export const companyCreateSchema = z.object({
  name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  slug: z
    .string()
    .trim()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(80, "El slug es demasiado largo")
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .trim()
    .url("Ingresa una URL válida para el logo")
    .optional()
    .or(z.literal("")),
  ruc: z
    .string()
    .trim()
    .max(32, "El RUC es demasiado largo")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("Ingresa una URL válida para el sitio web")
    .optional()
    .or(z.literal("")),
  primaryColor: z
    .string()
    .trim()
    .max(32, "El color principal es demasiado largo")
    .optional()
    .or(z.literal("")),
});

export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;

