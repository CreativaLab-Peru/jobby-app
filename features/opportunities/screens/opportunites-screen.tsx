"use client";

import { Rocket, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import OpportunityList from "../components/opportunity-list";
import {SerializableOpportunity} from "@/features/opportunities/get-opportunities";

interface Props {
  initialData: SerializableOpportunity[];
}

export default function OpportunitiesScreen({ initialData }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8 pb-10 px-4 md:px-10 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Rocket className="w-8 h-8 text-secondary" />
            Oportunidades <span className="ai-gradient-text text-2xl">Match</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Postulaciones recomendadas por IA basadas en tus CVs analizados.
          </p>
        </div>

        {/* Barra de herramientas (Filtros simples) */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar puesto o empresa..."
            className="pl-10 border-2 focus-visible:ring-primary rounded-xl"
          />
        </div>

        <OpportunityList opportunities={initialData} />
      </div>
    </div>
  );
}
