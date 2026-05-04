"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { companyUpdateSchema, CompanyUpdateInput } from "@/features/company/schemas/company.schema";

export type UpdateAdminCompanyResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const updateAdminCompany = async (
  companyId: string,
  input: CompanyUpdateInput
): Promise<UpdateAdminCompanyResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const parsed = companyUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Check company exists
    const existing = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return { success: false, error: "Empresa no encontrada" };
    }

    // Check slug uniqueness if changed
    const newSlug = parsed.data.slug || parsed.data.name.toLowerCase().replace(/\s+/g, "-");
    if (newSlug.toLowerCase() !== existing.slug) {
      const slugTaken = await prisma.company.findFirst({
        where: {
          slug: newSlug.toLowerCase(),
          id: { not: companyId },
        },
        select: { id: true },
      });
      if (slugTaken) {
        return { success: false, error: "El slug ya está en uso" };
      }
    }

    await prisma.company.update({
      where: { id: companyId },
      data: {
        name: parsed.data.name,
        slug: newSlug.toLowerCase(),
        logoUrl: parsed.data.logoUrl || undefined,
        ruc: parsed.data.ruc || undefined,
        website: parsed.data.website || undefined,
        primaryColor: parsed.data.primaryColor || undefined,
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/companies");
    revalidatePath(`/admin/companies/${companyId}`);

    return { success: true, message: "Empresa actualizada exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_COMPANY_ERROR]", error);
    return { success: false, error: "Error actualizando empresa" };
  }
};

