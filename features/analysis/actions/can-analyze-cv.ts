"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { getLimitPlanOfCurrentUser } from "@/features/billing/actions/get-count-availables-attempts";
import { JobStatus } from "@prisma/client";

export type CanAnalyzeResult = {
  canAnalyze: boolean;
  reason?: string;
  code?: AnalyzeErrorCode;
};

export type AnalyzeErrorCode = 
  | "NO_TOKENS"
  | "NO_CHANGES"
  | "IN_PROGRESS"
  | "CV_NOT_FOUND"
  | "USER_NOT_FOUND";

/**
 * Validates if a CV can be analyzed based on:
 * 1. User has available analysis tokens
 * 2. CV exists and belongs to user
 * 3. CV has been edited since last successful analysis (or never analyzed)
 * 4. No analysis is currently in progress for this CV
 */
export async function canAnalyzeCv(cvId: string): Promise<CanAnalyzeResult> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { 
        canAnalyze: false, 
        reason: "Usuario no encontrado.", 
        code: "USER_NOT_FOUND" 
      };
    }

    // 1. Check if user has available analysis tokens
    const limitOfPlan = await getLimitPlanOfCurrentUser();
    if (!limitOfPlan) {
      return { 
        canAnalyze: false, 
        reason: "No se pudo obtener información del plan.", 
        code: "NO_TOKENS" 
      };
    }

    const tokensUsed = limitOfPlan.scoreAnalysis.used;
    const tokensTotal = limitOfPlan.scoreAnalysis.total;
    
    if (tokensUsed >= tokensTotal) {
      return { 
        canAnalyze: false, 
        reason: "No tienes tokens de análisis disponibles. Mejora tu plan para obtener más.", 
        code: "NO_TOKENS" 
      };
    }

    // 2. Check if CV exists and get its data
    const cv = await prisma.cv.findFirst({
      where: { 
        id: cvId, 
        userId: currentUser.id,
        deletedAt: null 
      },
      include: {
        evaluations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!cv) {
      return { 
        canAnalyze: false, 
        reason: "CV no encontrado.", 
        code: "CV_NOT_FOUND" 
      };
    }

    const lastEvaluation = cv.evaluations[0];

    // 3. If there's no previous evaluation, allow analysis
    if (!lastEvaluation) {
      return { canAnalyze: true };
    }

    // 4. Check if analysis is in progress
    if (lastEvaluation.status === JobStatus.IN_PROGRESS || lastEvaluation.status === JobStatus.PENDING) {
      return { 
        canAnalyze: false, 
        reason: "Ya hay un análisis en progreso para este CV.", 
        code: "IN_PROGRESS" 
      };
    }

    // All checks passed - allow analysis if user has tokens
    return { canAnalyze: true, reason: undefined, code: undefined };

  } catch (error) {
    console.error("[CAN_ANALYZE_CV_ERROR]", error);
    return { 
      canAnalyze: false, 
      reason: "Error al verificar elegibilidad del análisis.", 
      code: "USER_NOT_FOUND" 
    };
  }
}

/**
 * Gets remaining analysis tokens for the current user
 */
export async function getRemainingAnalysisTokens(): Promise<number> {
  try {
    const limitOfPlan = await getLimitPlanOfCurrentUser();
    if (!limitOfPlan) return 0;
    
    return Math.max(0, limitOfPlan.scoreAnalysis.total - limitOfPlan.scoreAnalysis.used);
  } catch {
    return 0;
  }
}
