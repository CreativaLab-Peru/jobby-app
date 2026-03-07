"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye, MoreVertical, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminBalanceItem } from "@/features/credits/actions/admin/get-admin-balances";
import { deleteAdminBalance } from "@/features/credits/actions/admin/delete-admin-balance";
import { routes } from "@/lib/routes";

const BALANCE_TYPE_LABELS: Record<string, string> = {
  AI_ACTIONS: "Acciones IA",
  UPLOADS: "Subidas",
  MANAGE_CVS: "Gestion CVs",
  SEARCH_OPPORTUNITIES: "Buscar Oportunidades",
};

interface AdminBalanceRowProps {
  balance: AdminBalanceItem;
}

export function AdminBalanceRow({ balance }: AdminBalanceRowProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const typeLabel = BALANCE_TYPE_LABELS[balance.type] || balance.type;
  const txCount = balance._count.creditTransaction;

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

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black",
            balance.amount > 0 ? "bg-green-500/10 text-green-600" : balance.amount === 0 ? "bg-muted text-muted-foreground" : "bg-red-500/10 text-red-600"
          )}>
            {balance.amount}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{balance.user.name}</span>
              <StatusBadge variant="outline" className="text-[10px]">{typeLabel}</StatusBadge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{balance.user.email}</span>
              <span className="font-semibold">{balance.amount} creditos</span>
              <span>{txCount} transacciones</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.balances.detail(balance.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.balances.edit(balance.id))}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.balances.detail(balance.id))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.balances.edit(balance.id))} className="cursor-pointer font-medium">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium" disabled={balance.amount === 0}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Resetear a 0
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showResetDialog} onOpenChange={setShowResetDialog} onConfirm={handleReset} loading={isResetting} title="Resetear balance" description={<>El balance de <strong>{typeLabel}</strong> de <strong>{balance.user.name}</strong> sera reseteado a 0. Se registrara la transaccion.</>} />
    </>
  );
}

