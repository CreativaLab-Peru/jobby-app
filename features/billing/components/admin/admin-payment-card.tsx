"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CreditCard, Edit, Eye, MoreVertical, Power, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminPaymentItem } from "@/features/billing/actions/admin/get-admin-payments";
import { deleteAdminPayment } from "@/features/billing/actions/admin/delete-admin-payment";
import { routes } from "@/lib/routes";

interface AdminPaymentCardProps {
  payment: AdminPaymentItem;
}

function formatCurrency(cents: number | { toNumber?: () => number }, currency: string): string {
  const value = typeof cents === "number" ? cents : (cents?.toNumber?.() ?? Number(cents));
  return `${currency} ${(value / 100).toFixed(2)}`;
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION: "Suscripción",
  ONE_TIME: "Pago único",
  REFUND: "Reembolso",
  FREE: "Gratis",
};

export function AdminPaymentCard({ payment }: AdminPaymentCardProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const router = useRouter();

  const isActive = payment.active;
  const isExpired = payment.expiresAt && new Date(payment.expiresAt) < new Date();
  const userLabel = `${payment.user.name} · ${payment.user.email}`;
  const price = `${formatCurrency(Number(payment.plan.priceCentsPEN), "PEN")} / ${formatCurrency(Number(payment.plan.priceCentsUSD), "USD")}`;

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    const result = await deleteAdminPayment(payment.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeactivateDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error desactivando pago";
      toast.error(errorMsg);
    }
    setIsDeactivating(false);
  };

  return (
    <>
      <EntityListItem
        icon={
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isActive && !isExpired ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
          )}>
            <CreditCard className="h-5 w-5" />
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant="outline">{PAYMENT_TYPE_LABELS[payment.plan.paymentType] || payment.plan.paymentType}</StatusBadge>
            {isActive ? (
              <StatusBadge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">Activo</StatusBadge>
            ) : (
              <StatusBadge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">Inactivo</StatusBadge>
            )}
            {isExpired && (
              <StatusBadge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">Expirado</StatusBadge>
            )}
          </div>
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">{payment.plan.name}</span>}
        metadata={
          <>
            <div className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /><span>{userLabel}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>Inicio: {formatDate(payment.startedAt, "d MMM, yyyy")}</span></div>
            <div className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /><span>{price}</span></div>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.payments.detail(payment.id))} className="cursor-pointer font-medium">
                <Eye className="mr-2 h-4 w-4" /> Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.payments.edit(payment.id))} className="cursor-pointer font-medium">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeactivateDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium" disabled={!isActive}>
                <Power className="mr-2 h-4 w-4" /> Desactivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <Button variant="accent" onClick={() => router.push(routes.app.admin.payments.detail(payment.id))} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">
            Ver Pago
          </Button>
        }
      />
      <ConfirmModal isOpen={showDeactivateDialog} onOpenChange={setShowDeactivateDialog} onConfirm={handleDeactivate} loading={isDeactivating} title="Desactivar pago" description={<>El pago de <strong>{payment.user.name}</strong> para el plan <strong>{payment.plan.name}</strong> sera desactivado.</>} />
    </>
  );
}

