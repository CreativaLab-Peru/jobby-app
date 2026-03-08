"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createAdminUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(["USER", "ADMIN"]),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;

export type CreateAdminUserResult =
  | { success: true; data: { id: string }; message: string }
  | { success: false; error: string };

export const createAdminUser = async (
  input: CreateAdminUserInput
): Promise<CreateAdminUserResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const parsed = createAdminUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existing) {
      return { success: false, error: "Ya existe un usuario con ese email" };
    }

    const now = new Date();
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      select: { id: true },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      data: { id: user.id },
      message: "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("[ADMIN_CREATE_USER_ERROR]", error);
    return { success: false, error: "Error creando usuario" };
  }
};

