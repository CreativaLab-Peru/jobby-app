import { NextResponse } from "next/server";

import { finishInterviewAttempt } from "@/features/interview/actions/finish-interview-attempt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await finishInterviewAttempt({
      attemptId: String(body.attemptId || ""),
      sessionId: String(body.sessionId || ""),
      secondsUsed: Number(body.secondsUsed || 0),
      reason: body.reason ? String(body.reason) : null,
    });

    if (result.success === false) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: result.message }, { status: 200 });
  } catch (error) {
    console.error("[FINISH_INTERVIEW_ATTEMPT_ROUTE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
