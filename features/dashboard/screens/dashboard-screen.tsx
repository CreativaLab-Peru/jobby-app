"use client";

import { EmployabilityCard } from "@/features/dashboard/components/employability-card";
import { ResourcesCard } from "@/features/dashboard/components/resources-card";
import { RecommendationsList } from "@/features/dashboard/components/recommendations-list";
import { TopMatchesList } from "@/features/dashboard/components/top-matches-list";
import { DashboardStats } from "../actions/get-statistics-for-user";
import { CreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {motion} from "framer-motion";
import {PageHeader} from "@/components/shared/page-header";

interface DashboardScreenProps {
  score: number;
  stats: DashboardStats | null;
  recommendations: any[];
  subscription: DashboardStats["subscription"];
  limits?: CreditLimits;
}

export default function DashboardScreen({
  score,
  stats,
  recommendations,
  subscription,
  limits,
}: DashboardScreenProps) {

  const resources = [
    {
      label: "Evaluaciones",
      count: subscription?.manualCvsUsed || 0,
      colorClass: "text-primary",
    },
    {
      label: "CVs Creados",
      count: stats?.totalCvs || 0,
      colorClass: "text-levely-orange",
    },
  ];

  const opportunitiesCount = stats?.topOpportunities ? stats.topOpportunities.length : 0;

  return (

    <main className="min-h-[90-vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="space-y-8"
        >
          <PageHeader
            title="Mi Dashboard"
            description="Visualiza tu puntuación de empleabilidad, recursos disponibles y recomendaciones personalizadas para mejorar tu perfil profesional."
            actions={null}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EmployabilityCard score={score} sector={stats?.userSector || "General"} />
            </div>
            <div>
              <ResourcesCard resources={resources} opportunitiesCount={opportunitiesCount} />
            </div>
          </div>

          {/* Bottom Row: Growth Areas + Top Matches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecommendationsList recommendations={recommendations} />
            <TopMatchesList topOpportunities={stats?.topOpportunities || []} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
