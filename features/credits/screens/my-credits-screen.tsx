"use client";

import { AlertCircle, CreditCard, History } from "lucide-react";
import { motion } from "framer-motion";
import { CreditBalance } from "@/features/credits/components/credit-balance";
import { PricingSection } from "@/features/credits/components/pricing-section";
import { CreditPackOffer } from "@/features/credits/consts";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";

interface CreditLimits {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
}

interface MyCreditsScreenProps {
  currentCredit: CreditLimits;
  packs: CreditPackOffer[];
  currentPlanId: string;
  isAuthenticated?: boolean;
}

export function MyCreditsScreen({
  currentCredit,
  packs,
  currentPlanId,
  isAuthenticated = true,
}: MyCreditsScreenProps) {
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

          <PricingSection
            packs={packs}
            currentPlanId={currentPlanId}
            isAuthenticated={isAuthenticated}
          />

          <footer className="border rounded-2xl p-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <CreditCard className="h-5 w-5" /> Pago seguro
            </div>
            <p className="text-xs text-zinc-500 text-center max-w-sm">
              Aceptamos tarjetas de crédito y débito. Tus créditos se activarán automáticamente tras
              el pago.
            </p>
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
