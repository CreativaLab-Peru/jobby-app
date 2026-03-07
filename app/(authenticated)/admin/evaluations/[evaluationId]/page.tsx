import { redirect } from "next/navigation";

import { AdminEvaluationDetailScreen } from "@/features/cv/components/admin/admin-evaluation-detail-screen";
import { getAdminEvaluationById } from "@/features/cv/actions/admin/get-admin-evaluation-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminEvaluationDetailPageProps {
  params: Promise<{ evaluationId: string }>;
}

export default async function AdminEvaluationDetailPage({
  params,
}: AdminEvaluationDetailPageProps) {
  const { evaluationId } = await params;

  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const result = await getAdminEvaluationById(evaluationId);
  if (!result.success) {
    redirect(routes.app.admin.evaluations.root);
  }

  return <AdminEvaluationDetailScreen evaluation={result.data} />;
}

