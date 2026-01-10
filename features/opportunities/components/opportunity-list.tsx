"use client";


import {SerializableOpportunity} from "@/features/opportunities/get-opportunities";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";

interface Props {
  opportunities: SerializableOpportunity[];
}

export default function OpportunityList({ opportunities }: Props) {
  if (opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl bg-muted/20">
        <p className="text-muted-foreground font-bold">No se encontraron oportunidades.</p>
        <p className="text-sm text-muted-foreground">Analiza un CV para que la IA encuentre vacantes por ti.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opt) => (
        <OpportunityCard key={opt.id} opportunity={opt} />
      ))}
    </div>
  );
}
