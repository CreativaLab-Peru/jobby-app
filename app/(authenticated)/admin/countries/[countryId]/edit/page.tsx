import { redirect } from "next/navigation";
import { getCountryById } from "@/features/scholarships/actions/admin/get-country-by-id";
import { AdminCountryForm } from "@/features/scholarships/components/admin/admin-country-form";
import { requireAdmin } from "@/features/share/actions/require-admin";

export default async function AdminCountryEditPage({
  params,
}: {
  params: Promise<{ countryId: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const { countryId } = await params;
  const result = await getCountryById(countryId);

  if (!result.success || !result.data) {
    redirect("/admin/countries");
  }

  return (
    <AdminCountryForm
      country={{
        id: result.data.id,
        name: result.data.name,
        code: result.data.code,
        flag: result.data.flag,
      }}
    />
  );
}