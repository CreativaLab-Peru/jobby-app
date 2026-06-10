import { redirect } from "next/navigation";
import { AdminScholarshipForm } from "@/features/scholarships/components/admin/admin-scholarship-form";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { getScholarshipById } from "@/features/scholarships/actions/admin/get-scholarship-by-id";
import { getCountries } from "@/features/scholarships/actions/admin/get-countries";

export default async function AdminScholarshipEditPage({
  params,
}: {
  params: Promise<{ scholarshipId: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect("/dashboard");
  }

  const { scholarshipId } = await params;
  const [scholarshipResult, countriesResult] = await Promise.all([
    getScholarshipById(scholarshipId),
    getCountries(),
  ]);

  if (!scholarshipResult.success || !scholarshipResult.data) {
    redirect("/admin/scholarships");
  }

  const scholarship = scholarshipResult.data;

  return (
    <AdminScholarshipForm
      scholarship={{
        id: scholarship.id,
        name: scholarship.name,
        type: scholarship.type as any,
        requirements: scholarship.requirements,
        benefits: scholarship.benefits,
        deadline: scholarship.deadline,
        url: scholarship.url,
        isActive: scholarship.isActive,
        countryId: scholarship.country.id,
      }}
      countries={countriesResult.data ?? []}
    />
  );
}