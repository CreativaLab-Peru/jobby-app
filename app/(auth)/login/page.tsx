import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/shared/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession()
  if (session?.success) {
    return redirect('/cv');
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
