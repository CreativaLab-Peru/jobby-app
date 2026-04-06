'use server'

import {inngest} from "@/inngest/functions/client";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {JobStatus, OpportunityType} from "@prisma/client";
import {randomUUID} from "crypto";

export async function promoteTempAnalysisAction({
                                                  tempCvEvaluationId,
                                                  temporalUserId,
                                                }: {
  tempCvEvaluationId: string;
  temporalUserId: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {success: false, error: "Usuario no autenticado."};
    }

    // 1. Buscar si ya existe un CV o un proceso activo para este usuario
    const existingJob = await prisma.queueJob.findFirst({
      where: {
        userId: currentUser.id,
        type: 'PROMOTE_TEMP_ANALYSIS',
      },
      orderBy: {createdAt: 'desc'} // Obtenemos el más reciente
    });
    // Caso A: El proceso ya tuvo éxito o está en curso
    if (existingJob) {
      if (existingJob.status === JobStatus.SUCCEEDED ||
        existingJob.status === JobStatus.IN_PROGRESS ||
        existingJob.status === JobStatus.PENDING) {

        return {success: true, cvId: existingJob.cvId};
      }

      // Caso B: Si falló, procedemos a crear uno nuevo (limpieza lógica)
      if (existingJob.status === JobStatus.FAILED) {
        console.warn(`[PROMOTE_TEMP_ANALYSIS]: Proceso previo fallido para userId=${currentUser.id}. Creando uno nuevo.`);
        return {success: false, error: "Fallo el analisis."};
      }
    }

    if (!existingJob.cvId) {
      console.warn(`[PROMOTE_TEMP_ANALYSIS]: Job existente sin cvId para userId=${currentUser.id}, jobId=${existingJob.id}.`);
      return {
        success: false,
        error: "Se encontró un proceso previo incompleto. Intenta nuevamente."
      };
    }

    // 2. Transacción Atómica: Crear CV + Crear Job de Seguimiento
    const result = await prisma.$transaction(async (tx) => {
      // Verificamos una última vez dentro de la transacción si ya se creó un CV
      // para evitar condiciones de carrera (Race Conditions)
      // const duplicateCv = await tx.cv.findFirst({
      //   where: { userId: currentUser.id }
      // });
      //
      // if (duplicateCv) return { newCv: duplicateCv, createNewJob: null };

      const cv = await tx.cv.create({
        data: {
          userId: currentUser.id,
          title: `Mi primer CV`, // Ajustado a tu nuevo enfoque de becas/intercambios
          language: "ES",
          opportunityType: OpportunityType.SCHOLARSHIP,
          status: JobStatus.PENDING,
        },
      });

      const job = await tx.queueJob.create({
        data: {
          jobId: randomUUID(),
          userId: currentUser.id,
          type: "PROMOTE_TEMP_ANALYSIS",
          status: JobStatus.PENDING,
          cvId: cv.id,
          payload: {
            tempCvEvaluationId,
            temporalUserId,
            currentUserId: currentUser.id
          },
        }
      });

      return {newCv: cv, createNewJob: job};
    });

    const {newCv, createNewJob} = result;

    // 3. Disparo de Inngest (Solo si se creó un Job nuevo)
    if (createNewJob) {
      await inngest.send({
        name: "cv/migrate-temporary",
        data: {
          tempCvEvaluationId,
          temporalUserId,
          userId: currentUser.id,
          cvId: newCv.id,
          jobId: createNewJob.id,
        },
      });
    }

    return {success: true, cvId: newCv.id};

  } catch (error) {
    console.error("[PROMOTE_ACTION_ERROR]:", error);
    return {success: false, error: "No se pudo iniciar la migración de tu perfil."};
  }
}
