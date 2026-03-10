"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Coins, CreditCard, Edit, FileText, Power, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminCreditPackageDetail } from "@/features/credits/actions/admin/get-admin-credit-package-by-id";
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

interface AdminCreditPackageDetailScreenProps {
  pkg: AdminCreditPackageDetail;
}

export function AdminCreditPackageDetailScreen({ pkg }: AdminCreditPackageDetailScreenProps) {
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
      router.push(routes.app.admin.creditPackages.root);
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando paquete";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  const stats = [
    { label: "Creditos", value: pkg.credits, icon: Coins },
    { label: "Facturas", value: invoiceCount, icon: FileText },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.creditPackages.root)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Paquetes
          </Button>

          <PageHeader
            title={pkg.name}
            description={`${typeLabel} · ${pkg.code}`}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="accent" onClick={() => router.push(routes.app.admin.creditPackages.edit(pkg.id))} className="rounded-lg font-bold text-xs h-9 shadow-sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="rounded-lg font-bold text-xs h-9">
                  {invoiceCount > 0 ? <Power className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {invoiceCount > 0 ? "Desactivar" : "Eliminar"}
                </Button>
              </div>
            }
          />

          {/* Info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline">{typeLabel}</StatusBadge>
              {pkg.active ? (
                <StatusBadge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Activo</StatusBadge>
              ) : (
                <StatusBadge variant="outline" className="bg-muted text-muted-foreground border-border">Inactivo</StatusBadge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coins className="h-4 w-4 shrink-0" />
                <span>Codigo: <span className="font-mono font-medium text-foreground">{pkg.code}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coins className="h-4 w-4 shrink-0" />
                <span>Creditos: <span className="font-medium text-foreground">{pkg.credits}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Creado: <span className="font-medium text-foreground">{formatDate(pkg.createdAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
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

          {/* Recent invoices */}
          {pkg.invoice.length > 0 && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-4">Facturas recientes ({invoiceCount} total)</h3>
              <div className="space-y-3">
                {pkg.invoice.map((inv) => (
                  <div key={inv.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                      inv.status === "PAID" ? "bg-green-500/10 text-green-600" : inv.status === "PENDING" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"
                    )}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-semibold">{inv.user.name}</span>
                        <span className="text-xs text-muted-foreground">{inv.user.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge variant="outline" className="text-[10px]">{inv.status}</StatusBadge>
                      <span className="text-xs font-medium">{formatCurrency(inv.amountTotal, inv.currency)}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(inv.createdAt, "d MMM, yyyy")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{pkg.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Moneda:</span>
                <span className="ml-2 font-medium text-foreground">{pkg.currency}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title={invoiceCount > 0 ? "Desactivar paquete" : "Eliminar paquete"} description={invoiceCount > 0 ? (<>El paquete <strong>{pkg.name}</strong> tiene facturas asociadas y sera desactivado.</>) : (<>Se eliminara permanentemente el paquete <strong>{pkg.name}</strong>.</>)} />
    </main>
  );
}

