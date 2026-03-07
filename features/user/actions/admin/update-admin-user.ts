"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateAdminUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(["USER", "ADMIN"]),
  isBlocked: z.boolean(),
});

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;

export type UpdateAdminUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

export const updateAdminUser = async (
  userId: string,
  input: UpdateAdminUserInput
): Promise<UpdateAdminUserResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const parsed = updateAdminUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Check user exists
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!existing) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Check email uniqueness if changed
    if (parsed.data.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        select: { id: true },
      });
      if (emailTaken) {
        return { success: false, error: "Ya existe un usuario con ese email" };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        isBlocked: parsed.data.isBlocked,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return { success: true, message: "Usuario actualizado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_USER_ERROR]", error);
    return { success: false, error: "Error actualizando usuario" };
  }
};

