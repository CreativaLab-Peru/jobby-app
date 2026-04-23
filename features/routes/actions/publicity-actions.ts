"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getPublicitySuggestions = async () => {
  try {
    const suggestions = await prisma.routePublicitySuggestion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, suggestions };
  } catch (error) {
    console.error("[PUBLICITY] Error fetching suggestions:", error);
    return { success: false, message: "Error al cargar sugerencias.", suggestions: [] };
  }
};

export const getAllPublicitySuggestions = async () => {
  try {
    const suggestions = await prisma.routePublicitySuggestion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, suggestions };
  } catch (error) {
    console.error("[PUBLICITY] Error fetching all suggestions:", error);
    return { success: false, message: "Error al cargar sugerencias.", suggestions: [] };
  }
};

export const createPublicitySuggestion = async (data: {
  icon?: string;
  title: string;
  description?: string;
}) => {
  try {
    const suggestion = await prisma.routePublicitySuggestion.create({
      data: {
        title: data.title,
        icon: data.icon ?? null,
        description: data.description ?? null,
        isActive: true,
      },
    });
    revalidatePath("/admin/routes-publicity");
    revalidatePath("/routes/new");
    return { success: true, suggestion };
  } catch (error) {
    console.error("[PUBLICITY] Error creating suggestion:", error);
    return { success: false, message: "Error al crear la sugerencia." };
  }
};

export const updatePublicitySuggestion = async (
  id: string,
  data: {
    icon?: string;
    title: string;
    description?: string;
    isActive?: boolean;
  }
) => {
  try {
    const suggestion = await prisma.routePublicitySuggestion.update({
      where: { id },
      data: {
        title: data.title,
        icon: data.icon ?? null,
        description: data.description ?? null,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/admin/routes-publicity");
    revalidatePath("/routes/new");
    return { success: true, suggestion };
  } catch (error) {
    console.error("[PUBLICITY] Error updating suggestion:", error);
    return { success: false, message: "Error al actualizar la sugerencia." };
  }
};

export const deletePublicitySuggestion = async (id: string) => {
  try {
    await prisma.routePublicitySuggestion.delete({
      where: { id },
    });
    revalidatePath("/admin/routes-publicity");
    revalidatePath("/routes/new");
    return { success: true };
  } catch (error) {
    console.error("[PUBLICITY] Error deleting suggestion:", error);
    return { success: false, message: "Error al eliminar la sugerencia." };
  }
};
