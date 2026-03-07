import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, ArrowRight } from "lucide-react";
import { PaymentMethodModal, PaymentMethod } from "./payment-method-modal";

interface PackProps {
  pack: {
    id: string;
    name: string;
    price: number;
    limits: { manageCvsLimit: number; aiActionsLimit: number; opportunitiesActionsLimit: number };
    features: { text: string; included: boolean }[];
    highlight: boolean;
    variant: "outline" | "default";
  };
  onPurchase: (packId: string, method: PaymentMethod) => void;
  isAuthenticated?: boolean;
}

export function CreditPackCard({ pack, onPurchase, isAuthenticated = true }: PackProps) {
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  return (
    <>
      <div className={`relative flex flex-col bg-card border rounded-3xl p-8 transition-all hover:shadow-md ${
        pack.highlight ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border"
      }`}>
        {pack.highlight && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 uppercase text-[10px] tracking-widest font-bold text-white">
            <Star className="w-3 h-3 mr-1 fill-current" /> Recomendado
          </Badge>
        )}

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2 text-zinc-900 dark:text-gray-300">
            {pack.name} {pack.highlight && <Sparkles className="h-5 w-5 text-primary" />}
          </h3>
          <span className="text-4xl font-black text-zinc-900 dark:text-gray-300">S/ {pack.price.toFixed(2)}</span>
          <p className="text-xs text-muted-foreground mt-2 uppercase font-semibold tracking-wider">Pago único</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8 text-center text-[10px] font-bold uppercase">
          <div className="bg-purple-50 p-2 rounded-xl border border-purple-100 dark:bg-purple-900/50 dark:text-purple-100 dark:border-purple-800">
            <p>IA</p>
            <p className="text-lg">+{pack.limits.aiActionsLimit}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-800">
            <p>Oport.</p>
            <p className="text-lg">+{pack.limits.opportunitiesActionsLimit}</p>
          </div>
          <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-100 dark:bg-zinc-900/50 dark:text-zinc-100 dark:border-zinc-800">
            <p>CVs</p>
            <p className="text-lg">{pack.limits.manageCvsLimit}</p>
          </div>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
          {pack.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              {f.included ? <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> : <div className="h-4 w-4 shrink-0" />}
              <span className={f.included ? "text-zinc-700 font-medium dark:text-gray-300" : "text-zinc-400 line-through"}>{f.text}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={pack.variant}
          className={`w-full py-6 rounded-2xl font-bold
            ${pack.highlight
              ? "bg-primary/90 hover:bg-primary text-secondary"
              : ""}`}
          onClick={() => {
            if (!isAuthenticated) {
              onPurchase(pack.id, PaymentMethod.MERCADOPAGO); // método ignorado, solo dispara el auth modal
              return;
            }
            setIsMethodModalOpen(true);
          }}
        >
          Adquirir {pack.name} {pack.highlight && <ArrowRight className="ml-2 h-4 w-4" />}
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
