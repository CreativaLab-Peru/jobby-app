import { redirect, notFound } from "next/navigation";

import { AdminPaymentDetailScreen } from "@/features/billing/components/admin/admin-payment-detail-screen";
import { getAdminPaymentById } from "@/features/billing/actions/admin/get-admin-payment-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminPaymentDetailPageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { paymentId } = await params;
  const result = await getAdminPaymentById(paymentId);

  if (!result.success) {
    notFound();
  }

  return <AdminPaymentDetailScreen payment={result.data} />;
}

