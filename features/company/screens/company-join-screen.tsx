"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import {
  acceptCompanyInvitationAction,
  type AcceptCompanyInvitationState,
} from "@/features/company/actions/accept-company-invitation.action";

interface CompanyJoinScreenProps {
  token: string;
  companyName?: string;
  inviteEmail?: string;
  expiresAt?: string;
  expired?: boolean;
}

const initialState: AcceptCompanyInvitationState = {
  success: false,
  error: "",
};

export function CompanyJoinScreen({
  token,
  companyName,
  inviteEmail,
  expiresAt,
  expired,
}: CompanyJoinScreenProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(acceptCompanyInvitationAction, initialState);
  const [code, setCode] = useState("");
  const fieldErrors = "fieldErrors" in state ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [router, state.success]);

  return (
    <main className="px-4 py-10 h-screen w-screen">
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col gap-6 min-w-xl">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Validar invitación</CardTitle>
              <CardDescription>
                Este paso confirma tu email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="flex flex-col gap-6">
                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="code" value={code} />

                <FieldGroup>
                  <Field data-invalid={Boolean(fieldErrors?.email)}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={inviteEmail}
                      placeholder="tu@email.com"
                      disabled={true}
                      aria-invalid={Boolean(fieldErrors?.email)}
                    />
                    <FieldDescription>
                      Debe coincidir con el correo al que se envió la invitación.
                    </FieldDescription>
                    <FieldError errors={fieldErrors?.email ? [{ message: fieldErrors.email }] : undefined} />
                  </Field>

                  <Field data-invalid={Boolean(fieldErrors?.code)}>
                    <FieldLabel htmlFor="code">Código de 6 dígitos</FieldLabel>
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={setCode}
                      disabled={isPending || expired}
                      containerClassName="justify-center"
                      className="gap-3"
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2].map((index) => (
                          <InputOTPSlot key={index} index={index} className="h-14 w-12 rounded-xl border-2 border-muted bg-background text-xl font-bold focus-visible:ring-primary focus-visible:border-primary transition-all" />
                        ))}
                      </InputOTPGroup>
                      <InputOTPSeparator className="text-muted-foreground/50" />
                      <InputOTPGroup className="gap-2">
                        {[3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} index={index} className="h-14 w-12 rounded-xl border-2 border-muted bg-background text-xl font-bold focus-visible:ring-primary focus-visible:border-primary transition-all" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {/*<FieldDescription>*/}
                    {/*  Revisa tu bandeja de entrada y pega el código exacto que recibiste.*/}
                    {/*</FieldDescription>*/}
                    <FieldError errors={fieldErrors?.code ? [{ message: fieldErrors.code }] : undefined} />
                  </Field>
                </FieldGroup>

                {state.success === false && state.error ? (
                  <p className="text-destructive text-sm font-medium">{state.error}</p>
                ) : null}

                <Button type="submit" disabled={isPending || expired || code.length !== 6} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <ArrowRight data-icon="inline-start" />
                      Confirmar acceso
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

