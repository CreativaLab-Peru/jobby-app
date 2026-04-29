import { inngest } from "@/inngest/functions/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { JobStatus, RouteStatus } from "@prisma/client";

interface QuickMatchBody {
  cvId: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cvId }: QuickMatchBody = body;

    if (!cvId) {
      return NextResponse.json({ success: false, message: "CV ID is required." }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado." },
        { status: 404 },
      );
    }

    // Verify CV exists and belongs to user
    const cv = await prisma.cv.findUnique({
      where: { id: cvId, userId: currentUser.id },
    });
    if (!cv) {
      return NextResponse.json({ success: false, message: "CV no encontrado." }, { status: 404 });
    }

    const route = await prisma.route.findFirst({
      where: {
        userId: currentUser.id,
        cvId,
      },
      select: {
        id: true,
        status: true,
        _count: {
          select: {
            opportunities: true,
          },
        },
      },
    });

    const latestMatchJob = await prisma.queueJob.findFirst({
      where: {
        cvId,
        type: "GET_OPPORTUNITIES",
        status: {
          in: [JobStatus.IN_PROGRESS, JobStatus.SUCCEEDED],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        status: true,
      },
    });

    const statusesWithMatchExecuted: RouteStatus[] = [
      RouteStatus.OPPORTUNITIES_PENDING,
      RouteStatus.OPPORTUNITIES_DONE,
      RouteStatus.ROADMAP_PENDING,
      RouteStatus.ROADMAP_IN_PROGRESS,
      RouteStatus.ROADMAP_DONE,
      RouteStatus.PROGRAM_PENDING,
      RouteStatus.PROGRAM_IN_PROGRESS,
      RouteStatus.PROGRAM_DONE,
    ];

    const routeHasExecutedMatch = route ? statusesWithMatchExecuted.includes(route.status) : false;

    const hasPersistedOpportunities = (route?._count.opportunities ?? 0) > 0;
    const hasAlreadyMatched =
      Boolean(latestMatchJob) || routeHasExecutedMatch || hasPersistedOpportunities;

    if (latestMatchJob?.status === JobStatus.IN_PROGRESS) {
      return NextResponse.json(
        {
          success: false,
          message: "El match de oportunidades ya está en proceso para esta ruta.",
        },
        { status: 409 },
      );
    }

    if (hasAlreadyMatched) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Esta ruta ya ejecutó su match de oportunidades. Crea una nueva ruta para volver a intentar.",
        },
        { status: 409 },
      );
    }

    // Verify credit limits for SEARCH_OPPORTUNITIES
    const creditLimits = await getCurrentCreditLimits();

    if (creditLimits.opportunitiesActionsLimit <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No tienes créditos disponibles para hacer match de oportunidades. Por favor, actualiza tu plan.",
        },
        { status: 403 },
      );
    }

    if (route?.status === RouteStatus.ANALYSIS_DONE) {
      await prisma.route.update({
        where: { id: route.id },
        data: { status: RouteStatus.OPPORTUNITIES_PENDING },
      });
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
      { status: 202 },
    );
  } catch (error) {
    console.error("❌ [QUICK_MATCH] Error:", error);
    return NextResponse.json(
      { success: false, message: "Error al iniciar el match de oportunidades." },
      { status: 500 },
    );
  }
}
