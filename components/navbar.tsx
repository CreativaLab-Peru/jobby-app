"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Plus } from "lucide-react"
import Link from "next/link"
import { ProfileButton } from "@/components/profile-button"
import { CreditsOfPlan } from "@/lib/shared/get-available-tokens"
import {ButtonToggleTheme} from "@/components/button-toggle-theme";

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

  const remainingCredits = userLimit.totalCredits - userLimit.usedCredits
  const totalCredits = userLimit.totalCredits

  const getCreditVariant = (remaining: number, total: number) => {
    const percentage = remaining / total
    if (percentage > 0.6) return "default"
    if (percentage > 0.3) return "secondary"
    return "destructive"
  }

  const getProgressWidth = () =>
    `${(remainingCredits / totalCredits) * 100}%`

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link href="/cv" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold text-foreground">
              Levely
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ButtonToggleTheme />

            {/* TOKENS DESKTOP */}
            <motion.div whileHover={{ scale: 1.05 }} className="hidden sm:block">
              <Card className="bg-card shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">

                    {/* ICONO */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                      T
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Tokens
                        </span>
                        <Badge variant={getCreditVariant(remainingCredits, totalCredits)}>
                          {remainingCredits} disponibles
                        </Badge>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: getProgressWidth() }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* TOKENS MOBILE */}
            <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-sm sm:hidden">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                T
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  Tokens: {remainingCredits}
                </span>
                <div className="mt-1 h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: getProgressWidth() }}
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

      {/* ALERTA DE CRÉDITOS */}
      {!isClosed && remainingCredits <= 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t bg-destructive/10"
        >
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 text-destructive">
                <Zap className="h-4 w-4" />
                <span className="text-sm">
                  Te quedan muy pocos créditos disponibles
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Obtener más
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsClosed(true)}
              >
                ✕
              </Button>

            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
