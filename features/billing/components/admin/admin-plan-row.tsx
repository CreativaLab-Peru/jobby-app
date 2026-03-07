"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Eye, FileText, MoreVertical, Tag, Trash2, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminPlanItem } from "@/features/billing/actions/admin/get-admin-plans-list";
import { deleteAdminPlan } from "@/features/billing/actions/admin/delete-admin-plan";
import { routes } from "@/lib/routes";

interface AdminPlanRowProps {
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

export function AdminPlanRow({ plan }: AdminPlanRowProps) {
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
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Tag className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{plan.name}</span>
              <StatusBadge variant="outline" className="text-[10px]">{typeLabel}</StatusBadge>
              <StatusBadge variant="outline" className={cn("text-[10px]", plan.paymentType === "FREE" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20")}>
                {price}
              </StatusBadge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">{plan.slug}</span>
              <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span>{plan.manualCvLimit} CVs manuales</span></div>
              <div className="flex items-center gap-1"><Upload className="h-3 w-3" /><span>{plan.uploadCvLimit} CVs upload</span></div>
              <div className="flex items-center gap-1"><Users className="h-3 w-3" /><span>{paymentsCount} suscriptores</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(plan.createdAt, "d MMM, yyyy")}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.plans.detail(plan.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.plans.edit(plan.id))}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar plan" description={<>Se eliminara permanentemente el plan <strong>{plan.name}</strong>. Esta accion no se puede deshacer.</>} />
    </>
  );
}

