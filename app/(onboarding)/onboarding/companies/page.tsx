import { CompanyOnboardingForm } from "@/features/company/components/onboarding/company-onboarding-form";
import { getSession } from "@/features/authentication/actions/get-session";
import { getUserCompanyAction } from "@/features/company/actions/get-user-company.action";
import { redirect } from "next/navigation";

export default async function CompanyOnboardingPage() {
  const session = await getSession();

  if (!session.success) {
    redirect("/login?callbackUrl=/onboarding/companies");
  }

  // Si el usuario ya tiene una empresa, redirigir al dashboard
  const company = await getUserCompanyAction();
  if (company) {
    redirect("/dashboard/company");
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <CompanyOnboardingForm />
      </div>
    </main>
  );
}
