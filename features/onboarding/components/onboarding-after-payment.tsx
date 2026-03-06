"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@prisma/client";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { finishOnboarding } from "@/features/onboarding/actions/finish-onboarding";
import { useRouter } from "next/navigation";

interface OnboardingAfterPaymentProps {
  user: User;
  token: string;
}

const FIRST_PASSWORD = process.env.FIRST_PASSWORD || "UANDAC@123ASD11323CA12";

export const OnboardingAfterPayment = ({ user, token }: OnboardingAfterPaymentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const isValid = password.length >= 8 && password === confirm;

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");

    startTransition(async () => {
      try {
        // 1. Auth inicial con password temporal del sistema
        console.log("[credentials]", { email: user.email, password: FIRST_PASSWORD });
        const login = await authClient.signIn.email({
          email: user.email,
          password: FIRST_PASSWORD,
        });
        if (login.error) {
          console.error(login.error);
          throw new Error("Login failed");
        }

        // 2. Cambiar clave temporal por la elegida por el usuario
        const passUpdate = await authClient.changePassword({
          currentPassword: FIRST_PASSWORD,
          newPassword: password,
        });
        if (passUpdate.error) throw new Error("Password update failed");

        // 3. Marcar onboarding como finalizado en Prisma
        const dbRes = await finishOnboarding({
          email: user.email,
          name: user.name || "User",
          token: token,
          acceptedTerms: true
        });
        if (!dbRes?.success) throw new Error("DB update failed");

        setStatus("success");

        // Redirección final
        setTimeout(() => {
          router.push("/onboarding/talents");
        }, 2000);

      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-border shadow-xl bg-card/50 backdrop-blur-sm relative overflow-hidden">
          {/* Decoración sutil superior */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
              Bienvenido a <span className="text-primary">Levely</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Tu pago fue exitoso. Configura tu contraseña para acceder.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" || status === "loading" ? (
              <motion.form
                key="form"
                onSubmit={handleFinalize}
                className="space-y-6"
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted/50 cursor-not-allowed" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pass">Nueva Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="pass"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="pr-10"
                        disabled={status === "loading"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conf">Confirmar Contraseña</Label>
                    <Input
                      id="conf"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repite tu contraseña"
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || status === "loading"}
                  className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white transition-all shadow-glow"
                >
                  {status === "loading" ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <>Finalizar y Entrar <ArrowRight className="ml-2" size={18} /></>
                  )}
                </Button>
              </motion.form>
            ) : status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center space-y-4"
              >
                <div className="bg-secondary/20 p-4 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-secondary" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">¡Todo listo!</h2>
                  <p className="text-muted-foreground">Tu cuenta ha sido activada correctamente.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="error"
                className="flex flex-col items-center py-6 text-center space-y-4"
              >
                <AlertCircle className="w-16 h-16 text-destructive" />
                <h2 className="text-xl font-bold">Error de sincronización</h2>
                <Button variant="outline" onClick={() => setStatus("idle")}>
                  Intentar de nuevo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <p className="mt-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
          Levely AI Secure Onboarding v1.0
        </p>
      </motion.div>
    </div>
  );
};
