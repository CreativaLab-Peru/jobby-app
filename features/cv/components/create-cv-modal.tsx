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

      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624]/80 dark:via-[#181b2a]/80 dark:to-blue-950/90 rounded-3xl shadow-2xl border border-gray-100 dark:border-blue-900 backdrop-blur-md p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-blue-700 dark:text-blue-200 animate-fade-in">
            <span className="ai-gradient-text">✨ Crear nuevo CV</span>
          </DialogTitle>

          <DialogDescription className="text-base text-gray-500 dark:text-blue-300 mt-2 font-medium animate-fade-in">
            Completa la información básica para comenzar a crear tu currículum
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <CVForm formData={formData} onFormDataChange={setFormData} />
        </div>

        <DialogFooter className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl font-bold text-blue-500 dark:text-blue-200 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/40 hover:scale-105 transition-all"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleCreateCV}
            disabled={!isFormValid || isCreating || isPending}
            className="px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 via-blue-400 to-accent shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:via-blue-500 hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Creando…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2 text-white drop-shadow animate-fade-in" />
                Crear CV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
