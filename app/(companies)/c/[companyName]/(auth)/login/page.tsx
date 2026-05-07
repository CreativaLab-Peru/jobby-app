import {LoginForm} from "@/features/authentication/components/login-form";

export default async function CompanyLoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <div className="relative z-10">
        <LoginForm/>
      </div>
    </div>
  );
}
