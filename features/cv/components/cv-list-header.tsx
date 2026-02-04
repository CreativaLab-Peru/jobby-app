"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { CreateCVModal } from "./create-cv-modal";
import { UploadCVModal } from "./upload-cv-modal";
import { useState } from "react";

interface CVListHeaderProps {
  disabledButton?: boolean;
}

export function CVListHeader({ disabledButton }: CVListHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openCreateModal = (value: boolean) => {
    if (disabledButton) return;
    setIsCreateModalOpen(value);
  };

  const openUploadModal = (value: boolean) => {
    if (disabledButton) return;
    setIsUploadModalOpen(value);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-levely-blue dark:text-levely-green text-3xl font-bold mb-1">
            Mis CVs ✨
          </h1>
          <p className="text-muted-foreground">Gestiona y visualiza todos tus currículums</p>
        </div>

        <div className="flex gap-2">
          <UploadCVModal isOpen={isUploadModalOpen} onOpenChange={openUploadModal}>
            <Button
              variant="outline"
              disabled={disabledButton}
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center transition-colors"
            >
              <Upload className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Subir CV</span>
            </Button>
          </UploadCVModal>

          <CreateCVModal isOpen={isCreateModalOpen} onOpenChange={openCreateModal}>
            <Button
              variant="accent"
              disabled={disabledButton}
              onClick={() => setIsCreateModalOpen(true)}
              className="dark:bg-levely-green dark:hover:bg-levely-green/90 flex items-center bg-levely-blue hover:bg-levely-blue/90 transition-colors"
            >
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Crear nuevo CV</span>
            </Button>
          </CreateCVModal>
        </div>
      </div>
    </div>
  );
}
