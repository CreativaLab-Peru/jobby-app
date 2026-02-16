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
import { useSidebar } from "@/components/ui/sidebar"

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
  const { openMobile } = useSidebar()

  const resolvedBreakdown = scoreBreakdown.map((cat) => {
    const Icon = ICONS[cat.icon] || Award
    return { ...cat, Icon }
  })

  useEffect(() => {
    const handleScroll = () => {
      if (openMobile) return
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
      setShowStickyButtons(scrollPercentage > 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [openMobile])

  return (
    <>
      <div className="min-h-screen bg-background/30">
        <div className="container relative z-10 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <AnalysisHeader />

            <Tabs defaultValue="score" className="space-y-10">
              {/* REFACTOR: TabsList con arquitectura de Dashboard Técnico */}
              <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-secondary/50 backdrop-blur-md rounded-2xl border border-border/60">
                <TabsTrigger
                  value="score"
                  className="flex items-center justify-center gap-3 h-full rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300
                    data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border-border/10"
                >
                  <Target className="w-4 h-4" />
                  <span>Score e Insights</span>
                </TabsTrigger>

                <TabsTrigger
                  value="opportunities"
                  className="flex items-center justify-center gap-3 h-full rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300
                    data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border-border/10"
                >
                  <Award className="w-4 h-4" />
                  <span>Oportunidades</span>
                </TabsTrigger>
              </TabsList>

              {/* Contenidos con espaciado consistente */}
              <TabsContent value="score" className="space-y-10 outline-none">
                <CVScoreCard score={cvScore} onShowBreakdown={() => setShowScoreBreakdown(true)} />
                <RecommendationsSection recommendations={recommendations} />
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-10 outline-none">
                <OpportunitiesSection opportunities={opportunities} />
              </TabsContent>
            </Tabs>

            <div className="h-32" />
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
