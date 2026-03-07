import { redirect } from "next/navigation";
import { JobStatus } from "@prisma/client";

import { AdminJobListScreen } from "@/features/jobs/components/admin/admin-job-list-screen";
import { getAdminJobs } from "@/features/jobs/actions/admin/get-admin-jobs";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminJobsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    type?: string;
    hasError?: string;
    hasCv?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
  }>;
}

export default async function AdminJobsPage({ searchParams }: AdminJobsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 15;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const status = params.status as JobStatus | undefined;
  const type = params.type || undefined;
  const hasError = params.hasError as "yes" | "no" | undefined;
  const hasCv = params.hasCv as "yes" | "no" | undefined;
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminJobs(skip, pageSize, {
    query: query || undefined,
    status: status || null,
    type: type || null,
    hasError: hasError || null,
    hasCv: hasCv || null,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  const jobs = result.success ? result.data.jobs : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const stats = result.success ? result.data.stats : { pending: 0, inProgress: 0, succeeded: 0, failed: 0, cancelled: 0 };
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminJobListScreen
      initialJobs={jobs}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      stats={stats}
      initialQuery={query}
      initialStatus={status || ""}
      initialType={type || ""}
      initialHasError={hasError || ""}
      initialHasCv={hasCv || ""}
      initialDateFrom={dateFrom || ""}
      initialDateTo={dateTo || ""}
      initialView={view}
      initialError={error}
    />
  );
}

