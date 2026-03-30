"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { sendEmailToPay } from "@/features/home/actions/send-email-to-pay";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Ingresa un correo válido"),
});

interface EmailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: (id: string, email: string) => void;
}

export function EmailModal({ isOpen, closeModal, onSuccess }: EmailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState<string | null>(null);

  const handleAction = () => {
    const result = formSchema.safeParse(formData);
    if (!result) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const {email, name} = result.data;
        // Asumiendo que actualizas el action para recibir el nombre también
        const res = await sendEmailToPay(email, name);

        if (!res.success) return setError(res.error || "Error al procesar.");

        closeModal();
        onSuccess?.(res.temporalUserId, result.data.email);
      } catch {
        setError("Error de conexión.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md p-8 rounded-3xl border-none shadow-2xl">
        <DialogHeader className="items-center text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Mail className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">
            Casi listo para <span className="text-primary">Levely</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-14 pl-11 bg-secondary/30 border-none rounded-2xl font-bold"
              />
            </div>
          </div>

          {/* Campo Email */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 pl-11 bg-secondary/30 border-none rounded-2xl font-bold"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive font-bold flex items-center gap-2 px-1 italic">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <Button
            onClick={handleAction}
            disabled={isPending}
            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-tighter rounded-2xl hover:scale-[1.02] transition-transform"
          >
            {isPending ? <Loader2 className="animate-spin" /> : (
              <>Continuar al pago <ArrowRight className="ml-2 w-5 h-5" /></>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-60">
              Pago seguro vía Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
