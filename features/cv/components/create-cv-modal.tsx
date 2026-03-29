"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CVForm } from "./cv-form";
import {
  CreateCvBody,
  createCVByTitleAndType
} from "@/features/cv/actions/create-cv-by-title-and-type";
import { useCreditsStore } from "@/store/use-credits-store";
import { useCvModalStore } from "../hooks/use-cv-modal-store";
import { cn } from "@/lib/utils";
import { CVFormData } from "@/features/cv/schema";
import { Language } from "@prisma/client";
import { useRouteStore } from "@/store/use-route-store";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";

export function CreateCVModal() {
  const router = useRouter();
  const { refreshCredits } = useCreditsStore();
  const { isCreateOpen, onCloseCreate } = useCvModalStore();
  const { hydrate } = useRouteStore();

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<CVFormData>({
    title: "",
    cvType: "TECHNOLOGY_ENGINEERING",
    opportunityType: "SCHOLARSHIP",
    templateId: "harvard",
    language: Language.ES,
    sections: []
  });

  const handleCreateCV = async () => {
    if (!formData.title.trim() || isPending) return;

    startTransition(async () => {
      const body: CreateCvBody = {
        cvType: formData.cvType,
        title: formData.title,
        templateId: formData.templateId,
        opportunityType: formData.opportunityType,
        language: formData.language,
        sections: formData.sections
      }

      const result = await createCVByTitleAndType(body)

      if (result?.success) {
        onCloseCreate();
        await refreshCredits();

        const routesResult = await getRoutesForUser();
        if (routesResult.success) {
          hydrate(routesResult.routes);
        }

        router.refresh();
        router.push(`/cv/${result.data.id}/edit`);
        toast.success("¡CV creado con éxito!");
      } else {
        toast.error(result?.message || "Error al crear el currículum.");
      }
    });
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
      <DialogContent className={cn(
        "max-w-[95vw] w-full p-0 overflow-hidden border-none bg-transparent shadow-none"
      )}>
        <div className="flex flex-col gap-4 h-[90vh]">

          {/* Header Superior - Fuera del grid para dar aire */}
          <div className="bg-background/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-border/40 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight">Configurador de CV IA</DialogTitle>
                <DialogDescription className="text-xs font-medium">Define la estructura y el perfil de tu próximo paso profesional.</DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onCloseCreate}
                className="rounded-xl font-bold text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateCV}
                disabled={!formData.title.trim() || isPending || formData.sections.length === 0}
                className="bg-primary hover:opacity-90 text-primary-foreground rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Crear y Continuar"
                )}
              </Button>
            </div>
          </div>

          {/* Cuerpo del Formulario - Aquí es donde vive el Grid de 3 columnas del CVForm */}
          <div className="flex-1 overflow-hidden">
            <CVForm
              defaultValues={formData}
              onValuesChange={setFormData}
            />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
