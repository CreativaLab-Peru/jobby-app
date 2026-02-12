"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {BarChart3, Plus} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user";

import {EvaluationCard} from "@/features/analysis/components/evaluation-card";

interface ScoresListPageProps {
  cvs: CvWithRelations[];
  disabledButton?: boolean;
}

export function ScoresListPage({ cvs, disabledButton }: ScoresListPageProps) {
  const router = useRouter();

  const actions = (
    <Button
      variant="accent"
      disabled={disabledButton}
      size={'sm'}
      onClick={() => router.push("/cv")}
      className="rounded-xl font-bold shadow-lg shadow-accent/20"
    >
      <Plus className="w-4 h-4 mr-2" />
      Nueva Evaluación
    </Button>
  );

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader
            title="Evaluaciones de IA"
            description="Analiza el rendimiento y recibe recomendaciones para optimizar tus CVs."
            actions={actions}
          />

          <div className="grid grid-cols-1 gap-3">
            {cvs.length > 0 && cvs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <EvaluationCard
                  cv={cv}
                  onAction={(id) => router.push(`/evaluations/${id}`)}
                />
              </motion.div>
            ))}
          {/*  Usa el placeholder solo si no hay CVs con evaluaciones */}
          {cvs.length === 0 && (
            <EmptyPlaceholder
              icon={BarChart3}
              title="No hay evaluaciones aún"
              description="Crea tu primera evaluación para recibir insights personalizados sobre tus CVs."
              action={actions}
            />
          )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
