"use client";

import {Briefcase, Rocket, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {PageHeader} from "@/components/shared/page-header";
import {SerializableOpportunity} from "@/features/opportunities/get-opportunities";
import {motion} from "framer-motion";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";
import {EmptyPlaceholder} from "@/components/shared/empty-placeholder";

interface Props {
  initialData: SerializableOpportunity[];
}

export default function OpportunitiesScreen({initialData}: Props) {

  const actions = (
    <div className="flex items-center space-x-2">
      <Rocket className="w-4 h-4 text-primary"/>
      <span className="text-sm font-medium text-primary">Recomendaciones basadas en IA</span>
    </div>
  );

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="space-y-8"
        >
          <PageHeader
            title="Oportunidades Match"
            description="Postulaciones recomendadas por IA basadas en tus CVs analizados."
            actions={actions}
          />

          {/* Buscador minimalista */}
          <div className="relative max-w-md group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors"/>
            <Input
              placeholder="Buscar puesto o empresa..."
              className="pl-10 border-border/40 bg-card rounded-xl focus-visible:ring-primary h-11"
            />
          </div>

          {initialData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {initialData.map((opt) => (
                <OpportunityCard key={opt.id} opportunity={opt}/>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border/60 bg-secondary/5">
              <EmptyPlaceholder
                icon={Briefcase}
                title="No hay vacantes aún"
                description="Analiza un CV para que la IA pueda encontrar oportunidades que encajen con tu perfil."
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
