"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export async function createInterviewSession(opportunityId: string, cvId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No autorizado");

  // 1. Obtener contexto de la oportunidad y CV
  const opp = await prisma.opportunity.findUnique({
    where: { id_cvId: { id: opportunityId, cvId } },
    include: { cv: { include: { sections: true } } }
  });

  if (!opp) throw new Error("Oportunidad no encontrada");

  // 2. Crear la sesión en PENDING
  const session = await prisma.interviewSession.create({
    data: {
      userId: user.id,
      opportunityId: opp.id,
      cvId: opp.cvId,
      status: "PENDING",
    }
  });

  // 3. Preparar contexto para Vapi
  return {
    sessionId: session.id,
    role: opp.title,
    company: opp.company || "Empresa",
    candidateName: user.name || "Candidato",
    technicalTopics: ["React", "Next.js"], // Aquí podrías filtrar de opp.requirements
    systemPrompt: `Eres un reclutador técnico de ${opp.company}. Evalúa a ${user.name} para el puesto de ${opp.title}.`
  };
}
