"use client";

import { Save, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppConfig } from "@prisma/client";

type FormData = {
  key: string;
  value: string;
};

interface AdminConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingConfig: AppConfig | null;
  isPending: boolean;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function AdminConfigDialog({
  open,
  onOpenChange,
  editingConfig,
  isPending,
  formData,
  onFormDataChange,
  onSubmit,
}: AdminConfigDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {editingConfig ? "Editar Configuración" : "Nueva Configuración"}
            </DialogTitle>
            <DialogDescription>
              Ingresa la clave y el valor para esta variable de entorno dinámica.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label
                htmlFor="key"
                className="text-xs font-black uppercase tracking-widest text-muted-foreground"
              >
                Clave (Key)
              </Label>
              <Input
                id="key"
                placeholder="EJ: STRIPE_PUBLIC_KEY"
                className="rounded-xl font-mono uppercase text-xs"
                value={formData.key}
                onChange={(e) => onFormDataChange({ ...formData, key: e.target.value })}
                disabled={!!editingConfig || isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="value"
                className="text-xs font-black uppercase tracking-widest text-muted-foreground"
              >
                Valor (Value)
              </Label>
              <Input
                id="value"
                placeholder="Ingresa el valor..."
                className="rounded-xl"
                value={formData.value}
                onChange={(e) => onFormDataChange({ ...formData, value: e.target.value })}
                disabled={isPending}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl font-bold"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl font-bold gap-2">
              {isPending ? (
                <Settings2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingConfig ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
