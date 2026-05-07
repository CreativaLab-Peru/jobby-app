"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { getValueFromKey } from "@/features/share/actions/get-value-from-key";

const DEFAULT_INTERVIEW_DURATION_SECONDS = 180;

function parseInterviewDuration(value: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_INTERVIEW_DURATION_SECONDS;
}

/**
 * PASO A: Crear la sesión y preparar el contexto para Vapi
 */
export async function prepareInterviewSession(opportunityId: string, cvId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autorizado");

  // 1. Obtener datos de la oportunidad y el CV vinculado
  const opp = await prisma.opportunity.findUnique({
    where: { id_cvId: { id: opportunityId, cvId } },
    include: { cv: true },
  });

  if (!opp) throw new Error("Oportunidad o CV no encontrados");

  const durationValue = await getValueFromKey("INTERVIEW_DURATION");

  const durationSeconds =
    durationValue === null
      ? DEFAULT_INTERVIEW_DURATION_SECONDS
      : parseInterviewDuration(durationValue);

  const result = await prisma.$transaction(async (tx) => {
    const session = await tx.interviewSession.create({
      data: {
        userId: user.id,
        opportunityId: opp.id,
        cvId: opp.cvId,
        status: "PENDING",
      },
    });

    const attempt = await tx.interviewAttempt.create({
      data: {
        interviewSessionId: session.id,
        userId: user.id,
        plannedSeconds: durationSeconds,
      },
    });

    return { session, attempt };
  });

  const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

  // 3. Formatear el contexto que necesita el Hook de Vapi
  return {
    sessionId: result.session.id,
    attemptId: result.attempt.id,
    durationSeconds,
    role: opp.title,
    company: opp.company || "Empresa",
    candidateName: user.name || "Candidato",
    // Extraemos skills del JSON del CV si existe
    technicalTopics:
      (opp.cv.extractedJson as any)?.skills?.slice(0, 5).map((s: any) => s.name) || [],
    systemPrompt: `Eres un reclutador de ${opp.company}. Entrevistas para ${opp.title}. Usa un tono profesional. La duración máxima de la entrevista es de ${durationMinutes} minutos.`,
  };
}
