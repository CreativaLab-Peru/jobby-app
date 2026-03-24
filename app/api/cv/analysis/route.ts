import { inngest } from "@/inngest/functions/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import {CreditBalanceType, JobStatus} from "@prisma/client";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";
import {consumeCredits} from "@/features/credits/actions/consume-credits";

interface CvBody {
  cvId: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cvId }: CvBody = body;

    if (!cvId) {
      return NextResponse.json(
        { success: false, message: "CV ID is required." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // Verify CV exists and belongs to user
    const cv = await prisma.cv.findUnique({
      where: { id: cvId, userId: currentUser.id },
    });
    if (!cv) {
      return NextResponse.json(
        { success: false, message: "CV no encontrado." },
        { status: 404 }
      );
    }

    // Verify credit limits
    const creditLimits = await getCurrentCreditLimits();
    if (creditLimits.aiActionsLimit <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes intentos disponibles para subir CVs. Por favor, actualiza tu plan."
        },
        {status: 403}
      );
    }

    // Update user credit balance
    // await prisma.userCreditBalance.update({
    //   where: {
    //     userId_type: { // Prisma busca este campo autogenerado para llaves compuestas
    //       userId: currentUser.id,
    //       type: CreditBalanceType.AI_ACTIONS
    //     },
    //   },
    //   data: {
    //     amount: {
    //       decrement: 1,
    //     }
    //   },
    // })
    await consumeCredits({
      userId: currentUser.id,
      type: CreditBalanceType.AI_ACTIONS,
      amount: 1,
      description: "Análisis de CV",
    })

    const newEvaluation = await prisma.cvEvaluation.create({
      data: {
        cvId: cvId,
        status: JobStatus.IN_PROGRESS
      }
    })
    if (!newEvaluation) {
      return { success: false, message: "Error al construir la evaluacion." };
    }

    // Send event to trigger CV evaluation (correct event name)
    await inngest.send({
      name: "cv/ready-for-evaluation",
      data: {
        cvId,
        userId: currentUser.id,
        evaluationId: newEvaluation.id
      },
    });

    // Send event to get and save opportunities
    // Todo: delete when we use in another place
    // await inngest.send({
    //   name: "get.and.save.opportunities",
    //   data: { cvId, userId: currentUser.id },
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Análisis de CV iniciado.",
        data: { cvId },
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("❌ Error starting CV analysis:", error);
    return NextResponse.json(
      { success: false, message: "Error al iniciar el análisis del CV." },
      { status: 500 }
    );
  }
}
