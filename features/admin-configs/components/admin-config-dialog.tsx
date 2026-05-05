"use client";

import { AlertCircle, Save, Settings2 } from "lucide-react";

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

type ConfigFormValues = {
  key: string;
  value: string;
};

interface AdminConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingConfig: AppConfig | null;
  isPending: boolean;
  formData: ConfigFormValues;
  onFormDataChange: (data: ConfigFormValues) => void;
  action: (payload: globalThis.FormData) => void;
  existingConfigs: AppConfig[];
}

export function AdminConfigDialog({
  open,
  onOpenChange,
  editingConfig,
  isPending,
  formData,
  onFormDataChange,
  action,
  existingConfigs,
}: AdminConfigDialogProps) {
  // Validar si la clave ya existe (excepto si es la que estamos editando)
  const keyExists = existingConfigs.some(
    (config) => config.key === formData.key.trim() && config.id !== editingConfig?.id,
  );
  const isKeyEmpty = !formData.key.trim();
  const isValueEmpty = !formData.value.trim();
  const isFormInvalid = isKeyEmpty || isValueEmpty || keyExists;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">
              {editingConfig ? "Editar Configuración" : "Nueva Configuración"}
            </DialogTitle>
            <DialogDescription>
              Ingresa la clave y el valor para esta variable de entorno dinámica.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {editingConfig && <input type="hidden" name="configId" value={editingConfig.id} />}
            <div className="space-y-2">
              <Label htmlFor="key" className="text-xs font-black uppercase text-muted-foreground">
                Clave (Key)
              </Label>
              <Input
                id="key"
                name="key"
                placeholder="EJ: STRIPE_PUBLIC_KEY"
                className="roundedfont-mono uppercase text-xs"
                value={formData.key}
                onChange={(e) => onFormDataChange({ ...formData, key: e.target.value })}
                readOnly={!!editingConfig}
                disabled={isPending}
                required
              />
              {keyExists && (
                <p className="text-xs text-red-600 font-semibold">
                  <AlertCircle className="inline w-3.5 h-3.5 mr-1" />
                  Esta clave ya existe
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="value" className="text-xs font-black uppercase text-muted-foreground">
                Valor (Value)
              </Label>
              <Input
                id="value"
                name="value"
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
            <Button
              type="submit"
              disabled={isPending || isFormInvalid}
              className="rounded-xl font-bold gap-2"
            >
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
