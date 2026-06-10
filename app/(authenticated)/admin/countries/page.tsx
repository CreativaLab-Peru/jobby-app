import { redirect } from "next/navigation";
import { getCountries } from "@/features/scholarships/actions/admin/get-countries";
import { AdminCountryListScreen } from "@/features/scholarships/components/admin/admin-country-list-screen";
import { requireAdmin } from "@/features/share/actions/require-admin";

export default async function AdminCountriesPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const result = await getCountries();

  return (
    <AdminCountryListScreen
      initialCountries={result.data ?? []}
      initialError={result.success ? null : result.error ?? "Error desconocido"}
    />
  );
}