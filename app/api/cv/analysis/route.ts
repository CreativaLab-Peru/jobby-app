import { inngest } from "@/inngest/functions/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

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
    await prisma.userCreditBalance.update({
      where: {
        userId_type: { // Prisma busca este campo autogenerado para llaves compuestas
          userId: currentUser.id,
          type: "AI_ACTIONS"
        },
      },
      data: {
        type: "AI_ACTIONS",
        amount: {
          decrement: 1,
        }
      },
    })

    // Send event to trigger CV evaluation (correct event name)
    await inngest.send({
      name: "cv/ready-for-evaluation",
      data: { cvId, userId: currentUser.id },
    });

    // Send event to get and save opportunities
    await inngest.send({
      name: "get.and.save.opportunities",
      data: { cvId, userId: currentUser.id },
    });

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
