import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, ArrowRight } from "lucide-react";
import { PaymentMethodModal, PaymentMethod } from "./payment-method-modal";
import { CreditPackOffer } from "@/features/credits/consts";
import { useRouter } from "next/navigation";

interface PackProps {
  pack: CreditPackOffer;
  onPurchase: (packId: string, method: PaymentMethod) => void;
  isAuthenticated?: boolean;
  currentPlanId?: string;
}

export function CreditPackCard({
  pack,
  onPurchase,
  isAuthenticated = true,
  currentPlanId = "FREE",
}: PackProps) {
  const router = useRouter();
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  const isFree = pack.id === "FREE";
  const isCurrentPlan = currentPlanId === pack.id;

  // Logic for button label and state
  let buttonLabel = `Adquirir ${pack.name}`;
  let isDisabled = false;

  if (isFree) {
    if (!isAuthenticated) {
      buttonLabel = "Empezar gratis";
      isDisabled = false;
    } else {
      isDisabled = true;
      buttonLabel = isCurrentPlan ? "Plan actual" : "Ya incluido";
    }
  } else if (isCurrentPlan) {
    buttonLabel = "Plan actual / Recargar";
  }

  return (
    <>
      <div
        className={`relative flex flex-col bg-card border rounded-3xl p-8 transition-all hover:shadow-md ${
          pack.highlight ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border"
        }`}
      >
        {pack.highlight && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 uppercase text-[10px] tracking-widest font-bold">
            <Star className="w-3 h-3 mr-1 fill-current" /> Recomendado
          </Badge>
        )}

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2 text-zinc-900 dark:text-gray-300">
            {pack.name} {pack.highlight && <Sparkles className="h-5 w-5 text-primary" />}
          </h3>

          <div className="flex items-end justify-center gap-3">
            <span className="text-4xl font-extrabold text-zinc-900 dark:text-white leading-none">
              S/ {Number(pack.price).toFixed(2)}
            </span>

            {pack.priceUSD !== undefined && (
              <span className="text-lg font-semibold text-zinc-500 dark:text-gray-400 mb-1">
                $ {Number(pack.priceUSD).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2 uppercase font-semibold tracking-wider">
            {pack.subtitle}
          </p>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
          {pack.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              {f.included ? (
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              ) : (
                <div className="h-4 w-4 shrink-0" />
              )}
              <span
                className={
                  f.included
                    ? "text-zinc-700 font-medium dark:text-gray-300"
                    : "text-zinc-400 line-through"
                }
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          variant={pack.variant}
          disabled={isDisabled}
          className={`w-full py-6 rounded-2xl font-bold
            ${pack.highlight ? "bg-primary/90 hover:bg-primary text-secondary" : ""}
            ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={() => {
            if (!isAuthenticated) {
              if (isFree) {
                router.push("/onboarding/talents");
              } else {
                onPurchase(pack.id, PaymentMethod.MERCADOPAGO);
              }
              return;
            }
            setIsMethodModalOpen(true);
          }}
        >
          {buttonLabel} {pack.highlight && !isDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <PaymentMethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        packName={pack.name}
        price={pack.price}
        onSelectMethod={(method) => onPurchase(pack.id, method)}
      />
    </>
  );
}
