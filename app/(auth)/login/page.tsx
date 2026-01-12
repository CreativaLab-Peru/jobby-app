import {LoginForm} from "@/features/authentication/components/login-form";

export default async function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
