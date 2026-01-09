"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Plus } from "lucide-react"
import Link from "next/link"
import { ProfileButton } from "@/components/profile-button";
import {CreditsOfPlan} from "@/lib/shared/get-available-tokens";

interface NavbarProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
  } | null
  userLimit: CreditsOfPlan
}

export function Navbar({ userLimit, user }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    setMounted(true)
    const closed = localStorage.getItem("cv-score-banner-closed")
    if (closed) setIsClosed(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("cv-score-banner-closed", String(isClosed))
  }, [isClosed])

  if (!mounted) return null

  // ---- NUEVO SISTEMA DE CRÉDITOS ----
  const remainingCredits = userLimit.totalCredits - userLimit.usedCredits
  const totalCredits = userLimit.totalCredits

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

  // ------------------------------------

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/cv" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Levely
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">

            {/* ---- NUEVA SECCIÓN DE TOKENS ---- */}
            <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-4">

                    {/* ICONO DEL TOKEN */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm">
                      T
                    </div>

                    {/* INFORMACIÓN DEL TOKEN */}
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Tokens
                        </span>
                        <Badge
                          className={`text-xs px-2 py-1 ${getCreditColor(remainingCredits, totalCredits)}`}
                        >
                          {remainingCredits} disponibles
                        </Badge>
                      </div>

                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(remainingCredits, totalCredits)} transition-all duration-300`}
                          style={{ width: `${(remainingCredits / totalCredits) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Móvil */}
            <div className="sm:hidden flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm">

              {/* Icono */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md">
                <span className="text-xs font-bold text-white">T</span>
              </div>

              {/* Texto + Barra */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700">
                  Tokens: {remainingCredits}
                </span>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(
                      remainingCredits,
                      totalCredits
                    )} transition-all duration-300`}
                    style={{
                      width: `${(remainingCredits / totalCredits) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            {/* PERFIL */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ProfileButton user={user} />
            </motion.div>

          </div>
        </div>
      </div>

      {/* ---- BANNER DE ALERTA DE CRÉDITOS ---- */}
      {!isClosed && remainingCredits <= 1 && (
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
                  Te quedan muy pocos créditos disponibles
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
                ✕
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
