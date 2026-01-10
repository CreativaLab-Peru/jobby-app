import {queryGemini} from "@/lib/queries/query-gemini";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const text = query.get("q");
    const prompt = text || "dime onichan"
    const response = await queryGemini({ prompt, type: "TEXT" });
    return NextResponse.json({
      data: response.data
    })
  } catch (error) {
    console.error("[ERROR_TEST_ON_PROD]", error);
    return NextResponse.json(
      { success: false, message: "ERROR_TEST_ON_PROD." },
      { status: 500 }
    );
  }
}
