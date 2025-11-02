"use client"

import { useState, useEffect, useTransition } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, BarChart3, Zap, Plus, Crown } from "lucide-react"
import Link from "next/link"
import { ProfileButton } from "@/components/profile-button";
import { createPreference } from "@/lib/mercadopago/create-preference"
import { LimitOfPlan } from "@/lib/shared/get-count-availables-attempts"

interface NavbarProps {
  hasSubscription?: boolean
  user: {
    id: string
    name: string
    email: string
    image?: string
  } | null
  userLimit: LimitOfPlan
}

export function Navbar({ userLimit, user, hasSubscription }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
    // Get of the localStorage to check if the banner is closed
    const closed = localStorage.getItem("cv-score-banner-closed")
    if (closed) {
      setIsClosed(true)
    }
  }, [])

  useEffect(() => {
    // Save the state of the banner in localStorage
    localStorage.setItem("cv-score-banner-closed", String(isClosed))
  }, [isClosed])


  if (!mounted) return null

  const cvRemaining = userLimit.cvCreations.total - userLimit.cvCreations.used
  const scoresRemaining = userLimit.scoreAnalysis.total - userLimit.scoreAnalysis.used

  const getCreditColor = (remaining: number, total: number) => {
    const percentage = remaining / total
    if (percentage > 0.6) return "text-green-600 bg-green-50 border-green-200"
    if (percentage > 0.3) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = remaining / total
    if (percentage > 0.6) return "from-green-400 to-green-600"
    if (percentage > 0.3) return "from-yellow-400 to-yellow-600"
    return "from-red-400 to-red-600"
  }

  const getPremiumSuscription = () => {
    if (isPending) return
    startTransition(async () => {
      const response = await createPreference();
      if (response.success && response.redirect) {
        window.location.href = response.redirect;
        return;
      }
      console.error("MercadoPago Preference Creation Response:", response);
    })
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/cv" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-sm">CV</span> */}
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Jobby
              </span>
            </Link>
          </div>

          {/* Credits Section */}
          <div className="flex items-center space-x-4">

            {/* Upgrade to Premium Button */}
            {hasSubscription ? null : (
              <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm"
                  onClick={getPremiumSuscription}
                >
                  <CardContent className="p-3 hover:cursor-pointer" >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg border-0">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            Obtener Premium
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* CV Creation Credits */}
            <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm"
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">CVs</span>
                        <Badge
                          className={`text-xs px-2 py-1 ${getCreditColor(cvRemaining, userLimit.cvCreations.total)}`}
                        >
                          {cvRemaining} restantes
                        </Badge>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(cvRemaining, userLimit.cvCreations.total)} transition-all duration-300 `}
                          style={{ width: `${(cvRemaining / userLimit.cvCreations.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Score Analysis Credits */}
            {/* <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm"
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Scores</span>
                        <Badge
                          className={`text-xs px-2 py-1 ${getCreditColor(scoresRemaining, userLimit.scoreAnalysis.total)}`}
                        >
                          {scoresRemaining} restantes
                        </Badge>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(scoresRemaining, userLimit.scoreAnalysis.total)} transition-all duration-300`}
                          style={{ width: `${(scoresRemaining / userLimit.scoreAnalysis.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div> */}

            {/* Mobile Credits */}
            <div className="flex sm:hidden items-center space-x-2">
              <Badge className={`text-xs px-2 py-1 ${getCreditColor(cvRemaining, userLimit.cvCreations.total)}`}>
                <FileText className="w-3 h-3 mr-1" />
                {cvRemaining}
              </Badge>
              <Badge className={`text-xs px-2 py-1 ${getCreditColor(scoresRemaining, userLimit.scoreAnalysis.total)}`}>
                <BarChart3 className="w-3 h-3 mr-1" />
                {scoresRemaining}
              </Badge>
            </div>

            {/*/!* Upgrade Button *!/*/}
            {/*{!userLimit.isPremium && (*/}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ProfileButton user={user} />
            </motion.div>
            {/*)}*/}

            {/*/!* Premium Badge *!/*/}
            {/*{userLimits.isPremium && (*/}
            {/*  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">*/}
            {/*    <Crown className="w-3 h-3 mr-1" />*/}
            {/*    Premium*/}
            {/*  </Badge>*/}
            {/*)}*/}
          </div>
        </div>
      </div>

      {/* Warning Banner for Low Credits */}
      {!isClosed && (cvRemaining <= 1 || scoresRemaining <= 1) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-700">
                  {cvRemaining <= 1 && scoresRemaining <= 1
                    ? "Te quedan pocos créditos para CVs y Scores"
                    : cvRemaining <= 1
                      ? "Te quedan pocos créditos para crear CVs"
                      : "Te quedan pocos créditos para análisis de Scores"}
                </span>
                <div className="px-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent cursor-pointer"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Obtener más
                  </Button>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setIsClosed(true)}
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-gradient-to-r from-blue-50 to-red-50 border-t border-blue-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                La primera version de Jobby CV Score es gratuita. Próximamente agregaremos más funcionalidades premium.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  )
}