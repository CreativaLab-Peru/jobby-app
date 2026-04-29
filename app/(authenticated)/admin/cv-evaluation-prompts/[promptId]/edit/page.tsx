import { notFound, redirect } from "next/navigation";

import { AdminCvEvaluationPromptEditForm } from "@/features/cv/components/admin/admin-cv-evaluation-prompt-edit-form";
import { getAdminCvEvaluationPromptById } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompt-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCvEvaluationPromptEditPageProps {
  params: Promise<{ promptId: string }>;
}

export default async function AdminCvEvaluationPromptEditPage({
  params,
}: AdminCvEvaluationPromptEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { promptId } = await params;
  const result = await getAdminCvEvaluationPromptById(promptId);

  if (!result.success) {
    notFound();
  }

  return <AdminCvEvaluationPromptEditForm prompt={result.data} />;
}

