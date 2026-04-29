import { redirect } from "next/navigation";

import { AdminCvEvaluationPromptListScreen } from "@/features/cv/components/admin/admin-cv-evaluation-prompt-list-screen";
import { getAdminCvEvaluationPrompts } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompts";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCvEvaluationPromptsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
  }>;
}

export default async function AdminCvEvaluationPromptsPage({
  searchParams,
}: AdminCvEvaluationPromptsPageProps) {
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

  const result = await getAdminCvEvaluationPrompts(skip, pageSize, {
    query: query || undefined,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  const prompts = result.success ? result.data.prompts : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminCvEvaluationPromptListScreen
      initialPrompts={prompts}
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

