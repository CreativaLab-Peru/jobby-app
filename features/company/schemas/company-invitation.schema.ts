import { z } from "zod";

export const companyInvitationRoleSchema = z.enum([
  "ADMIN",
  "ENCARGADO",
  "SUB_ENCARGADO",
  "MIEMBRO",
]);

export const companyInvitationCreateSchema = z.object({
  companyId: z.string().uuid("La empresa no es válida"),
  email: z.string().email("Ingresa un email válido"),
});

export const companyInvitationAcceptSchema = z.object({
  token: z.string().min(8, "El enlace no es válido"),
  email: z.string().email("Ingresa un email válido"),
  code: z
    .string()
    .regex(/^\d{6}$/, "El código debe tener 6 dígitos"),
});


