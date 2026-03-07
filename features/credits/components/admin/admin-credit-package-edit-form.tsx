"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { CreditBalanceType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { AdminCreditPackageDetail } from "@/features/credits/actions/admin/get-admin-credit-package-by-id";
import { updateAdminCreditPackage } from "@/features/credits/actions/admin/update-admin-credit-package";
import { routes } from "@/lib/routes";

const TYPE_OPTIONS: { value: CreditBalanceType; label: string }[] = [
  { value: "AI_ACTIONS", label: "Acciones IA" },
  { value: "UPLOADS", label: "Subidas" },
  { value: "MANAGE_CVS", label: "Gestion CVs" },
  { value: "SEARCH_OPPORTUNITIES", label: "Buscar Oportunidades" },
];

interface AdminCreditPackageEditFormProps {
  pkg: AdminCreditPackageDetail;
}

export function AdminCreditPackageEditForm({ pkg }: AdminCreditPackageEditFormProps) {
  const [name, setName] = useState(pkg.name);
  const [code, setCode] = useState(pkg.code);
  const [credits, setCredits] = useState(pkg.credits);
  const [priceCents, setPriceCents] = useState(pkg.priceCents);
  const [currency, setCurrency] = useState(pkg.currency);
  const [active, setActive] = useState(pkg.active);
  const [type, setType] = useState<CreditBalanceType>(pkg.type);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim() || !code.trim()) {
      toast.error("Nombre y codigo son requeridos");
      setIsLoading(false);
      return;
    }

    const result = await updateAdminCreditPackage(pkg.id, {
      name: name.trim(),
      code: code.trim(),
      credits,
      priceCents,
      currency,
      active,
      type,
    });

    if (result.success) {
      toast.success(result.message);
      router.push(routes.app.admin.creditPackages.detail(pkg.id));
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error actualizando paquete";
      toast.error(errorMsg);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.creditPackages.detail(pkg.id))} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader title="Editar Paquete" description={`Editando "${pkg.name}" (${pkg.code})`} />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active toggle */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
                    <div>
                      <Label htmlFor="active" className="text-sm font-semibold">Estado</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{active ? "Paquete activo y disponible" : "Paquete inactivo"}</p>
                    </div>
                    <Switch id="active" checked={active} onCheckedChange={setActive} disabled={isLoading} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nombre *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Codigo *</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={isLoading} className="font-mono text-sm" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tipo de credito</Label>
                  <Select value={type} onValueChange={(v) => setType(v as CreditBalanceType)} disabled={isLoading}>
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
                  <Label className="text-sm font-semibold">Creditos</Label>
                  <Input type="number" min={0} value={credits} onChange={(e) => setCredits(parseInt(e.target.value) || 0)} disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precio (centavos)</Label>
                  <Input type="number" min={0} value={priceCents} onChange={(e) => setPriceCents(parseInt(e.target.value) || 0)} disabled={isLoading} />
                  <p className="text-xs text-muted-foreground">= {currency} {(priceCents / 100).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button type="button" variant="outline" onClick={() => router.push(routes.app.admin.creditPackages.detail(pkg.id))} disabled={isLoading} className="rounded-lg font-bold">Cancelar</Button>
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

