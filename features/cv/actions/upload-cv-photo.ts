"use server"

import { cloudinary } from "@/lib/cloudinary"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/features/share/actions/get-current-user"

const MAX_PHOTOS = 6

export async function uploadCvPhoto(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: "No autenticado" }

  // Verificar límite
  const count = await prisma.cvPhoto.count({ where: { userId: user.id } })
  if (count >= MAX_PHOTOS) {
    return {
      error: `Límite de ${MAX_PHOTOS} fotos alcanzado. Elimina alguna para subir una nueva.`,
    }
  }

  const file = formData.get("file") as File | null
  if (!file) return { error: "No se recibió ningún archivo" }

  // Validaciones
  if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Solo se permiten imágenes JPG, PNG o WebP" }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "La imagen no puede superar 5MB" }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `cv_photos/${user.id}`,
            transformation: [
              { width: 400, height: 400, crop: "limit" },
              { quality: "auto:good" },
            ],
          },
          (error, res) => {
            if (error || !res) return reject(error ?? new Error("Sin respuesta de Cloudinary"))
            resolve(res as { secure_url: string; public_id: string })
          }
        )
        .end(buffer)
    }
  )

  const photo = await prisma.cvPhoto.create({
    data: {
      userId: user.id,
      url: result.secure_url,
      publicId: result.public_id,
    },
  })

  return { photo }
}
