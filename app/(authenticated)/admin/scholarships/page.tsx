import { redirect } from "next/navigation";
import { getScholarships } from "@/features/scholarships/actions/admin/get-scholarships";
import { AdminScholarshipListScreen } from "@/features/scholarships/components/admin/admin-scholarship-list-screen";
import { requireAdmin } from "@/features/share/actions/require-admin";

export default async function AdminScholarshipsPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const result = await getScholarships();

  return (
    <AdminScholarshipListScreen
      initialScholarships={result.data ?? []}
      initialError={result.success ? null : result.error ?? "Error desconocido"}
    />
  );
}