"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export type FinishInterviewAttemptResult =
  | { success: true; message: string }
  | { success: false; error: string };

interface FinishInterviewAttemptInput {
  attemptId: string;
  sessionId: string;
  secondsUsed: number;
  reason?: string | null;
}

export async function finishInterviewAttempt(
  input: FinishInterviewAttemptInput,
): Promise<FinishInterviewAttemptResult> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autorizado" };
    }

    const attempt = await prisma.interviewAttempt.findUnique({
      where: { id: input.attemptId },
      select: {
        id: true,
        userId: true,
        interviewSessionId: true,
        secondsUsed: true,
        finishedAt: true,
        plannedSeconds: true,
      },
    });

    if (!attempt) {
      return { success: false, error: "Intento no encontrado" };
    }

    if (attempt.userId !== currentUser.id) {
      return { success: false, error: "No autorizado" };
    }

    if (attempt.interviewSessionId !== input.sessionId) {
      return { success: false, error: "Intento no coincide con la sesión" };
    }

    if (attempt.finishedAt) {
      return { success: true, message: "Intento ya finalizado" };
    }

    const secondsUsed = Math.max(
      0,
      Math.min(Math.round(input.secondsUsed || 0), attempt.plannedSeconds),
    );

    await prisma.interviewAttempt.update({
      where: { id: attempt.id },
      data: {
        secondsUsed,
        finishedAt: new Date(),
        finishReason: input.reason?.trim() || null,
      },
    });

    return { success: true, message: "Intento registrado" };
  } catch (error) {
    console.error("[FINISH_INTERVIEW_ATTEMPT_ERROR]", error);
    return { success: false, error: "Error al registrar el tiempo de la entrevista" };
  }
}
