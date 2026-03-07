import { redirect, notFound } from "next/navigation";

import { AdminEvaluationForm } from "@/features/cv/components/admin/admin-evaluation-form";
import { getAdminEvaluationById } from "@/features/cv/actions/admin/get-admin-evaluation-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminEvaluationEditPageProps {
  params: Promise<{ evaluationId: string }>;
}

export default async function AdminEvaluationEditPage({
  params,
}: AdminEvaluationEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { evaluationId } = await params;
  const result = await getAdminEvaluationById(evaluationId);

  if (!result.success) {
    notFound();
  }

  return <AdminEvaluationForm evaluation={result.data} />;
}

