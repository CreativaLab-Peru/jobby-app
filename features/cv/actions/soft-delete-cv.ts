"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/features/share/actions/get-current-user"
import { revalidatePath } from "next/cache"

export async function softDeleteCv(cvId: string) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return {
        success: false,
        error: "Usuario no autenticado"
      }
    }

    // Verificar que el CV pertenece al usuario
    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      select: { userId: true }
    })

    if (!cv) {
      return {
        success: false,
        error: "CV no encontrado"
      }
    }

    if (cv.userId !== user.id) {
      return {
        success: false,
        error: "No tienes permiso para eliminar este CV"
      }
    }

    // Soft delete: establecer deletedAt a la fecha actual
    await prisma.cv.update({
      where: { id: cvId },
      data: {
        deletedAt: new Date()
      }
    })

    // Revalidar la página de CVs para que se actualice la lista
    revalidatePath("/cv")

    return {
      success: true,
      message: "CV ocultado exitosamente"
    }
  } catch (error) {
    console.error("Error al ocultar CV:", error)
    return {
      success: false,
      error: "Error al ocultar el CV"
    }
  }
}
