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
    <Card className="shadow-card border-0 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-foreground">
          <Award className="w-8 h-8 mr-3 text-accent" />
          Top 5 Oportunidades para ti
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground animate-in fade-in duration-500">
             <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Award className="w-16 h-16 text-primary relative z-10 animate-bounce duration-[3000ms]" />
             </div>
             <h3 className="text-xl font-semibold mb-2 text-foreground">Buscando las mejores vacantes...</h3>
             <p className="max-w-md mx-auto mb-6">
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
