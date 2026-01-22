import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";
import {VerificationCodeForm} from "@/features/authentication/components/verification-code-form";

interface VerificationPageProps {
  searchParams: Promise<{
    email?: string;
  }>
}

export default async function VerifyPage({searchParams}: VerificationPageProps) {
  const { email } = await searchParams;

  const userPendingVerification = await prisma.user.findUnique({ where: { email, emailVerified: false } });
  if (!userPendingVerification) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md  dark:bg-slate-900 shadow-xl border rounded-3xl p-4 sm:p-8">
        <VerificationCodeForm userId={userPendingVerification.id} />
      </div>
    </main>
  );
}
