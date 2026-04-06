import {Users, FileText, ClipboardCheck, Target, Map, MessageSquareWarning} from "lucide-react";

import {PageHeader} from "@/components/shared/page-header";
import {EmptyPlaceholder} from "@/components/shared/empty-placeholder";
import {AdminDashboardStats} from "@/features/dashboard/actions/admin/get-admin-dashboard-stats";
import {
  AdminDashboardRangeTabs
} from "@/features/dashboard/components/admin/admin-dashboard-range-tabs";
import {
  AdminDashboardStatCard
} from "@/features/dashboard/components/admin/admin-dashboard-stat-card";
import {AdminDashboardRange} from "@/features/dashboard/utils/get-range";

interface AdminDashboardScreenProps {
  stats: AdminDashboardStats | null;
  activeRange: AdminDashboardRange;
  error?: string | null;
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export function AdminDashboardScreen({
                                       stats,
                                       activeRange,
                                       error,
                                     }: AdminDashboardScreenProps) {
  const hasError = Boolean(error);
  const dateRangeLabel = stats
    ? `${formatDate(stats.since)} - ${formatDate(stats.until)}`
    : "-";

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-8">
          <PageHeader
            title="Admin Dashboard"
            description="Resumen operativo del crecimiento y pipeline del producto."
          />

          <div
            className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Rango activo
              </div>
              <div className="text-sm font-semibold text-foreground">{dateRangeLabel}</div>
            </div>
            <AdminDashboardRangeTabs activeRange={activeRange}/>
          </div>

          {hasError ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10">
              <EmptyPlaceholder
                icon={Target}
                title="No se pudieron cargar las metricas"
                description={error || "Hubo un problema obteniendo los datos."}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <AdminDashboardStatCard
                title="Usuarios nuevos"
                value={stats?.totals.users ?? 0}
                icon={Users}
                subtitle="Usuarios registrados"
                toneClassName="bg-blue-500/10 text-blue-600"
              />
              <AdminDashboardStatCard
                title="CVs nuevos"
                value={stats?.totals.cvs ?? 0}
                icon={FileText}
                subtitle="CVs creados"
                toneClassName="bg-emerald-500/10 text-emerald-600"
              />
              <AdminDashboardStatCard
                title="Evaluaciones"
                value={stats?.totals.evaluations ?? 0}
                icon={ClipboardCheck}
                subtitle="Evaluaciones finalizadas"
                toneClassName="bg-amber-500/10 text-amber-600"
              />
              <AdminDashboardStatCard
                title="Oportunidades"
                value={stats?.totals.opportunities ?? 0}
                icon={Target}
                subtitle="Match generados"
                toneClassName="bg-violet-500/10 text-violet-600"
              />
              <AdminDashboardStatCard
                title="Roadmaps"
                value={stats?.totals.roadmaps ?? 0}
                icon={Map}
                subtitle="Roadmaps IA"
                toneClassName="bg-sky-500/10 text-sky-600"
              />
              <AdminDashboardStatCard
                title="Reclamos"
                value={stats?.totals.complaints ?? 0}
                icon={MessageSquareWarning}
                subtitle="Libro de reclamaciones"
                toneClassName="bg-rose-500/10 text-rose-600"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
