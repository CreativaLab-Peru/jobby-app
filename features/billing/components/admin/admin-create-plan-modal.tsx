"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAdminPlan } from "@/features/billing/actions/admin/create-admin-plan";

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
  const [pricePEN, setPricePEN] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [manageCvsCredits, setManageCvsCredits] = useState(0);
  const [aiAnalysisCredits, setAiAnalysisCredits] = useState(0);
  const [opportunitiesCredits, setOpportunitiesCredits] = useState(0);
  const [featureLines, setFeatureLines] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !slug.trim() || isPending) return;

    const featureItems = featureLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const featureValidationError = validateFeatureItems(featureItems);
    if (featureValidationError) {
      toast.error(featureValidationError);
      return;
    }

    startTransition(() => {
      createAdminPlan({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        priceCentsPEN: Math.round(pricePEN * 100),
        priceCentsUSD: Math.round(priceUSD * 100),
        manageCvsCredits,
        aiAnalysisCredits,
        opportunitiesCredits,
        features: featureItems.length ? { items: featureItems } : null,
      }).then((result) => {
        if (result.success) {
          toast.success(result.message);
          onCreated(result.data.id);
          // Reset form
          setName("");
          setSlug("");
          setDescription("");
          setPricePEN(0);
          setPriceUSD(0);
          setManageCvsCredits(0);
          setAiAnalysisCredits(0);
          setOpportunitiesCredits(0);
          setFeatureLines("");
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

            <div className="grid grid-cols-5 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Precio PEN</Label>
                <Input type="number" min={0} step="0.01" value={pricePEN} onChange={(e) => setPricePEN(parseFloat(e.target.value) || 0)} placeholder="19.90" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Precio USD</Label>
                <Input type="number" min={0} step="0.01" value={priceUSD} onChange={(e) => setPriceUSD(parseFloat(e.target.value) || 0)} placeholder="9.90" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">CV Manual</Label>
                <Input type="number" min={0} value={manageCvsCredits} onChange={(e) => setManageCvsCredits(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">IA Analisis</Label>
                <Input type="number" min={0} value={aiAnalysisCredits} onChange={(e) => setAiAnalysisCredits(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Oportunidades</Label>
                <Input type="number" min={0} value={opportunitiesCredits} onChange={(e) => setOpportunitiesCredits(parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Items del card (uno por linea)</Label>
              <Textarea
                value={featureLines}
                onChange={(e) => setFeatureLines(e.target.value)}
                placeholder={"Hasta 3 CVs guardados\nAnalisis y feedback de CV\nMaximo 5 oportunidades"}
                rows={4}
              />
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

function validateFeatureItems(items: string[]): string | null {
  const MAX_ITEMS = 8;
  const MAX_ITEM_LENGTH = 90;
  const featureRegex = /^[\p{L}\p{N}\s.,:;¡!¿?()'"+\-/%&]+$/u;

  if (items.length > MAX_ITEMS) {
    return `Maximo ${MAX_ITEMS} items por plan.`;
  }

  for (const item of items) {
    if (item.length < 3) {
      return "Cada item debe tener al menos 3 caracteres.";
    }

    if (item.length > MAX_ITEM_LENGTH) {
      return `Cada item debe tener maximo ${MAX_ITEM_LENGTH} caracteres.`;
    }

    if (!featureRegex.test(item)) {
      return "Los items solo pueden contener letras, numeros y puntuacion basica.";
    }
  }

  return null;
}

