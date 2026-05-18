"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { companyCreateSchema } from "@/features/company/schemas/company-create.schema";
import { CompanyCreateFormState} from "./create-company.action";
import {
  ensureUniqueSlug,
  normalizeOptional,
  parseFieldErrors,
  slugify
} from "@/features/company/actions/_utils";

export const updateCompanyAction = async (
  _prevState: CompanyCreateFormState,
  formData: FormData,
): Promise<CompanyCreateFormState> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) return { success: false, message: admin.error };

    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "ID de empresa no proporcionado" };

    const parsed = companyCreateSchema.safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      logoUrl: normalizeOptional(formData.get("logoUrl")),
      ruc: normalizeOptional(formData.get("ruc")),
      website: normalizeOptional(formData.get("website")),
      primaryColor: normalizeOptional(formData.get("primaryColor")),
      // Asegúrate de agregar secondaryColor a tu Zod schema o acéptalo aquí directamente
      secondaryColor: normalizeOptional(formData.get("secondaryColor")),
    });

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: parseFieldErrors(parsed.error.issues),
        message: "Revisa los campos marcados",
      };
    }

    // Lógica de Slug: Solo verificar si cambió
    const currentCompany = await prisma.company.findUnique({ where: { id }, select: { slug: true } });
    let slug = currentCompany?.slug;

    const newSlugBase = slugify(formData.get("slug") as string || parsed.data.name);
    if (newSlugBase !== currentCompany?.slug) {
      slug = await ensureUniqueSlug(newSlugBase);
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: parsed.data.name.trim(),
        slug: slug!,
        logoUrl: parsed.data.logoUrl?.trim() || null,
        ruc: parsed.data.ruc?.trim() || null,
        website: parsed.data.website?.trim() || null,
        primaryColor: parsed.data.primaryColor?.trim() || null,
        secondaryColor: (formData.get("secondaryColor") as string) || null,
        isActive: formData.get("isActive") === "true",
      },
    });

    revalidatePath(routes.app.admin.companies.root); // Revalida la lista
    revalidatePath(`/admin/companies/${id}`); // Revalida la edición

    return {
      success: true,
      message: "Empresa actualizada correctamente",
      company: {
        ...company,
        joinUrl: routes.website.joinCompany(company.slug),
      },
    };
  } catch (error) {
    console.error("[UPDATE_COMPANY_ERROR]", error);
    return { success: false, message: "Error al actualizar la empresa." };
  }
};
