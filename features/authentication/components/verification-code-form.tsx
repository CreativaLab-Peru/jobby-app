"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {verifyCodeAction} from "@/features/authentication/actions/verify-code-action";

interface Props {
  userId: string;
}

export function VerificationCodeForm({ userId }: Props) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Ingresa el código completo");
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyCodeAction(userId, code);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("¡Cuenta verificada con éxito!");
        router.push("/dashboard"); // Redirigir al usuario
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-10">
      {/* ... (resto de tu UI igual) ... */}
      <div className="relative">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center rotate-3 transition-transform hover:rotate-0">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-secondary w-8 h-8 rounded-full flex items-center justify-center border-4 border-background">
          <ShieldCheck className="w-4 h-4 text-secondary-foreground" />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Verifica tu email
        </h1>
        <p className="text-muted-foreground text-sm px-4">
          Ingresa el código de seguridad que enviamos a tu bandeja de entrada.
        </p>
      </div>

      <div className="space-y-8 w-full">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(val) => setCode(val)}
          disabled={isVerifying}
          className="gap-4"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2].map((i) => (
              <InputOTPSlot key={i} index={i} className="h-14 w-12 rounded-xl border-2 border-muted bg-background text-xl font-bold focus-visible:ring-primary focus-visible:border-primary transition-all" />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator className="text-muted-foreground/50" />
          <InputOTPGroup className="gap-2">
            {[3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="h-14 w-12 rounded-xl border-2 border-muted bg-background text-xl font-bold focus-visible:ring-primary focus-visible:border-primary transition-all" />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="space-y-4">
          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.length < 6}
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Validando...
              </>
            ) : (
              "Confirmar Código"
            )}
          </Button>
          {/* ... */}
        </div>
      </div>
    </div>
  );
}
