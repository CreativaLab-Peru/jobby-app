import {AnimatedBackground} from "@/components/animated-background";
import {ForgotPasswordForm} from "@/features/authentication/components/forgot-password-form";

interface ForgotPasswordPageProps {
  params: Promise<{
    companyName: string;
  }>
}

export default async function ForgotPasswordPage({params}: ForgotPasswordPageProps) {
  const {companyName} = await params;
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <AnimatedBackground/>
      <div className="relative z-10">
        <ForgotPasswordForm/>
      </div>
    </div>
  );
}
