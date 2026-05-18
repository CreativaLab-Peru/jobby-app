import {LoginForCompaniesForm} from "@/features/authentication/components/login-for-companies-form";
import {redirect} from "next/navigation";
import {getSession} from "@/features/authentication/actions/get-session";
import {getCompanyConfByNameAction} from "@/features/company/actions/get-company-conf-by-name";

interface CompanyLoginPageProps {
  params: Promise<{
    companyName: string;
  }>
}

export default async function CompanyLoginPage({params}: CompanyLoginPageProps) {
  const {companyName} = await params;

  const session = await getSession();
  if (session.success) redirect(`/c/${companyName}/dashboard`);

  const company = await getCompanyConfByNameAction(companyName);
  if (!company) redirect("/");

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <div className="relative z-10">
        <LoginForCompaniesForm
          slug={companyName}
          companyImageUrl={company.logoUrl}
        />
      </div>
    </div>
  );
}
