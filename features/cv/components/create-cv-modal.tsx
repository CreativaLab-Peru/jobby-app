"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CVForm } from "./cv-form";
import { createCVByTitleAndType } from "@/features/cv/actions/create-cv-by-title-and-type";
import { useRouter } from "next/navigation";
import { CvType, OpportunityType } from "@prisma/client";

interface CreateCVModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCVModal({
                                children,
                                isOpen,
                                onOpenChange,
                              }: CreateCVModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    cvType: CvType;
    opportunityType: OpportunityType;
  }>({
    title: "",
    cvType: "TECHNOLOGY_ENGINEERING",
    opportunityType: "INTERNSHIP",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateCV = () => {
    if (!formData.title.trim() || isCreating || isPending) return;

    setIsCreating(true);

    startTransition(() => {
      createCVByTitleAndType(
        formData.title,
        formData.cvType,
        formData.opportunityType
      ).then((result) => {
        if (result?.success) {
          onOpenChange(false);
          router.push(`/cv/${result.data.id}/edit`);
        }
        setIsCreating(false);
      });
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <span className="text-gradient">✨ Crear nuevo CV</span>
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Completa la información básica para comenzar a crear tu currículum
          </DialogDescription>
        </DialogHeader>

        <CVForm formData={formData} onFormDataChange={setFormData} />

        <DialogFooter className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleCreateCV}
            disabled={!isFormValid || isCreating || isPending}
            className="shadow-glow"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Creando…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Crear CV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
