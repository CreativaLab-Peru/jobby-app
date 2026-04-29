"use client";

import { useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";
import { CreditPackOffer } from "@/features/credits/consts";
import { CreditPackCard } from "./credit-pack-card";
import { PaymentMethod } from "./payment-method-modal";
import { createPreferenceForAuthenticatedUser } from "@/features/billing/actions/create-preference-for-authenticated-user";
import { createCheckoutForAuthenticatedUserPaddle } from "@/features/billing/actions/create-checkout-for-authenticated-user-paddle";
import { usePaddle } from "@/features/billing/components/paddle-provider";

interface PricingSectionProps {
  packs: CreditPackOffer[];
  currentPlanId: string;
  isAuthenticated?: boolean;
  title?: string;
  description?: string;
}

export function PricingSection({
  packs,
  currentPlanId,
  isAuthenticated = false,
  title,
  description,
}: PricingSectionProps) {
  const { openCheckout } = usePaddle();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
  };

  return (
    <div className="space-y-8">
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
          {description && <p className="text-muted-foreground text-lg">{description}</p>}
        </div>
      )}

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <AlertCircle className="inline mr-2 w-5 h-5 align-middle" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <div key={pack.id} className="h-full">
            <CreditPackCard
              pack={pack}
              onPurchase={(id, method) => handlePurchase(id, method)}
              currentPlanId={currentPlanId}
              isAuthenticated={isAuthenticated}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
