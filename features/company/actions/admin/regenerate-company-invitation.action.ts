"use server";

import { revalidatePath } from "next/cache";
import { CompanyRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { createInvitationCandidate } from "@/features/company/services/company-invitation.service";

export interface RegenerateInvitationState {
  success: boolean;
  error?: string;
  newToken?: string;
}

export const regenerateCompanyInvitationAction = async (
  invitationId: string
): Promise<RegenerateInvitationState> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) return { success: false, error: admin.error };

    // 1. Obtener datos actuales
    const existing = await prisma.companyInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!existing) return { success: false, error: "Invitación no encontrada" };
    if (existing.status === "ACCEPTED") return { success: false, error: "No se puede regenerar una invitación ya aceptada" };

    // 2. Generar nuevos valores (token, code, hash) usando tu lógica de candidato
    const candidate = await createInvitationCandidate({
      companyId: existing.companyId,
      email: existing.email,
      role: existing.role as CompanyRole,
    });

    // 3. Actualizar la invitación existente con los nuevos valores
    // Nota: Esto invalida el token anterior inmediatamente
    const updated = await prisma.companyInvitation.update({
      where: { id: invitationId },
      data: {
        token: candidate.token,
        code: candidate.code,
        codeHash: candidate.codeHash,
        expiresAt: candidate.expiresAt,
        status: "PENDING", // Lo reseteamos a pendiente si estaba expirado
        lastSentAt: null,   // Reseteamos el contador de envíos
      },
    });

    revalidatePath(routes.app.admin.companies.root);

    return {
      success: true,
      newToken: updated.token
    };
  } catch (error) {
    console.error("[REGENERATE_INVITATION_ERROR]", error);
    return { success: false, error: "Error al regenerar el enlace" };
  }
};
