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
        if (result.success) {
          onClose();
          toast.success("CV creado para el usuario");
          onCreated(result.data.id);
        } else {
          const errorMsg = (result as { error: string }).error || "Error creando CV para el usuario";
          toast.error(errorMsg);
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">
                Crear CV (Admin)
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                Crea un CV para un usuario usando su correo o ID.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                Usuario (correo o ID)
              </label>
              <Input
                value={userIdentifier}
                onChange={(e) => setUserIdentifier(e.target.value)}
                placeholder="usuario@correo.com o UUID"
              />
            </div>

            <CVForm
              formData={formData}
              onFormDataChange={(data) =>
                setFormData(prev => ({ ...prev, ...data, templateId: data.templateId ?? prev.templateId }))
              }
            />
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-secondary/10">
          <div className="flex w-full gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 font-bold text-muted-foreground"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.title.trim() || !userIdentifier.trim() || isPending}
              variant="accent"
              className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
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

