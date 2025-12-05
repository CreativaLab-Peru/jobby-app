"use client";

import { AnimatedBackground } from "@/components/animated-background";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
  <div className="relative flex items-center justify-center min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
