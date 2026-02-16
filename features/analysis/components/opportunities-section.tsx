"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Search, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Opportunity } from "@prisma/client"
import { OpportunityCard } from "@/features/analysis/components/opportunity-card"

interface OpportunitiesSectionProps {
  opportunities: Opportunity[]
}

export function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  const hasOpportunities = opportunities.length > 0;

  return (
    <Card className="border-border/60 bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-xl shadow-primary/5">
      {/* Header con estética Dashboard */}
      <CardHeader className="p-8 pb-4">
        <CardTitle className="flex items-center gap-4 text-md font-black">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="w-5 h-5 text-primary" />
          </div>
          Market Fit: Top 5 Vacantes
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 pt-0 space-y-6">
        {!hasOpportunities ? (
          /* Estado de Carga / Vacío con Ingeniería Visual */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-8">
              {/* Círculos concéntricos de radar */}
              <div className="absolute inset-0 bg-primary/20 rounded-full scale-[2.5] blur-2xl animate-pulse" />
              <div className="absolute inset-0 border border-primary/20 rounded-full scale-150 animate-ping" />

              <div className="relative z-10 p-6 bg-background border border-border/50 rounded-[2rem] shadow-2xl">
                <Search className="w-12 h-12 text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-3 max-w-sm">
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Sincronizando con el Mercado
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Nuestra IA está filtrando vacantes de alto impacto que coinciden con tus <span className="text-primary font-bold">skills técnicos</span>.
              </p>
            </div>

            {/* Simulación de progreso técnico */}
            <div className="mt-10 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  className="h-1 w-8 rounded-full bg-primary/40"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* Lista de Oportunidades */
          <div className="grid gap-4">
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OpportunityCard opportunity={opp} />
              </motion.div>
            ))}

            {/* Footer de Insight */}
            <div className="mt-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Estas vacantes han sido seleccionadas por su alto match con tu experiencia y stack actual.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
