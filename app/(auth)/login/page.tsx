import { getSession } from "@/features/authentication/actions/get-session";;
import { redirect } from "next/navigation";
import {LoginForm} from "@/features/authentication/components/login-form";

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
