import { redirect } from "next/navigation";
import { AdminCountryForm } from "@/features/scholarships/components/admin/admin-country-form";
import { requireAdmin } from "@/features/share/actions/require-admin";

export default async function AdminCountryNewPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  return <AdminCountryForm />;
}