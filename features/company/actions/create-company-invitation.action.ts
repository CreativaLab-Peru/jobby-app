"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CompanyRole } from "@prisma/client";

import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import {
  companyInvitationCreateSchema,
} from "@/features/company/schemas/company-invitation.schema";
import {
  createInvitationCandidate,
  persistInvitationCandidate,
  sendCompanyInvitationEmail,
} from "@/features/company/services/company-invitation.service";

type CompanyInvitationCreateInput = z.infer<typeof companyInvitationCreateSchema>;

export type CreateCompanyInvitationState =
  | {
      success: true;
      message: string;
      invitation: {
        id: string;
        token: string;
        email: string;
        role: CompanyRole;
        expiresAt: string;
      };
      fieldErrors?: Partial<Record<keyof CompanyInvitationCreateInput, string>>;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<keyof CompanyInvitationCreateInput, string>>;
    };

const parseFieldErrors = (issues: z.ZodIssue[]) => {
  const fieldErrors: Partial<Record<keyof CompanyInvitationCreateInput, string>> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key as keyof CompanyInvitationCreateInput]) {
      fieldErrors[key as keyof CompanyInvitationCreateInput] = issue.message;
    }
  }

  return fieldErrors;
};

export const createCompanyInvitationAction = async (
  _prevState: CreateCompanyInvitationState,
  formData: FormData,
): Promise<CreateCompanyInvitationState> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const parsed = companyInvitationCreateSchema.safeParse({
      companyId: formData.get("companyId"),
      email: formData.get("email"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: "Revisa los campos marcados",
        fieldErrors: parseFieldErrors(parsed.error.issues as any),
      };
    }

    const candidate = await createInvitationCandidate({
      companyId: parsed.data.companyId,
      email: parsed.data.email,
      role: parsed.data.role,
    });

    const saved = await persistInvitationCandidate(candidate, admin.user.id);
    await sendCompanyInvitationEmail(candidate);

    revalidatePath(routes.app.admin.companies.root);
    revalidatePath(`${routes.app.admin.companies.root}/${candidate.companyId}/invitations`);

    return {
      success: true,
      message: "Invitación enviada correctamente",
      invitation: {
        id: saved.id,
        token: saved.token,
        email: candidate.email,
        role: candidate.role,
        expiresAt: candidate.expiresAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("[CREATE_COMPANY_INVITATION_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "No pudimos crear la invitación",
    };
  }
};

