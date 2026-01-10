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
        {opportunities.map((opp, index) => (
          <OpportunityCard key={index} opportunity={opp} />
        ))}
      </CardContent>
    </Card>
  )
}
