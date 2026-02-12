"use client";

import { Briefcase } from "lucide-react";
import { SerializableOpportunity } from "@/features/opportunities/get-opportunities";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

interface Props {
  opportunities: SerializableOpportunity[];
}

export default function OpportunityList({ opportunities }: Props) {
  if (opportunities.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border/60 bg-secondary/5">
        <EmptyPlaceholder
          icon={Briefcase}
          title="No hay vacantes aún"
          description="Analiza un CV para que la IA pueda encontrar oportunidades que encajen con tu perfil."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
      {opportunities.map((opt) => (
        <OpportunityCard key={opt.id} opportunity={opt} />
      ))}
    </div>
  );
}
