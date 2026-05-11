"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck, Mail, Building2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import {
  acceptCompanyInvitationAction,
  type AcceptCompanyInvitationState,
} from "@/features/company/actions/accept-company-invitation.action";

interface CompanyJoinScreenProps {
  token: string;
  companyName?: string;
  inviteEmail?: string;
  maskedEmail?: string;
  slug?: string;
  expiresAt?: string;
  expired?: boolean;
}

const initialState: AcceptCompanyInvitationState = {
  success: false,
  error: "",
};

export function CompanyJoinScreen({
                                    token,
                                    slug,
                                    companyName = "la empresa",
                                    inviteEmail,
                                    maskedEmail,
                                    expired,
                                  }: CompanyJoinScreenProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(acceptCompanyInvitationAction, initialState);
  const [code, setCode] = useState("");
  const fieldErrors = "fieldErrors" in state ? state.fieldErrors : undefined;

  console.log("[state]", state);

  useEffect(() => {
    if (state.success) {
      router.push(`/c/${slug}/register?token=${token}`);
    }
  }, [router, state.success]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] space-y-6"
      >
        {/* Logo / Icono de Bienvenida */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 shadow-sm border border-primary/20">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Únete a {companyName}</h1>
          <p className="text-muted-foreground text-sm max-w-[300px]">
            Confirma tu identidad para acceder al espacio de trabajo.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
          <CardContent className="pt-8 p-8">
            <form action={formAction} className="space-y-8">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="code" value={code} />
              <input type="hidden" name="email" value={inviteEmail} />

              <FieldGroup className="space-y-6">
                {/* Email - Read Only View */}
                <div className="rounded-2xl bg-muted/50 p-4 border border-border/40 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border shadow-sm">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email de invitación</p>
                    <p className="text-sm font-medium text-foreground">{maskedEmail}</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>

                {/* OTP Input */}
                <Field data-invalid={Boolean(fieldErrors?.code)}>
                  <div className="flex items-center justify-between mb-4">
                    <FieldLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Código de Verificación
                    </FieldLabel>
                    <Badge variant="outline" className="text-[10px] font-bold py-0 h-5 border-primary/20 text-primary">
                      6 DÍGITOS
                    </Badge>
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    disabled={isPending || expired}
                    containerClassName="justify-between"
                  >
                    <InputOTPGroup className="gap-3">
                      {[0, 1, 2].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-14 w-12 md:h-16 md:w-14 rounded-2xl border-2 bg-background text-2xl font-bold transition-all data-[focus]:ring-4 data-[focus]:ring-primary/10 data-[focus]:border-primary"
                        />
                      ))}
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-muted-foreground/30" />
                    <InputOTPGroup className="gap-3">
                      {[3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-14 w-12 md:h-16 md:w-14 rounded-2xl border-2 bg-background text-2xl font-bold transition-all data-[focus]:ring-4 data-[focus]:ring-primary/10 data-[focus]:border-primary"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <FieldDescription className="text-center mt-4">
                    Ingresa el código enviado a tu bandeja de entrada.
                  </FieldDescription>
                  <FieldError errors={fieldErrors?.code ? [{ message: fieldErrors.code }] : undefined} />
                </Field>
              </FieldGroup>

              {/* Status / Errors */}
              <AnimatePresence>
                {(state.fieldErrors?.email || expired) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{expired ? "Esta invitación ha expirado." : state.fieldErrors?.email}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending || expired || code.length !== 6}
                className="w-full h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    VERIFICANDO...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    CONFIRMAR ACCESO
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
