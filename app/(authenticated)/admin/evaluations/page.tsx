import { redirect } from "next/navigation";

import { AdminEvaluationListScreen } from "@/features/cv/components/admin/admin-evaluation-list-screen";
import { getAdminEvaluations } from "@/features/cv/actions/admin/get-admin-evaluations";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { JobStatus } from "@prisma/client";

interface AdminEvaluationsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    cvType?: string;
    opportunityType?: string;
    view?: string;
  }>;
}

export default async function AdminEvaluationsPage({ searchParams }: AdminEvaluationsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const status = params.status as JobStatus | undefined;
  const cvType = params.cvType || undefined;
  const opportunityType = params.opportunityType || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminEvaluations(skip, pageSize, {
    query: query || undefined,
    status: status || null,
    cvType: cvType || null,
    opportunityType: opportunityType || null,
  });

  const evaluations = result.success ? result.data.evaluations : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminEvaluationListScreen
      initialEvaluations={evaluations}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialStatus={status || ""}
      initialCvType={cvType || ""}
      initialOpportunityType={opportunityType || ""}
      initialView={view}
      initialError={error}
    />
  );
}
