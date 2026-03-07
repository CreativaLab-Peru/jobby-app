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
  Tag,
  Trash2,
  Upload,
  User as UserIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminPlanDetail } from "@/features/billing/actions/admin/get-admin-plan-by-id";
import { deleteAdminPlan } from "@/features/billing/actions/admin/delete-admin-plan";
import { routes } from "@/lib/routes";

interface AdminPlanDetailScreenProps {
  plan: AdminPlanDetail;
}

function formatCurrency(cents: number | { toNumber?: () => number }, currency: string): string {
  const value = typeof cents === "number" ? cents : (cents?.toNumber?.() ?? Number(cents));
  return `${currency} ${(value / 100).toFixed(2)}`;
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION: "Suscripcion",
  ONE_TIME: "Pago unico",
  REFUND: "Reembolso",
  FREE: "Gratis",
};

export function AdminPlanDetailScreen({ plan }: AdminPlanDetailScreenProps) {
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
      router.push(routes.app.admin.plans.root);
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando plan";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  const stats = [
    { label: "Suscriptores", value: paymentsCount, icon: Users },
    { label: "CVs Manuales", value: plan.manualCvLimit, icon: FileText },
    { label: "CVs Upload", value: plan.uploadCvLimit, icon: Upload },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.plans.root)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Planes
          </Button>

          <PageHeader
            title={plan.name}
            description={`${typeLabel} · ${plan.slug}`}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="accent" onClick={() => router.push(routes.app.admin.plans.edit(plan.id))} className="rounded-lg font-bold text-xs h-9 shadow-sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {paymentsCount === 0 && (
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="rounded-lg font-bold text-xs h-9">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                )}
              </div>
            }
          />

          {/* Plan info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline">{typeLabel}</StatusBadge>
              <StatusBadge variant="outline" className={cn("text-[10px]", plan.paymentType === "FREE" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20")}>
                {price}
              </StatusBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4 shrink-0" />
                <span>Slug: <span className="font-mono font-medium text-foreground">{plan.slug}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>Precio: <span className="font-medium text-foreground">{price}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Creado: <span className="font-medium text-foreground">{formatDate(plan.createdAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Actualizado: <span className="font-medium text-foreground">{formatDate(plan.updatedAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
            </div>

            {plan.description && (
              <div className="pt-2 border-t border-border/40">
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            )}
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

          {/* Features JSON */}
          {plan.features && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-3">Caracteristicas (features)</h3>
              <pre className="text-xs bg-secondary/20 rounded-lg p-3 overflow-auto max-h-40">{JSON.stringify(plan.features, null, 2)}</pre>
            </Card>
          )}

          {/* Recent subscribers */}
          {plan.payments.length > 0 && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-4">Suscriptores recientes ({paymentsCount} total)</h3>
              <div className="space-y-3">
                {plan.payments.map((payment) => {
                  const isActive = payment.active;
                  const isExpired = payment.expiresAt && new Date(payment.expiresAt) < new Date();
                  return (
                    <div key={payment.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        isActive && !isExpired ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                      )}>
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground">{payment.user.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{payment.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <StatusBadge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Activo</StatusBadge>
                        ) : (
                          <StatusBadge variant="outline" className="text-[10px]">Inactivo</StatusBadge>
                        )}
                        <span className="text-xs text-muted-foreground">{formatDate(payment.startedAt, "d MMM, yyyy")}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => router.push(routes.app.admin.payments.detail(payment.id))}>
                          <CreditCard className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{plan.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Moneda:</span>
                <span className="ml-2 font-medium text-foreground">{plan.currency}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar plan" description={<>Se eliminara permanentemente el plan <strong>{plan.name}</strong>. Esta accion no se puede deshacer.</>} />
    </main>
  );
}

