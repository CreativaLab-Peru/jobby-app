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

  const handleCreateCV = async () => {
    const { title, cvType, opportunityType } = formData;

    const isValid = title.trim() && opportunityType.trim() && cvType.trim();
    // Todo: mostrar el error al usuario
    if (!isValid) return;

    if (isCreating || isPending) return;

    setIsCreating(true);
    try {
      if (isPending) return;
      startTransition(() => {
        createCVByTitleAndType(title, cvType, opportunityType).then(
          (result) => {
            if (result?.success) {
              setFormData({
                title: "",
                opportunityType: "INTERNSHIP",
                cvType: "TECHNOLOGY_ENGINEERING",
              });
              onOpenChange(false);
              const cvId = result.data.id;
              router.push(`/cv/${cvId}/edit`);
            } else {
              console.error(
                "Error creando CV:",
                result?.message || "Unknown error"
              );
            }
          }
        );
      });
    } catch (error) {
      console.error("Error creando CV:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      cvType: "TECHNOLOGY_ENGINEERING",
      opportunityType: "INTERNSHIP",
    });
    onOpenChange(false);
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
            ✨ Crear Nuevo CV
          </DialogTitle>
          <DialogDescription>
            Completa la información básica para comenzar a crear tu currículum
          </DialogDescription>
        </DialogHeader>

        <CVForm formData={formData} onFormDataChange={setFormData} />

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            className="text-black border-gray-200 hover:bg-gray-200 hover:border-gray-200"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateCV}
            disabled={!isFormValid || isCreating || isPending}
            className="text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creando...
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
