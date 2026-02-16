'use client';

import { motion } from "framer-motion";
import OpportunityCard from "@/features/opportunities/components/opportunity-card";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

interface Opportunity {
  id: string;
  match: number;
  createdAt: Date;
  [key: string]: any;
}

interface CV {
  id: string;
  title: string;
  userId: string;
}

interface CvOpportunitiesClientProps {
  cv: CV | null;
  opportunities: Opportunity[];
  cvId: string;
}

export function CvOpportunitiesClient({ cv, opportunities, cvId }: CvOpportunitiesClientProps) {
  if (!cv) {
    return (
      <main className="min-h-[90vh] p-4 md:p-8 flex items-center justify-center">
        <EmptyPlaceholder
          icon={Briefcase}
          title="CV no encontrado"
          description="No se pudo encontrar el CV solicitado."
        />
      </main>
    );
  }

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  Oportunidades: {cv.title || 'CV Sin título'}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Resultados del match con oportunidades para este CV
                </p>
              </div>
              <Link href={`/cv/${cvId}/preview`}>
                <Button variant="outline">
                  Ver CV
                </Button>
              </Link>
            </div>
          </div>

          {/* Content */}
          {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                >
                  <OpportunityCard opportunity={opportunity} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border/60 bg-secondary/5">
              <EmptyPlaceholder
                icon={Briefcase}
                title="Sin oportunidades encontradas"
                description="No se encontraron oportunidades que coincidan con este CV. Intenta completar más información en tu CV y realiza el match nuevamente."
              />
              <div className="flex justify-center pb-8">
                <Link href="/opportunities">
                  <Button variant="default">
                    Ver todas las oportunidades
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Stats */}
          {opportunities.length > 0 && (
            <div className="pt-8 border-t border-border/40 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Se encontraron <span className="font-bold text-foreground">{opportunities.length}</span> oportunidades
              </p>
              <Link href="/opportunities">
                <Button variant="outline" size="sm">
                  Ver todas las oportunidades
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

