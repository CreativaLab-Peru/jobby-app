"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CVForm } from "@/features/cv/components/cv-form";
import { createAdminCv } from "@/features/cv/actions/admin/create-admin-cv";
// Importamos el tipo directamente de tu esquema
import { CVFormData } from "@/features/cv/schema";

interface AdminCreateCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cvId: string) => void;
}

export function AdminCreateCvModal({ isOpen, onClose, onCreated }: AdminCreateCvModalProps) {
  const [isPending, startTransition] = useTransition();
  const [userIdentifier, setUserIdentifier] = useState("");

  // 1. Estado alineado con CVFormData
  const [formData, setFormData] = useState<CVFormData>({
    title: "",
    templateId: "harvard",
    // @ts-ignore - Estos vendrán del esquema/enums de Prisma
    cvType: undefined,
    // @ts-ignore
    opportunityType: undefined,
    language: "ES", // Asumiendo un default
    sections: [],
  });

  const handleCreate = () => {
    // Validaciones básicas de UI antes de llamar al Action
    if (!formData.title || !userIdentifier.trim() || isPending) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createAdminCv({
          userIdentifier: userIdentifier.trim(),
          ...formData, // Spread de los datos validados por el formulario
        });

        if (result?.success) {
          toast.success("CV creado exitosamente");
          onCreated(result.data.id);
          onClose();
        } else {
          toast.error(result?.error || "Error al crear el CV");
        }
      } catch (error) {
        toast.error("Error de conexión con el servidor");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[1.5rem] border-secondary/20 bg-background p-0 overflow-hidden shadow-2xl">
        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                Panel de Administración
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground">
                Generar nuevo documento para un usuario específico
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-secondary-foreground/80">
                Usuario (correo o ID)
              </Label>
              <Input
                value={userIdentifier}
                onChange={(e) => setUserIdentifier(e.target.value)}
                placeholder="usuario@correo.com o UUID"
                className="border-secondary/30 focus-visible:ring-primary h-11"
              />
            </div>

            <div className="border-t border-secondary/10 pt-4">
              {/* 2. Uso correcto de las nuevas Props del CVForm */}
              <CVForm
                defaultValues={formData}
                onValuesChange={(data) =>
                  setFormData(prev => ({
                    ...prev,
                    ...data,
                    templateId: data.templateId ?? prev.templateId
                  }))
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/5 border-t border-secondary/10">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 font-bold"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              // 3. Validación de botón más robusta
              disabled={isPending || !userIdentifier.trim() || formData.title.length < 3}
              className="flex-[2] rounded-xl h-12 font-bold bg-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Crear CV
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
