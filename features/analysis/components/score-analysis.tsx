// score-analysis.tsx
"use client"

import { useState } from "react"
import { Award } from "lucide-react"
import { AnalysisHeader } from "@/features/analysis/components/analysis-header"
import { CVScoreCard } from "@/features/analysis/components/cv-score-card"
import { RecommendationsSection } from "@/features/analysis/components/recommendations-section"
import { ScoreBreakdownModal } from "@/features/analysis/components/score-breakdown-modal"
import { Recommendation, ScoreCategory } from "@/types/analysis"

// Movido fuera para evitar recreación en render
import {
  User, GraduationCap, Briefcase, Languages, FileText,
  Code, Target, Sparkles, Folder
} from "lucide-react"

const ICONS: Record<string, any> = {
  User, GraduationCap, Briefcase, Languages, FileText, Code, Target, Award, Sparkles, Folder
}

interface AnalysisScoreProps {
  scoreBreakdown: ScoreCategory[]
  cvScore: number
  recommendations: Recommendation[]
}

export default function AnalysisScore({
                                        scoreBreakdown,
                                        cvScore,
                                        recommendations,
                                      }: AnalysisScoreProps) {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)

  // Simplificamos el mapeo de iconos
  const resolvedBreakdown = scoreBreakdown.map((cat) => ({
    ...cat,
    Icon: ICONS[cat.icon] || Award
  }))

  return (
    <div className="min-h-screen bg-background/30 pb-20 flex items-center justify-center px-4">
      <div className="max-w-4xl py-10 space-y-8">
        {/* 1. Encabezado simple */}
        <AnalysisHeader />

        {/* 2. El Score (Prioridad Visual) */}
        <CVScoreCard
          score={cvScore}
          onShowBreakdown={() => setShowScoreBreakdown(true)}
        />

        {/* 3. Recomendaciones (Flujo natural hacia abajo) */}
        <RecommendationsSection recommendations={recommendations} />
      </div>

      <ScoreBreakdownModal
        show={showScoreBreakdown}
        onClose={() => setShowScoreBreakdown(false)}
        scoreBreakdown={resolvedBreakdown}
        totalScore={cvScore}
      />
    </div>
  )
}
