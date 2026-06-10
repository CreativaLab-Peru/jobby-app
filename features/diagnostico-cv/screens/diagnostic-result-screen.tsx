"use client";

import { DiagnosticResultData } from "../actions/get-diagnostic-result-action";
import { ScoreRing } from "../components/score-ring";
import { RecommendationList } from "../components/recommendation-list";
import { OpportunityList } from "../components/opportunity-list";

interface DiagnosticResultScreenProps {
  data: DiagnosticResultData;
}

export function DiagnosticResultScreen({ data }: DiagnosticResultScreenProps) {
  const firstName = data.name?.split(" ")[0] ?? null;

  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans">
      <div className="max-w-lg mx-auto px-5 py-12">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p className="text-[#8a9e93] text-sm mb-2">
            {firstName ? `Hola ${firstName},` : "Tu diagnóstico está listo"}
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Resultados de tu diagnóstico
          </h1>
        </div>

        {/* ── Score + Profile ──────────────────────────────────────────────── */}
        <div className="bg-[#0d1a17] border border-[rgba(255,255,255,.07)] rounded-2xl p-6 mb-4">
          {/* Score ring centered */}
          <div className="flex justify-center mb-6">
            <ScoreRing score={data.overallScore} />
          </div>

          {/* Profile type badge */}
          <div className="flex justify-center mb-3">
            <span className="px-3 py-1 bg-[#c8f562]/15 text-[#c8f562] rounded-full text-xs font-semibold tracking-wide uppercase">
              Tu perfil
            </span>
          </div>

          <h2
            className="text-xl font-bold text-center mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {data.profileType}
          </h2>
          <p className="text-[#8a9e93] text-sm text-center leading-relaxed">
            {data.profileDescription}
          </p>
        </div>

        {/* ── Recommendations ──────────────────────────────────────────────── */}
        <div className="mb-4">
          <RecommendationList recommendations={data.recommendations} />
        </div>

        {/* ── Opportunities ────────────────────────────────────────────────── */}
        <div className="mb-6">
          <OpportunityList opportunities={data.opportunities} />
        </div>

        {/* ── Email notice ─────────────────────────────────────────────────── */}
        <div className="bg-[#c8f562]/8 border border-[#c8f562]/15 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-[#c8f562]/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#c8f562]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[#f4f0e6] text-sm font-medium">
              Resultados enviados a tu correo
            </p>
            <p className="text-[#8a9e93] text-xs mt-0.5">{data.email}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
