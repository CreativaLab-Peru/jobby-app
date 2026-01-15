import { inngest } from "@/inngest/functions/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { canAnalyzeCv } from "@/features/analysis/actions/can-analyze-cv";
import { prisma } from "@/lib/prisma";

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

    // Validate if CV can be analyzed using centralized logic
    const canAnalyze = await canAnalyzeCv(cvId);
    if (!canAnalyze.canAnalyze) {
      return NextResponse.json(
        { success: false, message: canAnalyze.reason, code: canAnalyze.code },
        { status: 403 }
      );
    }

    // Find the payment plan to increment token usage
    const userPayments = await prisma.userPayment.findMany({
      where: { userId: currentUser.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    const availablePayment = userPayments.find(
      (p) => p.uploadCvsUsed < p.plan.uploadCvLimit
    );

    if (!availablePayment) {
      return NextResponse.json(
        { success: false, message: "No tienes tokens de análisis disponibles." },
        { status: 403 }
      );
    }

    // Increment token usage BEFORE starting analysis
    await prisma.userPayment.update({
      where: { id: availablePayment.id },
      data: { uploadCvsUsed: availablePayment.uploadCvsUsed + 1 },
    });

    // Send event to trigger CV evaluation (correct event name)
    await inngest.send({
      name: "cv/ready-for-evaluation",
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
