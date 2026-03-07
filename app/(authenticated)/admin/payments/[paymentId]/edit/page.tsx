import { redirect, notFound } from "next/navigation";

import { AdminPaymentEditForm } from "@/features/billing/components/admin/admin-payment-edit-form";
import { getAdminPaymentById } from "@/features/billing/actions/admin/get-admin-payment-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminPaymentEditPageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function AdminPaymentEditPage({ params }: AdminPaymentEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { paymentId } = await params;
  const result = await getAdminPaymentById(paymentId);

  if (!result.success) {
    notFound();
  }

  return <AdminPaymentEditForm payment={result.data} />;
}

