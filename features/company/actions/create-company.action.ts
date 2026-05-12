"use server";

import { revalidatePath } from "next/cache";


import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { requireAdmin } from "@/features/share/actions/require-admin";
import {
  companyCreateSchema,
  type CompanyCreateInput,
} from "@/features/company/schemas/company-create.schema";
import {
  ensureUniqueSlug,
  normalizeOptional,
  parseFieldErrors,
  slugify
} from "@/features/company/actions/_utils";

export interface CompanyCreateFormState {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof CompanyCreateInput, string>>;
  company?: {
    id: string;
    name: string;
    slug: string;
    joinUrl: string;
    logoUrl?: string | null;
    ruc?: string | null;
    website?: string | null;
    primaryColor?: string | null;
  };
}

const initialState: CompanyCreateFormState = {
  success: false,
};

export const createCompanyAction = async (
  _prevState: CompanyCreateFormState,
  formData: FormData,
): Promise<CompanyCreateFormState> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { ...initialState, message: admin.error };
    }

    const parsed = companyCreateSchema.safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      logoUrl: normalizeOptional(formData.get("logoUrl")),
      ruc: normalizeOptional(formData.get("ruc")),
      website: normalizeOptional(formData.get("website")),
      primaryColor: normalizeOptional(formData.get("primaryColor")),
    });

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parseFieldErrors(parsed.error.issues),
        message: "Revisa los campos marcados",
      };
    }

    const normalizedName = parsed.data.name.trim();
    const slugBase = slugify(parsed.data.slug?.trim() || normalizedName);
    const slug = await ensureUniqueSlug(slugBase);

    const company = await prisma.company.create({
      data: {
        name: normalizedName,
        slug,
        logoUrl: parsed.data.logoUrl?.trim() || null,
        ruc: parsed.data.ruc?.trim() || null,
        website: parsed.data.website?.trim() || null,
        primaryColor: parsed.data.primaryColor?.trim() || null,
        preference: {
          create: {
            seekingTypes: [],
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        ruc: true,
        website: true,
        primaryColor: true,
      },
    });

    revalidatePath(routes.app.admin.companies.new);

    return {
      success: true,
      message: "Empresa agregada correctamente",
      company: {
        ...company,
        joinUrl: routes.website.joinCompany(company.slug),
      },
    };
  } catch (error) {
    console.error("[CREATE_COMPANY_ERROR]", error);
    return {
      success: false,
      message: "No pudimos crear la empresa. Intenta otra vez.",
    };
  }
};
