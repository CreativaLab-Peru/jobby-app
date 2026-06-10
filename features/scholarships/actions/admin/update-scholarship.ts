"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/share/actions/require-admin";
import {
  scholarshipUpdateSchema,
  type ScholarshipUpdateInput,
} from "@/features/scholarships/schemas/scholarship.schema";

export interface UpdateScholarshipFormState {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof ScholarshipUpdateInput, string>>;
}

const initialState: UpdateScholarshipFormState = { success: false };

export async function updateScholarshipAction(
  scholarshipId: string,
  _prevState: UpdateScholarshipFormState,
  formData: FormData
): Promise<UpdateScholarshipFormState> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { ...initialState, message: admin.error };
  }

  // Parse requirements and benefits as JSON arrays
  const requirementsStr = formData.get("requirements") as string;
  const benefitsStr = formData.get("benefits") as string;

  let requirements: string[] | undefined;
  let benefits: string[] | undefined;

  try {
    if (requirementsStr) {
      requirements = JSON.parse(requirementsStr);
    }
  } catch {
    // ignore parse errors
  }

  try {
    if (benefitsStr) {
      benefits = JSON.parse(benefitsStr);
    }
  } catch {
    // ignore parse errors
  }

  const rawData = {
    countryId: formData.get("countryId") as string | undefined,
    name: formData.get("name") as string | undefined,
    type: formData.get("type") as string | undefined,
    requirements,
    benefits,
    deadline:
      formData.get("deadline") === ""
        ? undefined
        : (formData.get("deadline") as string | undefined),
    url: formData.get("url") as string | undefined,
    isActive: formData.get("isActive") === "true" ? true : formData.get("isActive") === "false" ? false : undefined,
  };

  const parsed = scholarshipUpdateSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ScholarshipUpdateInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0] as keyof ScholarshipUpdateInput;
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return {
      success: false,
      fieldErrors,
      message: "Revisa los campos marcados",
    };
  }

  try {
    // Check if scholarship exists
    const existing = await prisma.scholarshipOpportunity.findUnique({
      where: { id: scholarshipId },
    });

    if (!existing) {
      return { success: false, message: "Beca no encontrada" };
    }

    // Verify country if being changed
    if (parsed.data.countryId) {
      const country = await prisma.country.findUnique({
        where: { id: parsed.data.countryId },
      });

      if (!country) {
        return {
          success: false,
          fieldErrors: { countryId: "País no encontrado" },
          message: "El país seleccionado no existe",
        };
      }
    }

    await prisma.scholarshipOpportunity.update({
      where: { id: scholarshipId },
      data: {
        countryId: parsed.data.countryId ?? existing.countryId,
        name: parsed.data.name ?? existing.name,
        type: parsed.data.type ?? existing.type,
        requirements: parsed.data.requirements ?? existing.requirements,
        benefits: parsed.data.benefits ?? existing.benefits,
        deadline: parsed.data.deadline !== undefined
          ? parsed.data.deadline
            ? new Date(parsed.data.deadline)
            : null
          : existing.deadline,
        url: parsed.data.url ?? existing.url,
        isActive: parsed.data.isActive ?? existing.isActive,
      },
    });

    revalidatePath("/admin/scholarships");
    revalidatePath(`/admin/scholarships/${scholarshipId}`);

    return {
      success: true,
      message: "Beca actualizada exitosamente",
    };
  } catch (error) {
    console.error("[updateScholarshipAction]", error);
    return {
      success: false,
      message: "Error al actualizar la beca",
    };
  }
}