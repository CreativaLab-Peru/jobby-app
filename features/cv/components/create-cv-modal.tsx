"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { CvType, OpportunityType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CVForm } from "./cv-form";
import { createCVByTitleAndType } from "@/features/cv/actions/create-cv-by-title-and-type";
import { useCreditsStore } from "@/store/use-credits-store";
import { useCvModalStore } from "../hooks/use-cv-modal-store";

export function CreateCVModal() {
  const router = useRouter();
  const { refreshCredits } = useCreditsStore();
  const { isCreateOpen, onCloseCreate } = useCvModalStore();

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<{
    title: string;
    cvType: CvType;
    opportunityType: OpportunityType;
  }>({
    title: "",
    cvType: "TECHNOLOGY_ENGINEERING",
    opportunityType: "INTERNSHIP",
  });

  const handleCreateCV = () => {
    if (!formData.title.trim() || isPending) return;

    startTransition(() => {
      createCVByTitleAndType(
        formData.title,
        formData.cvType,
        formData.opportunityType
      ).then(async (result) => {
        if (result?.success) {
          onCloseCreate();
          await refreshCredits();
          router.refresh();
          router.push(`/cv/${result.data.id}/edit`);
        }
      });
    });
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="items-center text-center space-y-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">
                Nuevo currículum
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground/80">
                Define el perfil y el objetivo para que la IA optimice tu contenido.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-2 animate-in fade-in zoom-in-95 duration-300">
            <CVForm formData={formData} onFormDataChange={setFormData} />
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-secondary/10">
          <div className="flex w-full gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={onCloseCreate}
              className="flex-1 rounded-xl h-12 font-bold text-muted-foreground"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCV}
              disabled={!formData.title.trim() || isPending}
              variant="accent"
              className="flex-[2] rounded-xl h-12 font-bold shadow-lg shadow-accent/20 transition-all active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Crear ahora
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
