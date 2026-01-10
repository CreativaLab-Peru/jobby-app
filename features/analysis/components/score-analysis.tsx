"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  GraduationCap,
  Briefcase,
  Languages,
  FileText,
  Code,
  Target,
  Award,
  Sparkles,
  Folder
} from "lucide-react"

import { AnalysisHeader } from "@/features/analysis/components/analysis-header"
import { CVScoreCard } from "@/features/analysis/components/cv-score-card"
import { RecommendationsSection } from "@/features/analysis/components/recommendations-section"
import { OpportunitiesSection } from "@/features/analysis/components/opportunities-section"
import { StickyActionButtons } from "@/features/analysis/components/sticky-action-buttons"
import { ScoreBreakdownModal } from "@/features/analysis/components/score-breakdown-modal"

import { Recommendation, ScoreCategory } from "@/types/analysis"
import { Opportunity } from "@prisma/client";

interface AnalysisScoreProps {
  scoreBreakdown: ScoreCategory[]
  cvScore: number
  recommendations: Recommendation[]
  opportunities: Opportunity[]
}

const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  User, GraduationCap, Briefcase, Languages, FileText, Code, Target, Award, Sparkles, Folder
}

export default function AnalysisScore({
                                        scoreBreakdown,
                                        cvScore,
                                        recommendations,
                                        opportunities
                                      }: AnalysisScoreProps) {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [showStickyButtons, setShowStickyButtons] = useState(false)

  const resolvedBreakdown = scoreBreakdown.map((cat) => {
    const Icon = ICONS[cat.icon] || Award
    return { ...cat, Icon }
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
      setShowStickyButtons(scrollPercentage > 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* REFACTOR: Fondo usando la variable background y decoración sutil */}
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0 bg-grid-slate-200/[0.05] pointer-events-none" />

        <div className="container relative z-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <AnalysisHeader />

            <Tabs defaultValue="score" className="space-y-8">
              {/* REFACTOR: Tabs con el sistema de marca Levely */}
              <TabsList className="grid w-full grid-cols-2 h-16 p-1.5 bg-card shadow-card rounded-xl border border-border">
                <TabsTrigger
                  value="score"
                  className="flex items-center gap-3 h-full text-base font-bold transition-all duration-300
                    text-muted-foreground
                    data-[state=active]:ai-gradient data-[state=active]:text-primary data-[state=active]:shadow-glow"
                >
                  <Target className="w-5 h-5" />
                  Score y Sugerencias
                </TabsTrigger>

                <TabsTrigger
                  value="opportunities"
                  className="flex items-center gap-3 h-full text-base font-bold transition-all duration-300
                    text-muted-foreground
                    data-[state=active]:ai-gradient data-[state=active]:text-primary data-[state=active]:shadow-glow"
                >
                  <Award className="w-5 h-5" />
                  Oportunidades
                </TabsTrigger>
              </TabsList>

              <TabsContent value="score" className="space-y-8 focus-visible:outline-none">
                {/* CVScoreCard heredará los estilos del sistema */}
                <CVScoreCard score={cvScore} onShowBreakdown={() => setShowScoreBreakdown(true)} />
                <RecommendationsSection recommendations={recommendations} />
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-8 focus-visible:outline-none">
                <OpportunitiesSection opportunities={opportunities} />
              </TabsContent>
            </Tabs>

            <div className="h-24" />
          </motion.div>
        </div>
        <StickyActionButtons show={showStickyButtons} />
      </div>

      <ScoreBreakdownModal
        show={showScoreBreakdown}
        onClose={() => setShowScoreBreakdown(false)}
        scoreBreakdown={resolvedBreakdown}
        totalScore={cvScore}
      />
    </>
  )
}
