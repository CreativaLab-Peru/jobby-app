"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { PaymentType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { AdminPlanDetail } from "@/features/billing/actions/admin/get-admin-plan-by-id";
import { updateAdminPlan } from "@/features/billing/actions/admin/update-admin-plan";
import { routes } from "@/lib/routes";

const TYPE_OPTIONS: { value: PaymentType; label: string }[] = [
  { value: "FREE", label: "Gratis" },
  { value: "ONE_TIME", label: "Pago unico" },
  { value: "SUBSCRIPTION", label: "Suscripcion" },
  { value: "REFUND", label: "Reembolso" },
];

interface AdminPlanEditFormProps {
  plan: AdminPlanDetail;
}

export function AdminPlanEditForm({ plan }: AdminPlanEditFormProps) {
  const [name, setName] = useState(plan.name);
  const [slug, setSlug] = useState(plan.slug);
  const [description, setDescription] = useState(plan.description || "");
  const [paymentType, setPaymentType] = useState<PaymentType>(plan.paymentType);
  const [priceCents, setPriceCents] = useState(Number(plan.priceCents));
  const [currency, setCurrency] = useState(plan.currency);
  const [manualCvLimit, setManualCvLimit] = useState(plan.manualCvLimit);
  const [uploadCvLimit, setUploadCvLimit] = useState(plan.uploadCvLimit);
  const [featuresJson, setFeaturesJson] = useState(plan.features ? JSON.stringify(plan.features, null, 2) : "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim() || !slug.trim()) {
      toast.error("Nombre y slug son requeridos");
      setIsLoading(false);
      return;
    }

    let features: unknown = null;
    if (featuresJson.trim()) {
      try {
        features = JSON.parse(featuresJson);
      } catch {
        toast.error("El JSON de caracteristicas no es valido");
        setIsLoading(false);
        return;
      }
    }

    const result = await updateAdminPlan(plan.id, {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      paymentType,
      priceCents,
      currency,
      manualCvLimit,
      uploadCvLimit,
      features,
    });

    if (result.success) {
      toast.success(result.message);
      router.push(routes.app.admin.plans.detail(plan.id));
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error actualizando plan";
      toast.error(errorMsg);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.plans.detail(plan.id))} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader title="Editar Plan" description={`Editando "${plan.name}" (${plan.slug})`} />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nombre *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Slug *</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={isLoading} className="font-mono text-sm" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Descripcion</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tipo de pago</Label>
                  <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Moneda</Label>
                  <Select value={currency} onValueChange={setCurrency} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="PEN">PEN</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precio (centavos)</Label>
                  <Input type="number" min={0} value={priceCents} onChange={(e) => setPriceCents(parseInt(e.target.value) || 0)} disabled={isLoading} />
                  <p className="text-xs text-muted-foreground">Ej: 1000 = {currency} 10.00</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">CVs manuales</Label>
                  <Input type="number" min={0} value={manualCvLimit} onChange={(e) => setManualCvLimit(parseInt(e.target.value) || 0)} disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">CVs upload</Label>
                  <Input type="number" min={0} value={uploadCvLimit} onChange={(e) => setUploadCvLimit(parseInt(e.target.value) || 0)} disabled={isLoading} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Caracteristicas (JSON)</Label>
                  <Textarea value={featuresJson} onChange={(e) => setFeaturesJson(e.target.value)} rows={4} disabled={isLoading} className="font-mono text-xs" placeholder='{"feature1": true, "maxItems": 10}' />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button type="button" variant="outline" onClick={() => router.push(routes.app.admin.plans.detail(plan.id))} disabled={isLoading} className="rounded-lg font-bold">
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

