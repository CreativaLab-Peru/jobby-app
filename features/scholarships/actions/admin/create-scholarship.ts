"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/share/actions/require-admin";
import {
  scholarshipCreateSchema,
  type ScholarshipCreateInput,
} from "@/features/scholarships/schemas/scholarship.schema";

export interface CreateScholarshipFormState {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof ScholarshipCreateInput, string>>;
  data?: {
    id: string;
    name: string;
  };
}

const initialState: CreateScholarshipFormState = { success: false };

export async function createScholarshipAction(
  _prevState: CreateScholarshipFormState,
  formData: FormData
): Promise<CreateScholarshipFormState> {
  const admin = await requireAdmin();
  if (!admin.success) {
    return { ...initialState, message: admin.error };
  }

  // Parse requirements and benefits as JSON arrays
  const requirementsStr = formData.get("requirements") as string;
  const benefitsStr = formData.get("benefits") as string;

  let requirements: string[] = [];
  let benefits: string[] = [];

  try {
    if (requirementsStr) {
      requirements = JSON.parse(requirementsStr);
    }
  } catch {
    requirements = [];
  }

  try {
    if (benefitsStr) {
      benefits = JSON.parse(benefitsStr);
    }
  } catch {
    benefits = [];
  }

  const rawData = {
    countryId: formData.get("countryId") as string ?? "",
    name: formData.get("name") as string ?? "",
    type: formData.get("type") as string ?? "",
    requirements,
    benefits,
    deadline: formData.get("deadline") as string ?? "",
    url: formData.get("url") as string ?? "",
    isActive: formData.get("isActive") === "true",
  };

  const parsed = scholarshipCreateSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ScholarshipCreateInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0] as keyof ScholarshipCreateInput;
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
    // Verify country exists
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

    const scholarship = await prisma.scholarshipOpportunity.create({
      data: {
        countryId: parsed.data.countryId,
        name: parsed.data.name,
        type: parsed.data.type,
        requirements: parsed.data.requirements,
        benefits: parsed.data.benefits,
        deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
        url: parsed.data.url,
        isActive: parsed.data.isActive,
      },
    });

    revalidatePath("/admin/scholarships");

    return {
      success: true,
      message: "Beca creada exitosamente",
      data: {
        id: scholarship.id,
        name: scholarship.name,
      },
    };
  } catch (error) {
    console.error("[createScholarshipAction]", error);
    return {
      success: false,
      message: "Error al crear la beca",
    };
  }
}