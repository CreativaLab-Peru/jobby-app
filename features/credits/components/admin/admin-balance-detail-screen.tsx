"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, Calendar, Edit, RotateCcw, User as UserIcon, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminBalanceDetail } from "@/features/credits/actions/admin/get-admin-balance-by-id";
import { deleteAdminBalance } from "@/features/credits/actions/admin/delete-admin-balance";
import { routes } from "@/lib/routes";

const BALANCE_TYPE_LABELS: Record<string, string> = {
  AI_ACTIONS: "Acciones IA",
  UPLOADS: "Subidas",
  MANAGE_CVS: "Gestion CVs",
  SEARCH_OPPORTUNITIES: "Buscar Oportunidades",
};

const TX_TYPE_LABELS: Record<string, string> = {
  RECHARGE: "Recarga",
  CONSUMPTION: "Consumo",
  REFUND: "Reembolso",
  BONUS: "Bonus",
};

interface AdminBalanceDetailScreenProps {
  balance: AdminBalanceDetail;
}

export function AdminBalanceDetailScreen({ balance }: AdminBalanceDetailScreenProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const typeLabel = BALANCE_TYPE_LABELS[balance.type] || balance.type;
  const txCount = balance._count.creditTransaction;
  const userLabel = `${balance.user.name} (${balance.user.email})`;

  const handleReset = async () => {
    setIsResetting(true);
    const result = await deleteAdminBalance(balance.id);
    if (result.success) {
      toast.success(result.message);
      setShowResetDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error reseteando balance";
      toast.error(errorMsg);
    }
    setIsResetting(false);
  };

  const stats = [
    { label: "Creditos actuales", value: balance.amount, icon: Wallet },
    { label: "Transacciones", value: txCount, icon: Calendar },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.balances.root)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Balances
          </Button>

          <PageHeader
            title={`Balance: ${typeLabel}`}
            description={userLabel}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="accent" onClick={() => router.push(routes.app.admin.balances.edit(balance.id))} className="rounded-lg font-bold text-xs h-9 shadow-sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {balance.amount !== 0 && (
                  <Button variant="destructive" onClick={() => setShowResetDialog(true)} className="rounded-lg font-bold text-xs h-9">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Resetear a 0
                  </Button>
                )}
              </div>
            }
          />

          {/* Balance info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline">{typeLabel}</StatusBadge>
              <StatusBadge variant="outline" className={cn("text-[10px]", balance.amount > 0 ? "bg-green-500/10 text-green-600 border-green-500/20" : balance.amount === 0 ? "bg-muted text-muted-foreground border-border" : "bg-red-500/10 text-red-600 border-red-500/20")}>
                {balance.amount} creditos
              </StatusBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>Usuario: <span className="font-medium text-foreground">{userLabel}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4 shrink-0" />
                <span>Tipo: <span className="font-medium text-foreground">{typeLabel}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Actualizado: <span className="font-medium text-foreground">{formatDate(balance.updatedAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="rounded-xl border border-border/60 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-black text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Transaction history */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Historial de transacciones ({txCount} total)</h3>
            {balance.creditTransaction.length > 0 ? (
              <div className="space-y-2">
                {balance.creditTransaction.map((tx) => {
                  const isPositive = tx.amount > 0;
                  const txTypeLabel = TX_TYPE_LABELS[tx.type] || tx.type;
                  return (
                    <div key={tx.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                      )}>
                        {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-bold", isPositive ? "text-green-600" : "text-red-600")}>
                            {isPositive ? "+" : ""}{tx.amount}
                          </span>
                          <StatusBadge variant="outline" className="text-[10px]">{txTypeLabel}</StatusBadge>
                        </div>
                        {tx.description && <p className="text-xs text-muted-foreground truncate">{tx.description}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{formatDate(tx.createdAt, "d MMM, yyyy HH:mm")}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay transacciones registradas.</p>
            )}
          </Card>

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID Balance:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{balance.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ID Usuario:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{balance.userId}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal isOpen={showResetDialog} onOpenChange={setShowResetDialog} onConfirm={handleReset} loading={isResetting} title="Resetear balance" description={<>El balance de <strong>{typeLabel}</strong> de <strong>{balance.user.name}</strong> ({balance.amount} creditos) sera reseteado a 0. Se registrara como transaccion de consumo.</>} />
    </main>
  );
}

