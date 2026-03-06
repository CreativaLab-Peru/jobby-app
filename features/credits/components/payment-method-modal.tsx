"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet } from "lucide-react"

export type PaymentMethod = "mercadopago" | "paddle"

interface PaymentMethodOption {
  id: PaymentMethod
  name: string
  description: string
  icon: React.ElementType
  available: boolean
  badge?: string
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "mercadopago",
    name: "Mercado Pago",
    description: "Tarjeta, transferencia bancaria o efectivo",
    icon: Wallet,
    available: true,
  },
  {
    id: "paddle",
    name: "Tarjeta Internacional",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    available: false,
    badge: "Próximamente",
  },
]

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  packName: string
  price: number
  onSelectMethod: (method: PaymentMethod) => void
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  packName,
  price,
  onSelectMethod,
}: PaymentMethodModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Elige tu método de pago</DialogTitle>
          <DialogDescription className="text-sm">
            {packName} —{" "}
            <span className="font-semibold text-foreground">S/ {price.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 mt-1">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                disabled={!method.available}
                onClick={() => {
                  if (method.available) {
                    onSelectMethod(method.id)
                    onClose()
                  }
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all w-full
                  ${
                    method.available
                      ? "hover:border-primary hover:bg-primary/5 cursor-pointer"
                      : "opacity-50 cursor-not-allowed bg-muted/30"
                  }`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    method.available
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{method.name}</span>
                    {method.badge && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0 font-semibold tracking-wide"
                      >
                        {method.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-[10px] text-center text-muted-foreground font-semibold uppercase tracking-widest opacity-50 pt-1">
          Pagos procesados de forma segura
        </p>
      </DialogContent>
    </Dialog>
  )
}
