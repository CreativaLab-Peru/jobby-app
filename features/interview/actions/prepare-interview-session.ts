"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

/**
 * PASO A: Crear la sesión y preparar el contexto para Vapi
 */
export async function prepareInterviewSession(opportunityId: string, cvId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autorizado");

  // 1. Obtener datos de la oportunidad y el CV vinculado
  const opp = await prisma.opportunity.findUnique({
    where: { id_cvId: { id: opportunityId, cvId } },
    include: { cv: true }
  });

  if (!opp) throw new Error("Oportunidad o CV no encontrados");

  // 2. Crear el registro en la DB (Estado PENDING)
  // Nota: Esto nos da el ID necesario para trackear la llamada luego
  const session = await prisma.interviewSession.create({
    data: {
      userId: user.id,
      opportunityId: opp.id,
      cvId: opp.cvId,
      status: "PENDING",
    }
  });

  // 3. Formatear el contexto que necesita el Hook de Vapi
  return {
    sessionId: session.id,
    role: opp.title,
    company: opp.company || "Empresa",
    candidateName: user.name || "Candidato",
    // Extraemos skills del JSON del CV si existe
    technicalTopics: (opp.cv.extractedJson as any)?.skills?.slice(0, 5).map((s: any) => s.name) || [],
    systemPrompt: `Eres un reclutador de ${opp.company}. Entrevistas para ${opp.title}. Usa un tono profesional.`
  };
}
