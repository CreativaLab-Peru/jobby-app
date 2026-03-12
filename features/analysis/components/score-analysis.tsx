// score-analysis.tsx
"use client"

import { Award } from "lucide-react"
import { AnalysisHeader } from "@/features/analysis/components/analysis-header"
import { CVScoreCard } from "@/features/analysis/components/cv-score-card"
import { RecommendationsSection } from "@/features/analysis/components/recommendations-section"
import {
  ImprovementsSection,
  ImprovedText,
  SuggestedAddition,
} from "@/features/analysis/components/improvements-section"
import { Recommendation, ScoreCategory } from "@/types/analysis"

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
  cvId?: string | null
  improvedTexts?: ImprovedText[]
  suggestedAdditions?: SuggestedAddition[]
}

export default function AnalysisScore({
                                        scoreBreakdown,
                                        cvScore,
                                        recommendations,
                                        cvId,
                                        improvedTexts = [],
                                        suggestedAdditions = [],
                                      }: AnalysisScoreProps) {
  const resolvedBreakdown = scoreBreakdown.map((cat) => ({
    ...cat,
    Icon: ICONS[cat.icon] || Award
  }))

  const hasImprovements = improvedTexts.length > 0 || suggestedAdditions.length > 0

  return (
    <div className="pb-20 px-4 md:px-8">
      <div className="mx-auto max-w-3xl py-8 space-y-8">
        {/* 1. Header */}
        <AnalysisHeader />

        {/* 2. Score + inline breakdown */}
        <CVScoreCard score={cvScore} scoreBreakdown={resolvedBreakdown} />

        {/* 3. Improved texts & suggestions */}
        {hasImprovements && cvId && (
          <ImprovementsSection
            cvId={cvId}
            improvedTexts={improvedTexts}
            suggestedAdditions={suggestedAdditions}
          />
        )}

        {/* 4. Recommendations */}
        <RecommendationsSection recommendations={recommendations} />
      </div>
    </div>
  )
}
