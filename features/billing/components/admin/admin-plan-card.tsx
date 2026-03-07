"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye, FileText, MoreVertical, Tag, Trash2, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { AdminPlanItem } from "@/features/billing/actions/admin/get-admin-plans-list";
import { deleteAdminPlan } from "@/features/billing/actions/admin/delete-admin-plan";
import { routes } from "@/lib/routes";

interface AdminPlanCardProps {
  plan: AdminPlanItem;
}

function formatCurrency(cents: number | { toNumber?: () => number }, currency: string): string {
  const value = typeof cents === "number" ? cents : (cents?.toNumber?.() ?? Number(cents));
  return `${currency} ${(value / 100).toFixed(2)}`;
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION: "Suscripcion",
  ONE_TIME: "Unico",
  REFUND: "Reembolso",
  FREE: "Gratis",
};

export function AdminPlanCard({ plan }: AdminPlanCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const price = formatCurrency(plan.priceCents as unknown as number, plan.currency);
  const typeLabel = PAYMENT_TYPE_LABELS[plan.paymentType] || plan.paymentType;
  const paymentsCount = plan._count.payments;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminPlan(plan.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando plan";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <EntityListItem
        icon={
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Tag className="h-5 w-5" />
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant="outline">{typeLabel}</StatusBadge>
            <StatusBadge variant="outline" className={cn("text-[10px]", plan.paymentType === "FREE" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20")}>
              {price}
            </StatusBadge>
          </div>
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">{plan.name}</span>}
        metadata={
          <>
            <span className="font-mono text-[10px]">{plan.slug}</span>
            <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span>{paymentsCount} suscriptores</span></div>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.plans.detail(plan.id))} className="cursor-pointer font-medium">
                <Eye className="mr-2 h-4 w-4" /> Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.plans.edit(plan.id))} className="cursor-pointer font-medium">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium" disabled={paymentsCount > 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <Button variant="accent" onClick={() => router.push(routes.app.admin.plans.detail(plan.id))} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">
            Ver Plan
          </Button>
        }
      />
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar plan" description={<>Se eliminara permanentemente el plan <strong>{plan.name}</strong>. Esta accion no se puede deshacer.</>} />
    </>
  );
}

