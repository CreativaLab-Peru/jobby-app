import { inngest } from "@/inngest/functions/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";

interface QuickMatchBody {
  cvId: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cvId }: QuickMatchBody = body;

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
    };

    // Verify credit limits for SEARCH_OPPORTUNITIES
    const creditLimits = await getCurrentCreditLimits();

    if (creditLimits.opportunitiesActionsLimit <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes créditos disponibles para hacer match de oportunidades. Por favor, actualiza tu plan."
        },
        { status: 403 }
      );
    }

    // Inngest will consume credit ONLY if matches > 0
    await inngest.send({
      name: "get.and.save.opportunities",
      data: { cvId, userId: currentUser.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Match de oportunidades iniciado.",
        data: { cvId },
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("❌ [QUICK_MATCH] Error:", error);
    return NextResponse.json(
      { success: false, message: "Error al iniciar el match de oportunidades." },
      { status: 500 }
    );
  }
}

