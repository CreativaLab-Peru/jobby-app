"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
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

interface AdminCreditPackageCardProps {
  pkg: AdminCreditPackageItem;
}

export function AdminCreditPackageCard({ pkg }: AdminCreditPackageCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const typeLabel = BALANCE_TYPE_LABELS[pkg.type] || pkg.type;
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
      <EntityListItem
        icon={
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            pkg.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
          )}>
            <Coins className="h-5 w-5" />
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant="outline">{typeLabel}</StatusBadge>
            {pkg.active ? (
              <StatusBadge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">Activo</StatusBadge>
            ) : (
              <StatusBadge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">Inactivo</StatusBadge>
            )}
          </div>
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">{pkg.name}</span>}
        metadata={
          <>
            <span className="font-mono text-[10px]">{pkg.code}</span>
            <span className="font-semibold">{pkg.credits} creditos</span>
            <span>{invoiceCount} facturas</span>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
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
        }
        footerActions={
          <Button variant="accent" onClick={() => router.push(routes.app.admin.creditPackages.detail(pkg.id))} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">
            Ver Paquete
          </Button>
        }
      />
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title={invoiceCount > 0 ? "Desactivar paquete" : "Eliminar paquete"} description={invoiceCount > 0 ? (<>El paquete <strong>{pkg.name}</strong> sera desactivado.</>) : (<>Se eliminara permanentemente el paquete <strong>{pkg.name}</strong>.</>)} />
    </>
  );
}

