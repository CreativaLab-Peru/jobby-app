"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2, ShieldCheck, Mail, AlertCircle } from "lucide-react";
import { sendEmailToPay } from "@/features/home/actions/send-email-to-pay";

interface EmailModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export function EmailModal({ isOpen, closeModal }: EmailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState({
    value: "",
    error: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail({
      value: e.target.value,
      error: "",
    });
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return "Por favor, ingresa tu correo electrónico.";
    if (!emailRegex.test(value.trim())) return "Ingresa un correo electrónico válido.";
    return "";
  };

  const onAccept = () => {
    if (isPending) return;

    const errorMessage = validateEmail(email.value);
    if (errorMessage) {
      setEmail((prev) => ({ ...prev, error: errorMessage }));
      return;
    }

    startTransition(async () => {
      const response = await sendEmailToPay(email.value.trim());

      if (!response.success || response.error) {
        setEmail((prev) => ({
          ...prev,
          error: "Hubo un problema al continuar. Inténtalo de nuevo en unos minutos.",
        }));
        return;
      }

      const redirectUrl = response.redirect;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl p-8">
        <DialogHeader className="space-y-3 items-center text-center">
          {/* Icono decorativo para dar confianza */}
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-2">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground uppercase">
            Tu acceso a <span className="ai-gradient-text">Levely Pro</span>
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
                value={email.value}
                onChange={handleEmailChange}
                className={`w-full h-14 px-5 text-sm font-bold bg-muted/50 border-2 rounded-2xl transition-all focus-visible:ring-primary ${
                  email.error ? "border-red-500" : "border-transparent focus:border-primary"
                }`}
              />
            </div>
            {email.error && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-1 ml-1">
                <AlertCircle className="w-3 h-3" /> {email.error}
              </p>
            )}
          </div>

          <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-2xl flex gap-3 items-center">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
            <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Pago seguro con cifrado SSL. Tus datos están protegidos.
            </p>
          </div>

          <Button
            disabled={isPending}
            onClick={onAccept}
            className="w-full h-14 ai-gradient shadow-glow hover:shadow-primary/20 transition-all duration-300 text-sm font-black uppercase tracking-widest text-white border-none rounded-2xl"
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

// Icono faltante en los imports

