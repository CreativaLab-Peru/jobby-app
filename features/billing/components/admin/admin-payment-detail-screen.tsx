"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  Power,
  Upload,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminPaymentDetail } from "@/features/billing/actions/admin/get-admin-payment-by-id";
import { deleteAdminPayment } from "@/features/billing/actions/admin/delete-admin-payment";
import { routes } from "@/lib/routes";

interface AdminPaymentDetailScreenProps {
  payment: AdminPaymentDetail;
}

function formatCurrency(cents: number | { toNumber?: () => number }, currency: string): string {
  const value = typeof cents === "number" ? cents : (cents?.toNumber?.() ?? Number(cents));
  return `${currency} ${(value / 100).toFixed(2)}`;
}

export function AdminPaymentDetailScreen({ payment }: AdminPaymentDetailScreenProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const router = useRouter();

  const isActive = payment.active;
  const isExpired = payment.expiresAt && new Date(payment.expiresAt) < new Date();
  const userLabel = `${payment.user.name} (${payment.user.email})`;
  const price = formatCurrency(payment.plan.priceCents as unknown as number, payment.plan.currency);

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

  const stats = [
    { label: "CVs Manuales Usados", value: `${payment.manualCvsUsed} / ${payment.plan.manualCvLimit}`, icon: FileText },
    { label: "CVs Upload Usados", value: `${payment.uploadCvsUsed} / ${payment.plan.uploadCvLimit}`, icon: Upload },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.payments.root)}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Pagos
          </Button>

          <PageHeader
            title={payment.plan.name}
            description={userLabel}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="accent"
                  onClick={() => router.push(routes.app.admin.payments.edit(payment.id))}
                  className="rounded-lg font-bold text-xs h-9 shadow-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {isActive && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeactivateDialog(true)}
                    className="rounded-lg font-bold text-xs h-9"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Desactivar
                  </Button>
                )}
              </div>
            }
          />

          {/* Payment info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline">{payment.plan.paymentType}</StatusBadge>
              {isActive ? (
                <StatusBadge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Activo</StatusBadge>
              ) : (
                <StatusBadge variant="outline" className="bg-muted text-muted-foreground border-border">Inactivo</StatusBadge>
              )}
              {isExpired && (
                <StatusBadge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Expirado</StatusBadge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>Usuario: <span className="font-medium text-foreground">{userLabel}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>Plan: <span className="font-medium text-foreground">{payment.plan.name} ({payment.plan.slug})</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>Precio: <span className="font-medium text-foreground">{price}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Inicio: <span className="font-medium text-foreground">{formatDate(payment.startedAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
              {payment.expiresAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Expira: <span className={cn("font-medium", isExpired ? "text-destructive" : "text-foreground")}>{formatDate(payment.expiresAt, "d MMM, yyyy HH:mm")}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Creado: <span className="font-medium text-foreground">{formatDate(payment.createdAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
            </div>
          </Card>

          {/* Usage stats */}
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

          {/* Plan details */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Detalles del Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <span className="ml-2 font-medium text-foreground">{payment.plan.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Slug:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{payment.plan.slug}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo de pago:</span>
                <span className="ml-2 font-medium text-foreground">{payment.plan.paymentType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Precio:</span>
                <span className="ml-2 font-medium text-foreground">{price}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Limite CVs manuales:</span>
                <span className="ml-2 font-medium text-foreground">{payment.plan.manualCvLimit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Limite CVs upload:</span>
                <span className="ml-2 font-medium text-foreground">{payment.plan.uploadCvLimit}</span>
              </div>
              {payment.plan.description && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Descripcion:</span>
                  <p className="mt-1 text-foreground">{payment.plan.description}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID Pago:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{payment.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ID Usuario:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{payment.userId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ID Plan:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{payment.planId}</span>
              </div>
              {payment.metadata && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Metadata:</span>
                  <pre className="mt-1 text-xs bg-secondary/20 rounded-lg p-3 overflow-auto max-h-40">{JSON.stringify(payment.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
        onConfirm={handleDeactivate}
        loading={isDeactivating}
        title="Desactivar pago"
        description={<>El pago de <strong>{payment.user.name}</strong> para el plan <strong>{payment.plan.name}</strong> sera desactivado. El usuario perdera acceso a los beneficios del plan.</>}
      />
    </main>
  );
}

