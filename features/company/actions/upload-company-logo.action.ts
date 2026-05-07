"use server";

import { cloudinary } from "@/lib/cloudinary";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export async function uploadCompanyLogoAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const folder = user ? `company_logos/${user.id}` : "company_logos/anonymous";

    const file = formData.get("file") as File | null;
    if (!file) return { error: "No se recibió ningún archivo" };

    // Validaciones
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      return { error: "Solo se permiten imágenes JPG, PNG o WebP" };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { error: "La imagen no puede superar 10MB" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              transformation: [
                { width: 500, height: 500, crop: "limit" },
                { quality: "auto:best" },
              ],
            },
            (error, res) => {
              if (error || !res) return reject(error ?? new Error("Sin respuesta de Cloudinary"));
              resolve(res as { secure_url: string; public_id: string });
            },
          )
          .end(buffer);
      },
    );

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error("[UPLOAD_COMPANY_LOGO_ERROR]", error);
    return { error: "Error al subir el logo" };
  }
}
