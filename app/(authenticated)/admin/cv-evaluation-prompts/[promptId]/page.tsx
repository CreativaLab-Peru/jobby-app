import { notFound, redirect } from "next/navigation";

import { AdminCvEvaluationPromptDetailScreen } from "@/features/cv/components/admin/admin-cv-evaluation-prompt-detail-screen";
import { getAdminCvEvaluationPromptById } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompt-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCvEvaluationPromptDetailPageProps {
  params: Promise<{ promptId: string }>;
}

export default async function AdminCvEvaluationPromptDetailPage({
  params,
}: AdminCvEvaluationPromptDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { promptId } = await params;
  const result = await getAdminCvEvaluationPromptById(promptId);

  if (!result.success) {
    notFound();
  }

  return <AdminCvEvaluationPromptDetailScreen prompt={result.data} />;
}

