"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Coins, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminCreditPackageItem } from "@/features/credits/actions/admin/get-admin-credit-packages";
import { deleteAdminCreditPackage } from "@/features/credits/actions/admin/delete-admin-credit-package";
import { routes } from "@/lib/routes";

const BALANCE_TYPE_LABELS: Record<string, string> = {
  AI_ACTIONS: "Acciones IA",
  UPLOADS: "Subidas",
  MANAGE_CVS: "Gestion CVs",
  SEARCH_OPPORTUNITIES: "Buscar Oportunidades",
};

function formatCurrency(cents: number, currency: string): string {
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

interface AdminCreditPackageRowProps {
  pkg: AdminCreditPackageItem;
}

export function AdminCreditPackageRow({ pkg }: AdminCreditPackageRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const typeLabel = BALANCE_TYPE_LABELS[pkg.type] || pkg.type;
  const price = formatCurrency(pkg.priceCents, pkg.currency);
  const invoiceCount = pkg._count.invoice;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminCreditPackage(pkg.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando paquete";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            pkg.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
          )}>
            <Coins className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{pkg.name}</span>
              <StatusBadge variant="outline" className="text-[10px]">{typeLabel}</StatusBadge>
              {pkg.active ? (
                <StatusBadge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Activo</StatusBadge>
              ) : (
                <StatusBadge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border">Inactivo</StatusBadge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">{pkg.code}</span>
              <span className="font-semibold">{pkg.credits} creditos</span>
              <span>{price}</span>
              <span>{invoiceCount} facturas</span>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(pkg.createdAt, "d MMM, yyyy")}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.creditPackages.detail(pkg.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.creditPackages.edit(pkg.id))}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.creditPackages.detail(pkg.id))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.creditPackages.edit(pkg.id))} className="cursor-pointer font-medium">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium">
                  <Trash2 className="mr-2 h-4 w-4" /> {invoiceCount > 0 ? "Desactivar" : "Eliminar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title={invoiceCount > 0 ? "Desactivar paquete" : "Eliminar paquete"} description={invoiceCount > 0 ? (<>El paquete <strong>{pkg.name}</strong> tiene {invoiceCount} factura(s) asociada(s), por lo que sera desactivado.</>) : (<>Se eliminara permanentemente el paquete <strong>{pkg.name}</strong>.</>)} />
    </>
  );
}

