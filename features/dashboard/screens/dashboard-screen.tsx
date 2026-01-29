"use client";

import { EmployabilityCard } from "@/features/dashboard/components/employability-card";
import { ResourcesCard } from "@/features/dashboard/components/resources-card";
import { RecommendationsList } from "@/features/dashboard/components/recommendations-list";
import { TopMatchesList } from "@/features/dashboard/components/top-matches-list";
import { DashboardStats } from "../actions/get-statistics-for-user";
interface DashboardScreenProps {
  score: number;
  stats: DashboardStats | null;
  recommendations: any[];
  subscription: any;
}

export default function DashboardScreen({
  score,
  stats,
  recommendations,
  subscription,
}: DashboardScreenProps) {
  const resources = [
    {
      label: "Evaluaciones",
      used: subscription?.manualCvsUsed || 0,
      limit: subscription?.plan?.manualCvLimit || 5,
      colorClass: "text-primary",
    },
    {
      label: "CVs Creados",
      used: stats?.totalCvs || 0,
      limit: subscription?.plan?.uploadCvLimit || 3,
      colorClass: "text-secondary",
    },
    // TODO: Add more resources as needed
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Row: Employability + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmployabilityCard score={score} sector={stats?.userSector || "General"} />
        </div>
        <div>
          <ResourcesCard resources={resources} />
        </div>
      </div>

      {/* Bottom Row: Growth Areas + Top Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecommendationsList recommendations={recommendations} />
        <TopMatchesList topOpportunities={stats?.topOpportunities || []} />
      </div>
    </div>
  );
}
