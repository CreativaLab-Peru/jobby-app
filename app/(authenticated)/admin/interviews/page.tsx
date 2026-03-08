import { redirect } from "next/navigation";

import { AdminInterviewListScreen } from "@/features/interview/components/admin/admin-interview-list-screen";
import { getAdminInterviews } from "@/features/interview/actions/admin/get-admin-interviews";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminInterviewsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    hasTranscript?: string;
    hasFeedback?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
  }>;
}

export default async function AdminInterviewsPage({ searchParams }: AdminInterviewsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const status = params.status || undefined;
  const hasTranscript = params.hasTranscript as "yes" | "no" | undefined;
  const hasFeedback = params.hasFeedback as "yes" | "no" | undefined;
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminInterviews(skip, pageSize, {
    query: query || undefined,
    status: status || null,
    hasTranscript: hasTranscript || null,
    hasFeedback: hasFeedback || null,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  const interviews = result.success ? result.data.interviews : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const stats = result.success ? result.data.stats : { total: 0, completed: 0, pending: 0, failed: 0, avgScore: null };
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminInterviewListScreen
      initialInterviews={interviews}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      stats={stats}
      initialQuery={query}
      initialStatus={status || ""}
      initialHasTranscript={hasTranscript || ""}
      initialHasFeedback={hasFeedback || ""}
      initialDateFrom={dateFrom || ""}
      initialDateTo={dateTo || ""}
      initialView={view}
      initialError={error}
    />
  );
}

