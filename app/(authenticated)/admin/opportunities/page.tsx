import { redirect } from "next/navigation";

import { AdminOpportunityListScreen } from "@/features/opportunities/components/admin/admin-opportunity-list-screen";
import { getAdminOpportunities } from "@/features/opportunities/actions/admin/get-admin-opportunities";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { OpportunityType } from "@prisma/client";

interface AdminOpportunitiesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    view?: string;
  }>;
}

export default async function AdminOpportunitiesPage({ searchParams }: AdminOpportunitiesPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const type = params.type as OpportunityType | undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminOpportunities(skip, pageSize, {
    query: query || undefined,
    type: type || null,
  });

  const opportunities = result.success ? result.data.opportunities : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminOpportunityListScreen
      initialOpportunities={opportunities}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialType={type || ""}
      initialView={view}
      initialError={error}
    />
  );
}

