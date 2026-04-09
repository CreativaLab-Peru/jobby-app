"use client";

import { AlertCircle, CreditCard, History } from "lucide-react";
import { motion } from "framer-motion";
import { CreditBalance } from "@/features/credits/components/credit-balance";
import { CreditPackCard } from "@/features/credits/components/credit-pack-card";
import { useState, useTransition } from "react";
import { createPreferenceForAuthenticatedUser } from "@/features/billing/actions/create-preference-for-authenticated-user";
import { CreditPackOffer } from "@/features/credits/consts";
import { PaymentMethod } from "@/features/credits/components/payment-method-modal";
import { createCheckoutForAuthenticatedUserPaddle } from "@/features/billing/actions/create-checkout-for-authenticated-user-paddle";
import { usePaddle } from "@/features/billing/components/paddle-provider";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

interface CreditLimits {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
}

interface MyCreditsScreenProps {
  currentCredit: CreditLimits;
  packs: CreditPackOffer[];
}

export function MyCreditsScreen({ currentCredit, packs }: MyCreditsScreenProps) {
  const { openCheckout } = usePaddle();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [displayCurrency, setDisplayCurrency] = useState<"PEN" | "USD">("PEN");

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
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Mis Créditos"
            description="Administra tus créditos y adquiere paquetes para desbloquear más funciones."
          />

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

          <div className="w-full flex flex-col items-center gap-2">
            <span className="font-bold text-sm text-muted-foreground">Moneda</span>

            <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2">
              <span
                className={
                  displayCurrency === "PEN"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }
              >
                S/ PEN
              </span>

              <Switch
                id="currency-switch"
                checked={displayCurrency === "USD"}
                onCheckedChange={(checked) => setDisplayCurrency(checked ? "USD" : "PEN")}
                aria-label="Cambiar moneda entre soles y dólares"
              />

              <span
                className={
                  displayCurrency === "USD"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }
              >
                $ USD
              </span>
            </div>
          </div>

          {error && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              <AlertCircle className="inline mr-2 w-5 h-5 align-middle" /> {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {packs.map((pack) => (
              <CreditPackCard
                key={pack.id}
                pack={pack}
                onPurchase={(id, method) => handlePurchase(id, method)}
                displayCurrency={displayCurrency}
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
        </motion.div>
      </div>
    </main>
  );
}
