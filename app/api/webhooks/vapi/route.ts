import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    // 1. Validar que el mensaje es el reporte final
    if (message?.type !== "end-of-call-report") {
      return NextResponse.json({ message: "Ignored message type" }, { status: 200 });
    }

    const vapiCallId = message.callId;

    // 2. Extraer datos (Vapi los agrupa en 'analysis' o 'structuredData')
    const summary = message.summary || "";
    const transcript = message.transcript || "";
    const analysis = message.analysis?.structuredData || {};

    // 3. Update en DB
    // Usamos updateMany o buscamos primero para evitar errores si el ID no existe
    const updatedSession = await prisma.interviewSession.update({
      where: { vapiCallId: vapiCallId },
      data: {
        status: "SUCCEEDED",
        feedback: summary,
        transcript: transcript,
        overallScore: analysis.score ? Math.round(analysis.score) : null,
        alignment: analysis.successEvaluation ? Math.round(analysis.successEvaluation) : null,
        confidence: analysis.confidence ? Math.round(analysis.confidence) : null,
        clarity: analysis.clarity ? Math.round(analysis.clarity) : null,
      }
    });

    console.log(`[WEBHOOK_VAPI] Session ${updatedSession.id} updated.`);

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error("[WEBHOOK_VAPI_ERROR]", error);
    // Respondemos 500 para que Vapi sepa que hubo un error y reintente si es necesario
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
