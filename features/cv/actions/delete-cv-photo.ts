"use server"

import { cloudinary } from "@/lib/cloudinary"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/features/share/actions/get-current-user"

export async function deleteCvPhoto(photoId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "No autenticado" }

  // Verificar que la foto le pertenece al usuario
  const photo = await prisma.cvPhoto.findUnique({ where: { id: photoId } })
  if (!photo) return { error: "Foto no encontrada" }
  if (photo.userId !== user.id) return { error: "No autorizado" }

  // Eliminar de Cloudinary
  await cloudinary.uploader.destroy(photo.publicId)

  // Eliminar de la BD
  await prisma.cvPhoto.delete({ where: { id: photoId } })

  return { success: true }
}
