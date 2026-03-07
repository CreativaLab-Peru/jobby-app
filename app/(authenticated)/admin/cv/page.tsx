import { redirect } from "next/navigation";

import { AdminCvListScreen } from "@/features/cv/components/admin/admin-cv-list-screen";
import { getAdminCvs } from "@/features/cv/actions/admin/get-admin-cvs";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCvPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    cvType?: string;
    opportunityType?: string;
    status?: string;
    view?: string;
  }>;
}

export default async function AdminCvPage({ searchParams }: AdminCvPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const cvType = params.cvType || undefined;
  const opportunityType = params.opportunityType || undefined;
  const status = params.status as "active" | "deleted" | undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminCvs(skip, pageSize, {
    query: query || undefined,
    cvType: cvType || null,
    opportunityType: opportunityType || null,
    status: status || null,
  });

  const cvs = result.success ? result.data.cvs : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminCvListScreen
      initialCvs={cvs}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialCvType={cvType || ""}
      initialOpportunityType={opportunityType || ""}
      initialStatus={status || ""}
      initialView={view}
      initialError={error}
    />
  );
}
