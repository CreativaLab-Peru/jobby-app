"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";

export type DeleteAdminUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const deleteAdminUser = async (
  userId: string
): Promise<DeleteAdminUserResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    // Prevent self-deletion
    if (admin.user.id === userId) {
      return { success: false, error: "No puedes eliminar tu propia cuenta" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Delete user and all related data (cascading)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");

    return { success: true, message: "Usuario eliminado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_DELETE_USER_ERROR]", error);
    return { success: false, error: "Error eliminando usuario" };
  }
};

