"use server"

import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

interface UploadCvPhotoResult {
  success: boolean
  url?: string
  message?: string
}

export async function uploadCvPhoto(formData: FormData): Promise<UploadCvPhotoResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { success: false, message: "No autenticado" }
    }

    const file = formData.get("file") as File | null
    if (!file) {
      return { success: false, message: "No se recibió ningún archivo" }
    }

    // Validar tipo
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      return { success: false, message: "Solo se permiten imágenes JPG, PNG o WebP" }
    }

    // Validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, message: "La imagen no puede superar 2MB" }
    }

    const ext = file.name.split(".").pop() ?? "jpg"
    const filename = `cv-photos/${session.user.id}/${Date.now()}.${ext}`

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading CV photo:", error)
    return { success: false, message: "Error al subir la foto" }
  }
}
