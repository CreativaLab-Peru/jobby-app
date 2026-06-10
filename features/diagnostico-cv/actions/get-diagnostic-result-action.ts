"use server";

import {prisma} from "@/lib/prisma";

// ── Shared types (also imported by the screen and components) ─────────────────

export interface Recommendation {
  area: string;
  suggestion: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface MatchedOpportunity {
  id: string;
  name: string;
  country: string;
  flag: string;
  type: string;
  url: string;
  matchPercentage: number;
}

export interface DiagnosticResultData {
  id: string;
  name: string | null;
  email: string;
  overallScore: number;
  profileType: string;
  profileDescription: string;
  recommendations: Recommendation[];
  opportunities: MatchedOpportunity[];
  createdAt: Date;
}

// ── Action ────────────────────────────────────────────────────────────────────

type GetResultResponse =
  | { success: true; data: DiagnosticResultData; error?: "NOT_FOUND" | "INVALID_DATA" }
  | { success: false; error: "NOT_FOUND" | "INVALID_DATA" };

export async function getDiagnosticResultAction(
  id: string
): Promise<GetResultResponse> {
  const row = await prisma.diagnosticResult.findFirst({
    where: {sessionId: id},
    select: {
      id: true,
      name: true,
      email: true,
      overallScore: true,
      profileType: true,
      profileDescription: true,
      recommendations: true,
      opportunities: true,
      createdAt: true,
    },
  });

  if (!row) return {success: false, error: "NOT_FOUND"};

  // Prisma returns Json fields as `unknown` — parse and validate shape
  const recommendations = parseRecommendations(row.recommendations);
  const opportunities = parseOpportunities(row.opportunities);

  if (!recommendations || !opportunities) {
    return {success: false, error: "INVALID_DATA"};
  }

  return {
    success: true,
    data: {
      id: row.id,
      name: row.name,
      email: row.email,
      overallScore: Math.round(row.overallScore ?? 0),
      profileType: row.profileType ?? "Perfil en desarrollo",
      profileDescription: row.profileDescription ?? "",
      recommendations,
      opportunities,
      createdAt: row.createdAt,
    },
  };
}

// ── Parsers (runtime validation of Json fields) ───────────────────────────────

function parseRecommendations(raw: unknown): Recommendation[] | null {
  if (!Array.isArray(raw)) return null;
  return raw
    .filter(
      (r): r is Recommendation =>
        r !== null &&
        typeof r === "object" &&
        typeof (r as Recommendation).area === "string" &&
        typeof (r as Recommendation).suggestion === "string"
    )
    .map((r) => ({
      area: r.area,
      suggestion: r.suggestion,
      priority: (["HIGH", "MEDIUM", "LOW"].includes(r.priority)
        ? r.priority
        : "MEDIUM") as Recommendation["priority"],
    }));
}

function parseOpportunities(raw: unknown): MatchedOpportunity[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.filter(
    (o): o is MatchedOpportunity =>
      o !== null &&
      typeof o === "object" &&
      typeof (o as MatchedOpportunity).id === "string" &&
      typeof (o as MatchedOpportunity).name === "string" &&
      typeof (o as MatchedOpportunity).url === "string"
  );
}
