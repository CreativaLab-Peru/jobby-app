"use server";

import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { CreditBalanceType, Language, CvSectionType, RouteStatus } from "@prisma/client";
import { savePdf } from "@/features/upload-cv/actions/save-pdf";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { detectCv } from "@/features/cv/actions/verify-cv";
import { getTextFromPdfApi } from "@/utils/get-text-from-pdf-api";
import { inngest } from "@/inngest/functions/client";
import { revalidatePath } from "next/cache";

export async function createCvFromPdfAction(formData: FormData) {
  try {
    // 1. Extracción y validación básica de inputs
    const file = formData.get("pdf") as File;
    const title = (formData.get("title") as string) || file?.name;
    const cvType = formData.get("cvType") as any;
    const opportunityType = formData.get("opportunityType") as any;
    const templateId = (formData.get("templateId") as string) || "harvard";

    // Parseamos las secciones que vienen del selector
    const sectionsRaw = formData.get("sections") as string;
    const selectedSections: CvSectionType[] = JSON.parse(sectionsRaw || "[]");

    if (!file) return { error: "Archivo PDF necesario." };

    // 2. Auth Check
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: "Usuario no encontrado." };

    // 3. Verificación de créditos (MANAGE_CVS)
    const creditBalance = await prisma.userCreditBalance.findUnique({
      where: { userId_type: { userId: currentUser.id, type: CreditBalanceType.MANAGE_CVS } },
    });

    if (!creditBalance || creditBalance.amount <= 0) {
      return { error: "Créditos insuficientes para crear un nuevo CV." };
    }

    // 4. Persistencia del archivo PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `CV-${uuidv4()}-${file.name}`;
    const { error: uploadError, url } = await savePdf(file, { buffer, fileName });

    if (uploadError) return { error: uploadError };

    // 5. Validación de contenido (¿Es un CV?)
    const textFromPdf = await getTextFromPdfApi(url);
    const detection = detectCv(textFromPdf);
    if (!detection.isCv) {
      return { error: "El archivo no parece ser un CV válido." };
    }

    // 6. Creación Atómica del CV y sus Secciones
    // Usamos una transacción o creación anidada para asegurar integridad
    const cv = await prisma.cv.create({
      data: {
        userId: currentUser.id,
        language: Language.ES,
        opportunityType,
        cvType,
        title,
        templateId,
        // Creamos las secciones marcadas como visibles e inicializamos el orden
        sections: {
          create: selectedSections.map((type, index) => ({
            sectionType: type,
            isVisible: true,
            order: index,
            title: "", // Se llenará vía IA en Inngest
            contentJson: {},
          })),
        },
        attachments: {
          create: {
            filename: file.name,
            mimeType: file.type,
            url,
            size: file.size,
          },
        },
      },
    });

    // 7. Disparar procesamiento asíncrono
    await inngest.send({
      name: "cv/uploaded",
      data: {
        cvId: cv.id,
        attachmentUrl: url,
        userId: currentUser.id,
        // Pasamos las secciones elegidas para que la IA sepa qué extraer prioritariamente
        targetSections: selectedSections,
      },
    });

    revalidatePath("/dashboard"); // O la ruta donde listes los CVs

    // 8. Vincular a la ruta activa y actualizar progreso
    const activeRoute = await prisma.route.findFirst({
      where: { userId: currentUser.id, isActive: true, cvId: null },
    });

    if (activeRoute) {
      await prisma.route.update({
        where: { id: activeRoute.id },
        data: {
          cvId: cv.id,
          status: RouteStatus.CV_CREATED,
        },
      });
    }

    return { success: true, cvId: cv.id, cvUrl: url };
  } catch (err) {
    console.error("[ERROR_CREATE_CV_FROM_PDF]", err);
    return { error: "No se pudo agregar tu CV" };
  }
}
