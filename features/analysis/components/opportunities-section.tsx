"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { Opportunity } from ".prisma/client"
import { OpportunityCard } from "@/features/analysis/components/opportunity-card"

interface OpportunitiesSectionProps {
  opportunities: Opportunity[]
}

export function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 backdrop-blu r-md overflow-hidden relative">
      {/* Fondo decorativo degradado */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 via-coral-200 to-transparent opacity-20 dark:from-blue-900 dark:via-coral-950 dark:to-transparent z-0 blur-2xl" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center text-2xl font-black text-blue-500 dark:text-blue-300">
          <Award className="w-8 h-8 mr-3 text-yellow-400 dark:text-yellow-300" />
          Top 5 Oportunidades para ti
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-blue-400 dark:text-blue-300 animate-in fade-in duration-500">
             <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-coral-200 to-transparent rounded-full blur-xl animate-pulse" />
                <Award className="w-16 h-16 text-blue-400 dark:text-blue-300 relative z-10 animate-bounce duration-[3000ms]" />
             </div>
             <h3 className="text-xl font-black mb-2 text-blue-400 dark:text-blue-300">Buscando las mejores vacantes...</h3>
             <p className="max-w-md mx-auto mb-6 text-blue-500 dark:text-blue-200">
               Nuestro motor de IA está analizando miles de ofertas para encontrar tu match ideal. 
               <br />
               <span className="text-sm opacity-80">Esto puede tomar unos segundos. Recarga la página en un momento.</span>
             </p>
          </div>
        ) : (
          opportunities.map((opp, index) => (
            <OpportunityCard key={index} opportunity={opp} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
