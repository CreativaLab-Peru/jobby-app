"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { AdminBalanceDetail } from "@/features/credits/actions/admin/get-admin-balance-by-id";
import { updateAdminBalance } from "@/features/credits/actions/admin/update-admin-balance";
import { addAdminCredits } from "@/features/credits/actions/admin/add-admin-credits";
import { CreditBalanceType } from "@prisma/client";
import { routes } from "@/lib/routes";

const BALANCE_TYPE_LABELS: Record<string, string> = {
  AI_ACTIONS: "Acciones IA",
  UPLOADS: "Subidas",
  MANAGE_CVS: "Gestion CVs",
  SEARCH_OPPORTUNITIES: "Buscar Oportunidades",
};

interface AdminBalanceEditFormProps {
  balance: AdminBalanceDetail;
}

export function AdminBalanceEditForm({ balance }: AdminBalanceEditFormProps) {
  const [amount, setAmount] = useState(balance.amount);
  const selectedType = balance.type as CreditBalanceType;
  const [isAddMode, setIsAddMode] = useState(true);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const typeLabel = BALANCE_TYPE_LABELS[balance.type] || balance.type;
  const userLabel = `${balance.user.name} (${balance.user.email})`;
  const diff = amount - balance.amount;
  const nextAmount = isAddMode ? balance.amount + amount : amount;
  const submitDisabled = isLoading || amount === 0 || nextAmount < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nextAmount < 0) {
      toast.error("El balance final no puede ser negativo");
      return;
    }

    setIsLoading(true);

    try {
      if (isAddMode) {
        // amount field is treated as delta to add
        const delta = amount;
        const res = await addAdminCredits(balance.userId, selectedType, delta, reason.trim() || undefined);
        if (res.success) {
          toast.success(res.message);
          router.push(routes.app.admin.balances.detail(res.balanceId));
          router.refresh();
        } else {
          const errorMsg = "error" in res ? res.error : "Error aplicando créditos";
          toast.error(errorMsg);
        }
      } else {
        // replace behavior on the current balance id (keeps existing semantics)
        const result = await updateAdminBalance(balance.id, {
          amount,
          reason: reason.trim() || undefined,
        });

        if (result.success) {
          toast.success(result.message);
          router.push(routes.app.admin.balances.detail(balance.id));
          router.refresh();
        } else {
          const errorMsg = (result as { error: string }).error || "Error actualizando balance";
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error procesando la solicitud");
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.balances.detail(balance.id))} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader title="Editar Balance" description={`${typeLabel} · ${userLabel}`} />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Read-only context */}
              <div className="rounded-lg border border-border/40 bg-secondary/10 p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informacion del balance (solo lectura)</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Usuario:</span> <span className="font-medium">{balance.user.name}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{balance.user.email}</span></div>
                  <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium">{typeLabel}</span></div>
                  <div><span className="text-muted-foreground">Balance actual:</span> <span className="font-bold">{balance.amount}</span></div>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold">
                  {isAddMode ? "Monto a agregar/quitar" : "Nuevo balance total"}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                    min={isAddMode ? undefined : 0}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input id="addMode" type="checkbox" checked={isAddMode} onChange={(e) => setIsAddMode(e.target.checked)} />
                  <label htmlFor="addMode" className="text-xs">Modo agregar (marcado): suma o resta sobre el balance actual. Desmarcado: reemplaza el balance total.</label>
                </div>
                {isAddMode && amount !== 0 && (
                  <p className={`text-xs font-semibold ${amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {amount > 0 ? `+${amount}` : amount} créditos ({amount > 0 ? "recarga" : "consumo"})
                  </p>
                )}
                {!isAddMode && diff !== 0 && (
                  <p className={`text-xs font-semibold ${diff > 0 ? "text-green-600" : "text-red-600"}`}>
                    {diff > 0 ? `+${diff}` : diff} créditos ({diff > 0 ? "recarga" : "consumo"})
                  </p>
                )}
                <p className={`text-xs ${nextAmount < 0 ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>
                  Balance resultante: {nextAmount}
                </p>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-semibold">Razon del ajuste (opcional)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Ajuste por soporte tecnico, bonus promocional..."
                  rows={2}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Se registrara como transaccion en el historial.</p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button type="button" variant="outline" onClick={() => router.push(routes.app.admin.balances.detail(balance.id))} disabled={isLoading} className="rounded-lg font-bold">Cancelar</Button>
                <Button type="submit" disabled={submitDisabled} className="rounded-lg font-bold shadow-sm">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isAddMode ? "Aplicar ajuste" : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

