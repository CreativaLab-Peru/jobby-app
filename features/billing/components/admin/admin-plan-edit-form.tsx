"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {ArrowLeft, Loader2, Save} from "lucide-react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {PageHeader} from "@/components/shared/page-header";
import {AdminPlanDetail} from "@/features/billing/actions/admin/get-admin-plan-by-id";
import {updateAdminPlan} from "@/features/billing/actions/admin/update-admin-plan";
import {routes} from "@/lib/routes";

interface AdminPlanEditFormProps {
  plan: AdminPlanDetail;
}

export function AdminPlanEditForm({plan}: AdminPlanEditFormProps) {
  const [name, setName] = useState(plan.name);
  const [slug, setSlug] = useState(plan.slug);
  const [description, setDescription] = useState(plan.description || "");
  
  // Precios por moneda
  const [pricePEN, setPricePEN] = useState<number>(
    plan.priceCentsPEN ? Number(plan.priceCentsPEN) / 100 : 0
  );
  const [priceUSD, setPriceUSD] = useState<number>(
    plan.priceCentsUSD ? Number(plan.priceCentsUSD) / 100 : 0
  );
  
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

    let features: Record<string, unknown> | null = null;
    if (featuresJson.trim()) {
      try {
        features = JSON.parse(featuresJson) as Record<string, unknown>;
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
      priceCentsPEN: pricePEN > 0 ? Math.round(pricePEN * 100) : 0,
      priceCentsUSD: priceUSD > 0 ? Math.round(priceUSD * 100) : 0,
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
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                    className="space-y-8">
          <Button variant="ghost"
                  onClick={() => router.push(routes.app.admin.plans.detail(plan.id))}
                  className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4"/>
            Volver al detalle
          </Button>

          <PageHeader title="Editar Plan" description={`Editando "${plan.name}" (${plan.slug})`}/>

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nombre *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)}
                         disabled={isLoading}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Slug *</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={isLoading}
                         className="font-mono text-sm"/>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Descripcion</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                            rows={2} disabled={isLoading}/>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precio PEN (Mercado Pago) 🇵🇪</Label>
                  <Input 
                    type="number"
                    min={0}
                    step="0.01"
                    value={pricePEN}
                    onChange={(e) => setPricePEN(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                    placeholder="Ej: 19.90"
                  />
                  <p className="text-xs text-muted-foreground">Soles peruanos (se almacena como centavos en BD)</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precio USD (Paddle) 🌎</Label>
                  <Input 
                    type="number"
                    min={0}
                    step="0.01"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                    placeholder="Ej: 9.90"
                  />
                  <p className="text-xs text-muted-foreground">Dólares estadounidenses (Paddle maneja conversión automática)</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Caracteristicas (JSON)</Label>
                  <Textarea
                    value={featuresJson}
                    onChange={(e) => setFeaturesJson(e.target.value)}
                    rows={10}
                    disabled={isLoading}
                    className="font-mono text-xs"
                    placeholder='{"feature1": true, "maxItems": 10}'
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button type="button" variant="outline"
                        onClick={() => router.push(routes.app.admin.plans.detail(plan.id))}
                        disabled={isLoading} className="rounded-lg font-bold">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}
                        className="rounded-lg font-bold shadow-sm">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                    <Save className="mr-2 h-4 w-4"/>}
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

