import { redirect } from "next/navigation";

import { AdminComplaintListScreen } from "@/features/complaints/components/admin/admin-complaint-list-screen";
import { getAdminComplaints } from "@/features/complaints/actions/admin/get-admin-complaints";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminComplaintsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
  }>;
}

export default async function AdminComplaintsPage({ searchParams }: AdminComplaintsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminComplaints(skip, pageSize, {
    query: query || undefined,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  const complaints = result.success ? result.data.complaints : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminComplaintListScreen
      initialComplaints={complaints}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialDateFrom={dateFrom || ""}
      initialDateTo={dateTo || ""}
      initialView={view}
      initialError={error}
    />
  );
}

