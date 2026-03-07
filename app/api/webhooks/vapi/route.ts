import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const message = body.message;

  // Vapi envía "end-of-call-report" con el resumen y análisis
  if (message.type === "end-of-call-report") {
    const vapiCallId = message.callId;
    const { summary, analysis, transcript } = message;

    // Actualizamos nuestra base de datos con los KPIs
    await prisma.interviewSession.update({
      where: { vapiCallId: vapiCallId },
      data: {
        status: "SUCCEEDED",
        feedback: summary,
        transcript: transcript, // Guardamos toda la conversación
        overallScore: analysis.score,
        alignment: analysis.successEvaluation, // Ejemplo de mapeo
        confidence: analysis.confidence,
        clarity: analysis.clarity
      }
    });
  }

  return new Response("OK", { status: 200 });
}
