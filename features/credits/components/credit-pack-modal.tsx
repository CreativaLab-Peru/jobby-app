"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {CreditPackCard} from "./credit-pack-card"
import {Zap} from "lucide-react"
import {useCreditModal} from "@/features/credits/hooks/use-credit-modal";
import {CreditPackOffer} from "@/features/credits/consts";
import {useState, useTransition} from "react";
import {
  createPreferenceForNewUser
} from "@/features/billing/actions/create-preference-for-new-user";
import {PaymentMethod} from "@/features/credits/components/payment-method-modal";
import {
  createCheckoutForNewUserPaddle
} from "@/features/billing/actions/create-checkout-for-new-user-paddle";
import {usePaddle} from "@/features/billing/components/paddle-provider";

interface CreditPackModalProps {
  packs: CreditPackOffer[];
  tempUserId?: string;
}

export function CreditPackModal({
                                  packs,
                                  tempUserId
                                }: CreditPackModalProps) {
  const {isOpen, onClose} = useCreditModal();

  const {openCheckout} = usePaddle();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handlePurchase = (_packId: string, method: PaymentMethod) => {
    if (isPending) return;

    if (!tempUserId) {
      console.log("[NOT_TEMP_USER_ID]", tempUserId);
      return;
    }

    startTransition(async () => {
      if (method === "paddle") {
        const result = await createCheckoutForNewUserPaddle(tempUserId);
        if (result.success) {
          openCheckout(result.transactionId);
        } else {
          setError(result.error);
        }
      } else {
        const result = await createPreferenceForNewUser(tempUserId);
        if (result.success) {
          window.location.href = result.redirect;
        } else {
          setError(result.error);
        }
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-6xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        {/* Contenedor con estilo de Dashboard */}
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 pb-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="mx-auto md:mx-0 p-3 bg-primary/10 rounded-2xl text-primary">
                <Zap className="w-6 h-6 fill-primary"/>
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Potencia tu Análisis</DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Obtén créditos para optimizar más perfiles con IA avanzada.
                </DialogDescription>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

          </DialogHeader>

          <div className="p-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packs.map((pack) => (
                <CreditPackCard
                  key={pack.id}
                  pack={pack}
                  onPurchase={(id, method) => handlePurchase(id, method)}
                />
              ))}
            </div>

            <p
              className="mt-6 text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-50">
              Pagos seguros procesados por Stripe
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
