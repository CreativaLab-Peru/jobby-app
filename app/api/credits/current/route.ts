import { NextResponse } from "next/server";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";

export async function GET() {
  try {
    const creditLimits = await getCurrentCreditLimits();
    return NextResponse.json(creditLimits);
  } catch (error) {
    console.error("Error getting credit limits:", error);
    return NextResponse.json(
      { error: "Failed to get credit limits" },
      { status: 500 }
    );
  }
}
