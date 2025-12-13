"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Award, ExternalLink} from "lucide-react"
import {Opportunity} from ".prisma/client";
import {OpportunityCard} from "@/features/analysis/components/opportunity-card";

interface OpportunitiesSectionProps {
  opportunities: Opportunity[]
}

export function OpportunitiesSection({opportunities}: OpportunitiesSectionProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-gray-800">
          <Award className="w-8 h-8 mr-3 text-purple-500"/>
          Top 5 Oportunidades para ti
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {opportunities.map((opp, index) => (
          <OpportunityCard key={index} opportunity={opp}/>
        ))}
      </CardContent>
    </Card>
  )
}
