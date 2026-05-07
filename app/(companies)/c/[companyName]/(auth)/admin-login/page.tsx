import {LoginForCompaniesForm} from "@/features/authentication/components/login-for-companies-form";
import {getCompanyConfByNameAction} from "@/features/company/actions/get-company-conf-by-name";

interface CompanyLoginPageProps {
  params: Promise<{
    companyName: string;
  }>,
  children: React.ReactNode;
}

export default async function CompanyLoginPage({params}: CompanyLoginPageProps) {
  const { companyName } = await params;
  const companyConfig = await getCompanyConfByNameAction(companyName);

  if (!companyConfig) {
    return {
      title: "Empresa no encontrada | Levely",
    };
  }
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <div className="relative z-10">
        <LoginForCompaniesForm slug={companyName}/>
      </div>
    </div>
  );
}
