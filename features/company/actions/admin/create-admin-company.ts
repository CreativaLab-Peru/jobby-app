"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { companyCreateSchema, CompanyCreateInput } from "@/features/company/schemas/company.schema";

export type CreateAdminCompanyResult =
  | { success: true; message: string; companyId: string }
  | { success: false; error: string };

export const createAdminCompany = async (
  input: CompanyCreateInput
): Promise<CreateAdminCompanyResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const parsed = companyCreateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Generate slug if not provided
    let slug = parsed.data.slug || parsed.data.name.toLowerCase().replace(/\s+/g, "-");

    // Check slug uniqueness
    const existingSlug = await prisma.company.findFirst({
      where: { slug: slug.toLowerCase() },
      select: { id: true },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya está en uso" };
    }

    const company = await prisma.company.create({
      data: {
        name: parsed.data.name,
        slug: slug.toLowerCase(),
        logoUrl: parsed.data.logoUrl || undefined,
        ruc: parsed.data.ruc || undefined,
        website: parsed.data.website || undefined,
        primaryColor: parsed.data.primaryColor || undefined,
        isActive: true,
        onboardingStep: "STEP_1",
      },
    });

    revalidatePath("/admin/companies");

    return {
      success: true,
      message: "Empresa creada exitosamente",
      companyId: company.id,
    };
  } catch (error) {
    console.error("[ADMIN_CREATE_COMPANY_ERROR]", error);
    return { success: false, error: "Error creando empresa" };
  }
};

