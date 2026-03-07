"use client";

import {AlertCircle, CreditCard, History} from "lucide-react";
import { CreditBalance } from "@/features/credits/components/credit-balance";
import { CreditPackCard } from "@/features/credits/components/credit-pack-card";
import {useState, useTransition} from "react";
import {
  createPreferenceForAuthenticatedUser
} from "@/features/billing/actions/create-preference-for-authenticated-user";
import {CREDIT_PACKS} from "@/features/credits/consts";
import { PaymentMethod } from "@/features/credits/components/payment-method-modal";
import { createCheckoutForAuthenticatedUserPaddle } from "@/features/billing/actions/create-checkout-for-authenticated-user-paddle";
import { usePaddle } from "@/features/billing/components/paddle-provider";
import Link from "next/link";

interface CreditLimits {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
}

interface MyCreditsScreenProps {
  currentCredit: CreditLimits;
}

export function MyCreditsScreen({ currentCredit }: MyCreditsScreenProps) {

  const { openCheckout } = usePaddle();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handlePurchase = (packId: string, method: PaymentMethod) => {
    if (isPending) return;

    startTransition(async () => {
      if (method === PaymentMethod.PADDLE) {
        const result = await createCheckoutForAuthenticatedUserPaddle(packId);
        if (result.success) {
          openCheckout(result.transactionId);
        } else {
          setError(result.error);
        }
      } else {
        const result = await createPreferenceForAuthenticatedUser(packId);
        if (result.success) {
          window.location.href = result.redirect;
        } else {
          setError(result.error);
        }
      }
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <CreditBalance
        ai={currentCredit.aiActionsLimit}
        opps={currentCredit.opportunitiesActionsLimit}
        cvs={currentCredit.manageCvsLimit}
      />

      <Link
        href="/transactions"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <History className="h-4 w-4" />
        Ver historial de transacciones
      </Link>

      { error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          <AlertCircle className="inline mr-2 w-5 h-5 align-middle" /> {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {CREDIT_PACKS.map((pack) => (
          <CreditPackCard
            key={pack.id}
            pack={pack}
            onPurchase={(id, method) => handlePurchase(id, method)}
          />
        ))}
      </div>

      <footer className="border rounded-2xl p-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-5 w-5" /> Pago seguro
        </div>
        <p className="text-xs text-zinc-500 text-center max-w-sm">
          Aceptamos tarjetas de crédito y débito. Tus créditos se activarán automáticamente tras el pago.
        </p>
      </footer>
    </div>
  );
}
