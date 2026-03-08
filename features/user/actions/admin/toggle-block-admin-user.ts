"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type ToggleBlockUserResult =
  | { success: true; message: string; isBlocked: boolean }
  | { success: false; error: string };

export const toggleBlockAdminUser = async (
  userId: string
): Promise<ToggleBlockUserResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    // Prevent self-blocking
    if (admin.user.id === userId) {
      return { success: false, error: "No puedes bloquear tu propia cuenta" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isBlocked: true },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const newBlockedState = !user.isBlocked;

    await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: newBlockedState,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      message: newBlockedState
        ? "Usuario bloqueado exitosamente"
        : "Usuario desbloqueado exitosamente",
      isBlocked: newBlockedState,
    };
  } catch (error) {
    console.error("[ADMIN_TOGGLE_BLOCK_USER_ERROR]", error);
    return { success: false, error: "Error actualizando estado del usuario" };
  }
};

