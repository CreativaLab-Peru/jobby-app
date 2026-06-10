import { redirect } from "next/navigation";
import { AdminScholarshipForm } from "@/features/scholarships/components/admin/admin-scholarship-form";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { getCountries } from "@/features/scholarships/actions/admin/get-countries";

export default async function AdminScholarshipNewPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const countriesResult = await getCountries();

  return (
    <AdminScholarshipForm
      countries={countriesResult.data ?? []}
    />
  );
}