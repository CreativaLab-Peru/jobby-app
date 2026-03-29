import {inngest} from "@/inngest/functions/client";
import {NextResponse} from "next/server";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";
import {
  getRoadmapGenerationPermissionByUser
} from "@/features/roadmap/actions/get-roadmap-generation-permission";

interface GenerateRoadmapBody {
  opportunityId: string;
  cvId: string;
  routeId: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {opportunityId, cvId, routeId}: GenerateRoadmapBody = body;

    if (!opportunityId || !cvId) {
      return NextResponse.json(
        {success: false, message: "opportunityId y cvId son requeridos."},
        {status: 400},
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {success: false, message: "Usuario no encontrado."},
        {status: 404},
      );
    }



    // Verify opportunity belongs to user's CV
    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        cvId,
        routeId,
        cv: {userId: currentUser.id},
      },
    });
    if (!opportunity) {
      return NextResponse.json(
        {success: false, message: "Oportunidad no encontrada."},
        {status: 404},
      );
    }

    // Check if a roadmap already exists and is succeeded
    const existing = await prisma.roadmap.findUnique({
      where: {
        opportunityId_cvId_userId_routeId: {
          opportunityId,
          cvId,
          userId: currentUser.id,
          routeId,
        },
      },
    });
    if (existing?.status === "SUCCEEDED") {
      return NextResponse.json(
        {
          success: true,
          message: "Ya existe un roadmap para esta oportunidad.",
          data: {roadmapId: existing.id},
        },
        {status: 200},
      );
    }

    const permission = await getRoadmapGenerationPermissionByUser(
      currentUser.id,
      opportunityId,
      cvId,
      routeId,
    );

    if (!permission.canGenerate) {
      return NextResponse.json(
        {
          success: false,
          message: permission.message || "No puedes generar roadmap para esta oportunidad.",
        },
        {status: 403},
      );
    }

    await inngest.send({
      name: "generate.roadmap",
      data: {
        opportunityId,
        cvId,
        userId: currentUser.id,
        routeId
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Generación de roadmap iniciada.",
        data: {opportunityId, cvId},
      },
      {status: 202},
    );
  } catch (error) {
    console.error("❌ [GENERATE_ROADMAP] Error:", error);
    return NextResponse.json(
      {success: false, message: "Error al iniciar la generación del roadmap."},
      {status: 500},
    );
  }
}

