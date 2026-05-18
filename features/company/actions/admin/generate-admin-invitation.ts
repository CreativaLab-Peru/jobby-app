"use server";

import { revalidatePath } from "next/cache";
import { CompanyRole } from "@prisma/client";

import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { companyInvitationCreateSchema } from "@/features/company/schemas/company-invitation.schema";
import {
  createInvitationCandidate,
  persistInvitationCandidate,
  sendCompanyInvitationEmail,
} from "@/features/company/services/company-invitation.service";
import {
  CreateCompanyInvitationState
} from "@/features/company/actions/create-company-invitation.action";

// Definimos el input esperado
export interface ResendInvitationInput {
  email: string;
  companyId: string;
}

export const createCompanyInvitationAction = async (
  { email, companyId }: ResendInvitationInput
): Promise<CreateCompanyInvitationState> => {
  try {
    console.log("[email]", {
      email,
      companyId: companyId,
    })
    // 1. Verificación de permisos
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    // 2. Validación manual de los datos recibidos
    // Usamos .pick para validar solo email y companyId si el schema original tiene más campos
    const parsed = companyInvitationCreateSchema.pick({ email: true, companyId: true }).safeParse({
      email,
      companyId,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: "Los datos proporcionados no son válidos",
      };
    }

    // 3. Lógica de negocio
    // Nota: He asignado CompanyRole.MEMBER por defecto, ajusta según tu necesidad
    const candidate = await createInvitationCandidate({
      companyId: parsed.data.companyId,
      email: parsed.data.email,
      role: CompanyRole.ENCARGADO,
    });

    const saved = await persistInvitationCandidate(candidate, admin.user.id);
    await sendCompanyInvitationEmail(candidate);

    // 4. Revalidación de rutas
    revalidatePath(routes.app.admin.companies.root);

    return {
      success: true,
      message: "Invitación reenviada correctamente",
      invitation: {
        id: saved.id,
        token: saved.token,
        email: candidate.email,
        role: candidate.role,
        expiresAt: candidate.expiresAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("[RESEND_INVITATION_ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al procesar la invitación",
    };
  }
};
