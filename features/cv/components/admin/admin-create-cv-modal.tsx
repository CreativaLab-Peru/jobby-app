"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, ShieldCheck } from "lucide-react";
import { CvType, OpportunityType } from "@prisma/client";
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
import { Label } from "@/components/ui/label"; // Importante para consistencia
import { Input } from "@/components/ui/input";
import { CVForm } from "@/features/cv/components/cv-form";
import { createAdminCv } from "@/features/cv/actions/admin/create-admin-cv";

interface AdminCreateCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cvId: string) => void;
}

export function AdminCreateCvModal({ isOpen, onClose, onCreated }: AdminCreateCvModalProps) {
  const [isPending, startTransition] = useTransition();
  const [userIdentifier, setUserIdentifier] = useState("");
  const [formData, setFormData] = useState<{
    title: string;
    cvType: CvType;
    opportunityType: OpportunityType;
    templateId: string;
  }>({
    title: "",
    cvType: "TECHNOLOGY_ENGINEERING",
    opportunityType: "INTERNSHIP",
    templateId: "harvard",
  });

  const handleCreate = () => {
    if (!formData.title.trim() || !userIdentifier.trim() || isPending) return;

    startTransition(() => {
      createAdminCv({
        userIdentifier: userIdentifier.trim(),
        title: formData.title.trim(),
        cvType: formData.cvType,
        opportunityType: formData.opportunityType,
        templateId: formData.templateId,
      }).then((result) => {
        // @ts-ignore - Dependiendo de tu estructura de retorno de Action
        if (result?.success) {
          onClose();
          toast.success("CV creado exitosamente");
          onCreated(result.data.id);
        } else {
          toast.error("Error al crear el CV");
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[1.5rem] border-secondary/20 bg-background backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
        <div className="p-8">
          {/* Header con identidad visual de Admin */}
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
            {/* Campo de Identificador: Prioridad Técnica */}
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

            {/* Inyección del formulario base */}
            <div className="border-t border-secondary/10 pt-4">
              <CVForm
                formData={formData}
                onFormDataChange={(data) =>
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

        {/* Footer con distinción de colores Secondary/Primary */}
        <DialogFooter className="p-6 bg-secondary/5 border-t border-secondary/10">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 font-bold border-secondary/20 hover:bg-secondary/10 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.title.trim() || !userIdentifier.trim() || isPending}
              className="flex-[2] rounded-xl h-12 font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
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
