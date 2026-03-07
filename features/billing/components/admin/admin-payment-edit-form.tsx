"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { AdminPaymentDetail } from "@/features/billing/actions/admin/get-admin-payment-by-id";
import { updateAdminPayment } from "@/features/billing/actions/admin/update-admin-payment";
import { routes } from "@/lib/routes";

interface AdminPaymentEditFormProps {
  payment: AdminPaymentDetail;
}

export function AdminPaymentEditForm({ payment }: AdminPaymentEditFormProps) {
  const [active, setActive] = useState(payment.active);
  const [manualCvsUsed, setManualCvsUsed] = useState(payment.manualCvsUsed);
  const [uploadCvsUsed, setUploadCvsUsed] = useState(payment.uploadCvsUsed);
  const [expiresAt, setExpiresAt] = useState(
    payment.expiresAt ? new Date(payment.expiresAt).toISOString().split("T")[0] : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userLabel = `${payment.user.name} (${payment.user.email})`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateAdminPayment(payment.id, {
      active,
      manualCvsUsed,
      uploadCvsUsed,
      expiresAt: expiresAt || null,
    });

    if (result.success) {
      toast.success(result.message);
      router.push(routes.app.admin.payments.detail(payment.id));
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error actualizando pago";
      toast.error(errorMsg);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.payments.detail(payment.id))}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader
            title="Editar Pago"
            description={`${payment.plan.name} · ${userLabel}`}
          />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active toggle */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
                    <div>
                      <Label htmlFor="active" className="text-sm font-semibold">Estado del pago</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{active ? "El pago esta activo" : "El pago esta inactivo"}</p>
                    </div>
                    <Switch id="active" checked={active} onCheckedChange={setActive} disabled={isLoading} />
                  </div>
                </div>

                {/* Manual CVs Used */}
                <div className="space-y-2">
                  <Label htmlFor="manualCvsUsed" className="text-sm font-semibold">CVs Manuales Usados</Label>
                  <Input
                    id="manualCvsUsed"
                    type="number"
                    min={0}
                    value={manualCvsUsed}
                    onChange={(e) => setManualCvsUsed(parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">Limite del plan: {payment.plan.manualCvLimit}</p>
                </div>

                {/* Upload CVs Used */}
                <div className="space-y-2">
                  <Label htmlFor="uploadCvsUsed" className="text-sm font-semibold">CVs Upload Usados</Label>
                  <Input
                    id="uploadCvsUsed"
                    type="number"
                    min={0}
                    value={uploadCvsUsed}
                    onChange={(e) => setUploadCvsUsed(parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">Limite del plan: {payment.plan.uploadCvLimit}</p>
                </div>

                {/* Expiration date */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="expiresAt" className="text-sm font-semibold">Fecha de expiracion</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">Deja vacio para que no expire.</p>
                </div>
              </div>

              {/* Read-only plan info */}
              <div className="rounded-lg border border-border/40 bg-secondary/10 p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informacion del plan (solo lectura)</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Plan:</span> <span className="font-medium">{payment.plan.name}</span></div>
                  <div><span className="text-muted-foreground">Usuario:</span> <span className="font-medium">{payment.user.name}</span></div>
                  <div><span className="text-muted-foreground">Inicio:</span> <span className="font-medium">{new Date(payment.startedAt).toLocaleDateString()}</span></div>
                  <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium">{payment.plan.paymentType}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button type="button" variant="outline" onClick={() => router.push(routes.app.admin.payments.detail(payment.id))} disabled={isLoading} className="rounded-lg font-bold">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-lg font-bold shadow-sm">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

