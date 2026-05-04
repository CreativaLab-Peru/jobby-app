import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body;

    console.log("[WEBHOOK_VAPI] Received type:", message?.type);

    if (message?.type !== "end-of-call-report") {
      return NextResponse.json({ message: "Ignored message type" }, { status: 200 });
    }

    const vapiCallId = message.call?.id || message.callId;

    if (!vapiCallId) {
      console.error("[WEBHOOK_VAPI] Error: vapiCallId not found", message);
      return NextResponse.json({ error: "No callId provided" }, { status: 400 });
    }

    const artifact = message.artifact || {};

    // 1. Obtenemos el objeto de outputs (en tu log es un Objeto, no un Array)
    const structuredOutputsObj = artifact?.structuredOutputs || {};

    // 2. Convertimos los valores del objeto a un Array y buscamos por nombre
    const interviewAnalysis = Object.values(structuredOutputsObj).find(
      (output: any) => output.name === "interview_analysis"
    ) as any;

    // 3. Extraemos el objeto 'result'
    const data = interviewAnalysis?.result || {};

    // 4. Feedback: Priorizamos el summary del análisis estructurado
    const feedback = data.summary || message.summary || message.analysis?.summary || "Sin resumen disponible.";

    console.log(`[WEBHOOK_VAPI] Extracting data for ${vapiCallId}:`, {
      score: data.score,
      alignment: data.successEvaluation
    });

    // --- UPDATE EN DB ---
    const result = await prisma.interviewSession.updateMany({
      where: { vapiCallId: vapiCallId },
      data: {
        status: "SUCCEEDED",
        feedback: feedback,
        transcript: artifact,

        // Mapeo numérico validado
        overallScore: data.score != null ? Math.round(Number(data.score)) : null,
        confidence: data.confidence != null ? Math.round(Number(data.confidence)) : null,
        clarity: data.clarity != null ? Math.round(Number(data.clarity)) : null,

        // Prioridad al successEvaluation numérico del esquema (el "5" en tu log)
        alignment: data.successEvaluation != null
          ? Math.round(Number(data.successEvaluation))
          : (message.analysis?.successEvaluation === 'true' ? 100 : 0),
      }
    });

    if (result.count === 0) {
      console.warn(`[WEBHOOK_VAPI] No DB record found for vapiCallId: ${vapiCallId}`);
    } else {
      console.log(`[WEBHOOK_VAPI] Session updated successfully for CallId: ${vapiCallId}`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error("[WEBHOOK_VAPI_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
