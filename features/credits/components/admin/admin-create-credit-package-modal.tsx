"use client";

import { useState, useTransition } from "react";
import { Coins, Loader2, Plus } from "lucide-react";
import { CreditBalanceType } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminCreditPackage } from "@/features/credits/actions/admin/create-admin-credit-package";

const TYPE_OPTIONS: { value: CreditBalanceType; label: string }[] = [
  { value: "AI_ACTIONS", label: "Acciones IA" },
  { value: "UPLOADS", label: "Subidas" },
  { value: "MANAGE_CVS", label: "Gestion CVs" },
  { value: "SEARCH_OPPORTUNITIES", label: "Buscar Oportunidades" },
];

interface AdminCreateCreditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (packageId: string) => void;
}

export function AdminCreateCreditPackageModal({ isOpen, onClose, onCreated }: AdminCreateCreditPackageModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState(0);
  const [type, setType] = useState<CreditBalanceType>("AI_ACTIONS");

  const handleCreate = () => {
    if (!name.trim() || !code.trim() || isPending) return;

    startTransition(() => {
      createAdminCreditPackage({
        name: name.trim(),
        code: code.trim(),
        credits,
        type,
        active: true,
      }).then((result) => {
        if (result.success) {
          toast.success(result.message);
          onCreated(result.data.id);
          setName("");
          setCode("");
          setCredits(0);
          setType("AI_ACTIONS");
        } else {
          const errorMsg = (result as { error: string }).error || "Error al crear el paquete";
          toast.error(errorMsg);
        }
      });
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!code || code === slugify(name)) {
      setCode(slugify(value));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
              <Coins className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">Crear Paquete</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                Crea un nuevo paquete de creditos.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nombre *</Label>
                <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ej: Pack Pro IA" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Codigo *</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="pack-pro-ia" className="font-mono text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tipo de credito</Label>
                <Select value={type} onValueChange={(v) => setType(v as CreditBalanceType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Creditos</Label>
                <Input type="number" min={0} value={credits} onChange={(e) => setCredits(parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-secondary/10">
          <div className="flex w-full gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1 rounded-xl h-12 font-bold text-muted-foreground">Cancelar</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !code.trim() || isPending} variant="accent" className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="mr-2 h-5 w-5" />Crear Paquete</>}
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

