import {
  CompanyOnboardingForm
} from "@/features/company/components/onboarding/company-onboarding-form";
import { getCompanyConfByNameAction } from "@/features/company/actions/get-company-conf-by-name";

interface CompanyOnboardingPageProps {
  params: Promise<{
    companyName: string;
  }>
}

export default async function CompanyOnboardingPage({ params }: CompanyOnboardingPageProps) {
  const { companyName } = await params;
  const company = await getCompanyConfByNameAction(companyName);
  if (!company) {
    return (
      <div className="">
        No hay empresa raaa
      </div>
    )
  }

  const initialCompany = {
    id: company.id,
    name: company?.name,
    slug: company?.slug,
    logoUrl: company?.logoUrl ?? "",
    ruc: company?.ruc,
    website: company?.website,
    primaryColor: company?.primaryColor,
    secondaryColor: company?.secondaryColor,
  }

  return (
    <main
      className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <CompanyOnboardingForm
          initialData={initialCompany}
        />
      </div>
    </main>
  );
}
