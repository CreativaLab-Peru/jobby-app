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
      };

      const result = await createCVByTitleAndType(body);

      if (result?.success) {
        onCloseCreate();
        await refreshCredits();

        const routesResult = await getRoutesForUser();
        if (routesResult.success) {
          hydrate(routesResult.routes);
        }

        router.refresh();
        router.push(`/cv/${result.data.id}/edit`);
        toast.success("CV creado correctamente");
      } else {
        toast.error(result?.message || "Error al crear el currículum");
      }
    });
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
      <DialogContent className={cn(
        "max-w-[95vw] lg:max-w-6xl w-full p-0 overflow-hidden border border-border bg-background shadow-2xl rounded-xl"
      )}>
        <div className="flex flex-col h-[90vh] md:h-[80vh]">

          {/* Header Superior - Minimalista */}
          <div className="p-8 border-b border-border bg-background flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold leading-none">Configurador de CV</DialogTitle>
                <DialogDescription className="text-xs mt-1">
                  Personaliza la estructura antes de generar el documento.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onCloseCreate}
                className="flex-1 sm:flex-none h-10 font-semibold text-xs"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateCV}
                disabled={!formData.title.trim() || isPending || formData.sections.length === 0}
                className="flex-[2] sm:flex-none h-10 px-6 font-bold text-xs"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Confirmar y Crear"
                )}
              </Button>
            </div>
          </div>

          {/* Cuerpo del Formulario */}
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
