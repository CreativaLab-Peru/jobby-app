import { z } from "zod";
import { CompanySeekingType, CompanyRole } from "@prisma/client";

export const companyIdentitySchema = z.object({
  name: z.string().min(2, "El nombre de la empresa es requerido"),
  logoUrl: z.union([z.string(), z.null(), z.undefined()]).default(""),
  ruc: z.union([z.string(), z.null(), z.undefined()]).default(""),
  website: z.union([z.string().url("URL inválida"), z.literal(""), z.null(), z.undefined()]).default(""),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color hexadecimal inválido").or(z.literal("")).default(""),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color hexadecimal inválido").or(z.literal("")).default(""),
});

export const companyPurposeSchema = z.object({
  seekingTypes: z.array(z.nativeEnum(CompanySeekingType)).min(1, "Selecciona al menos un objetivo"),
});

export const teamMemberSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.nativeEnum(CompanyRole),
});

export const companyTeamSchema = z.object({
  students: z.array(teamMemberSchema).default([]),
  generalMembers: z.array(teamMemberSchema).default([]),
});

export const companyOnboardingSchema = z.object({
  ...companyIdentitySchema.shape,
  ...companyPurposeSchema.shape,
  ...companyTeamSchema.shape,
});

export type CompanyOnboardingFormData = z.infer<typeof companyOnboardingSchema>;
