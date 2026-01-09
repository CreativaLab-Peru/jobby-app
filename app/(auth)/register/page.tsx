import {RegisterForm} from "@/components/auth/register-form";
import {getSession} from "@/lib/shared/session";
import {redirect} from "next/navigation";

export default async function RegisterPage() {
  const session = await getSession()
  if (session?.success) {
    return redirect('/cv');
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
