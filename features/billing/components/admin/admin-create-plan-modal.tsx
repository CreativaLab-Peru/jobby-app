"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Tag } from "lucide-react";
import { PaymentType } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminPlan } from "@/features/billing/actions/admin/create-admin-plan";

const TYPE_OPTIONS: { value: PaymentType; label: string }[] = [
  { value: "FREE", label: "Gratis" },
  { value: "ONE_TIME", label: "Pago unico" },
  { value: "SUBSCRIPTION", label: "Suscripcion" },
  { value: "REFUND", label: "Reembolso" },
];

interface AdminCreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (planId: string) => void;
}

export function AdminCreatePlanModal({ isOpen, onClose, onCreated }: AdminCreatePlanModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("ONE_TIME");
  const [priceCents, setPriceCents] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [manualCvLimit, setManualCvLimit] = useState(0);
  const [uploadCvLimit, setUploadCvLimit] = useState(0);

  const handleCreate = () => {
    if (!name.trim() || !slug.trim() || isPending) return;

    startTransition(() => {
      createAdminPlan({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        paymentType,
        priceCents,
        currency,
        manualCvLimit,
        uploadCvLimit,
      }).then((result) => {
        if (result.success) {
          toast.success(result.message);
          onCreated(result.data.id);
          // Reset form
          setName("");
          setSlug("");
          setDescription("");
          setPaymentType("ONE_TIME");
          setPriceCents(0);
          setCurrency("USD");
          setManualCvLimit(0);
          setUploadCvLimit(0);
        } else {
          const errorMsg = (result as { error: string }).error || "Error al crear el plan";
          toast.error(errorMsg);
        }
      });
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(value));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
              <Tag className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">Crear Plan</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                Crea un nuevo plan de pago para los usuarios.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nombre *</Label>
                <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ej: Plan Pro" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Slug *</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="plan-pro" className="font-mono text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Descripcion</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripcion del plan..." rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo de pago</Label>
                <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)}>
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
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="PEN">PEN</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Precio (centavos)</Label>
                <Input type="number" min={0} value={priceCents} onChange={(e) => setPriceCents(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">CVs manuales</Label>
                <Input type="number" min={0} value={manualCvLimit} onChange={(e) => setManualCvLimit(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">CVs upload</Label>
                <Input type="number" min={0} value={uploadCvLimit} onChange={(e) => setUploadCvLimit(parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-secondary/10">
          <div className="flex w-full gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1 rounded-xl h-12 font-bold text-muted-foreground">
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !slug.trim() || isPending} variant="accent" className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="mr-2 h-5 w-5" />Crear Plan</>}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

