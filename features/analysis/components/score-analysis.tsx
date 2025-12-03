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

// Components
import { AnalysisHeader } from "@/features/analysis/components/analysis-header"
import { CVScoreCard } from "@/features/analysis/components/cv-score-card"
import { RecommendationsSection } from "@/features/analysis/components/recommendations-section"
import { OpportunitiesSection } from "@/features/analysis/components/opportunities-section"
import { StickyActionButtons } from "@/features/analysis/components/sticky-action-buttons"
import { ScoreBreakdownModal } from "@/features/analysis/components/score-breakdown-modal"

import { Recommendation, ScoreCategory } from "@/types/analysis"
import { opportunities } from "@/features/analysis/data/analysis-data";

interface AnalysisScoreProps {
  scoreBreakdown: ScoreCategory[]
  cvScore: number
  recommendations: Recommendation[]
}

// Icon lookup map (client-side)
const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
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
}

export default function AnalysisScore({
  scoreBreakdown,
  cvScore,
  recommendations
}: AnalysisScoreProps) {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [showStickyButtons, setShowStickyButtons] = useState(false)

  // Resolve iconName to actual component at render time
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <AnalysisHeader />

            <Tabs defaultValue="score" className="space-y-8">
              <TabsList className="grid w-full grid-cols-1 h-16 text-lg bg-white shadow-lg rounded-xl border-2 border-gray-100">
                <TabsTrigger
                  value="score"
                  className="text-gray-400 flex items-center gap-3 h-12 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Target className="w-6 h-6" />
                  Score y Recomendaciones
                </TabsTrigger>
              </TabsList>

              {/* TODO: Implementar pestaña de Oportunidades, ahora estamos usando oportunidades hardcodeadas */}
              {/* <TabsList className="grid w-full grid-cols-2 h-16 text-lg bg-white shadow-lg rounded-xl border-2 border-gray-100">
              <TabsTrigger
              value="score"
                className="text-gray-400 flex items-center gap-3 h-12 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Target className="w-6 h-6" />
                Score y Recomendaciones
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="text-gray-400 flex items-center gap-3 h-12 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Award className="w-6 h-6" />
                Oportunidades
              </TabsTrigger>
            </TabsList> */}

              <TabsContent value="score" className="space-y-6">
                <CVScoreCard score={cvScore} onShowBreakdown={() => setShowScoreBreakdown(true)} />
                <RecommendationsSection recommendations={recommendations} /> {/* ajusta si necesitas data */}
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-6">
                <OpportunitiesSection opportunities={opportunities} /> {/* ajusta si necesitas data */}
              </TabsContent>
            </Tabs>
            <div>
              <div className="h-20" /> {/* Espacio para los botones sticky */}
            </div>

            {/* TODO: eliminar este componente repetido, puesto que es repetido */}
            {/*<ActionButtons show={!showStickyButtons} /> */}
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
