// ✅ WEBHOOK — SOLO ENVÍA EVENTO A INNGEST
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/functions/client";

export async function POST(req: Request) {
  const body = await req.json();

  const paymentId = body?.data?.id;
  if (!paymentId) {
    return new NextResponse("[MISSING_ID_ERROR]", { status: 400 });
  }

  await inngest.send({
    name: "payment/mercadopago.approved",
    data: { paymentId }
  });

  // Respondemos rápido
  return new NextResponse(null, { status: 200 });
}
