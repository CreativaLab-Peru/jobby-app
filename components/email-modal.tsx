"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2, ShieldCheck, Mail, AlertCircle } from "lucide-react";
import { sendEmailToPay } from "@/features/home/actions/send-email-to-pay";
import { z } from "zod";

const emailSchema = z.string()
  .min(1, { message: "El correo es obligatorio." })
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: "Ingresa un correo electrónico válido (ejemplo@dominio.com)." }
  );

interface EmailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: (temporalUserId: string, email: string) => void;
}

export function EmailModal({ isOpen, closeModal, onSuccess }: EmailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [emailValue, setEmailValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
    if (errorMessage) setErrorMessage(null); // Limpiamos error al escribir
  };

  const onAccept = () => {
    if (isPending) return;

    // 1. Validación con Zod
    const result = emailSchema.safeParse(emailValue);

    if (!result.success) {
      setErrorMessage(result.error?.[0]?.message || "Correo no válido.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await sendEmailToPay(result.data.trim());

        // 2. Manejo de errores que vienen del Action
        if (!response.success) {
          setErrorMessage(response.error || "Algo salió mal. Inténtalo de nuevo.");
          return;
        }

        closeModal();
        if (onSuccess) onSuccess(response.temporalUserId, result.data.trim());
      } catch (error) {
        setErrorMessage("Error de conexión. Revisa tu internet.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl p-8">
        <DialogHeader className="space-y-3 items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground uppercase">
            Tu acceso a <span className="text-primary">Levely Starter</span>
          </DialogTitle>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Ingresa el correo donde deseas recibir tus créditos y el enlace de facturación.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Input
                id="payment-email"
                type="email"
                placeholder="estudiante@universidad.edu"
                value={emailValue}
                onChange={handleEmailChange}
                disabled={isPending}
                className={`w-full h-14 px-5 text-sm font-bold bg-secondary/20 border-2 rounded-2xl transition-all focus-visible:ring-primary ${
                  errorMessage ? "border-destructive focus:border-destructive" : "border-transparent focus:border-primary"
                }`}
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-destructive font-bold flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" /> {errorMessage}
              </p>
            )}
          </div>

          <div className="bg-secondary text-secondary-foreground border border-secondary/30 p-4 rounded-2xl flex gap-3 items-center">
            <ShieldCheck className="w-5 h-5 shrink-0 opacity-90" />
            <p className="text-[11px] font-bold uppercase">
              Pago seguro con cifrado SSL. Tus datos están protegidos.
            </p>
          </div>

          <Button
            disabled={isPending}
            onClick={onAccept}
            className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 text-sm font-black uppercase tracking-widest text-primary-foreground border-none rounded-2xl"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Validando...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continuar al pago
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
