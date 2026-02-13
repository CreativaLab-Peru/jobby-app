"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardStats } from "../actions/get-statistics-for-user";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {EmployabilityCard} from "@/features/dashboard/components/employability-card";
import {TopMatchesList} from "@/features/dashboard/components/top-matches-list";
import {ResourcesCard} from "@/features/dashboard/components/resources-card";
import {RecommendationsList} from "@/features/dashboard/components/recommendations-list";

interface DashboardScreenProps {
  score: number;
  stats: DashboardStats | null;
  recommendations: any[];
  subscription: DashboardStats["subscription"];
  limits?: CreditLimits;
}

const resources = [
  {
    label: "Evaluaciones",
    count: 10,
    colorClass: "text-primary",
  },
  {
    label: "CVs Creados",
    count: 20,
    colorClass: "text-levely-orange",
  },
];


export default function DashboardScreen({
                                          score,
                                          stats,
                                          recommendations,
                                          subscription,
                                        }: DashboardScreenProps) {

  const opportunities = stats?.topOpportunities || [];

  return (
    <main className="min-h-[80vh] p-4 md:p-8 bg-background/30 ">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Mi Dashboard"
            description="Progreso profesional y análisis de IA en tiempo real."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <EmployabilityCard
                score={score}
                sector={stats?.userSector || "General"}
              />
            </div>
            <div className="lg:col-span-5">
              <ResourcesCard
                resources={resources}
                opportunitiesCount={opportunities.length}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecommendationsList recommendations={recommendations} />
            <TopMatchesList topOpportunities={opportunities} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
