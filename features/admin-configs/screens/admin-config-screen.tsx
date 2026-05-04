"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { AppConfig } from "@prisma/client";

import { ConfirmModal } from "@/components/shared/confirm-modal";
import { upsertConfig } from "../actions/create-update-config";
import { deleteConfig } from "../actions/delete-config";
import { AdminConfigDialog } from "../components/admin-config-dialog";
import { AdminConfigHeader } from "../components/admin-config-header";
import { AdminConfigList } from "../components/admin-config-list";

interface AdminConfigScreenProps {
  initialConfigs: AppConfig[];
}

export function AdminConfigScreen({ initialConfigs }: AdminConfigScreenProps) {
  const [configs, setConfigs] = useState<AppConfig[]>(initialConfigs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AppConfig | null>(null);
  const [configToDelete, setConfigToDelete] = useState<AppConfig | null>(null);
  const [formData, setFormData] = useState({ key: "", value: "" });

  // Filtrar configuraciones por búsqueda
  const filteredConfigs = configs.filter((config) =>
    config.key.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setConfigs(initialConfigs);
  }, [initialConfigs]);

  const handleOpenAdd = () => {
    setEditingConfig(null);
    setFormData({ key: "", value: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (config: AppConfig) => {
    setEditingConfig(config);
    setFormData({ key: config.key, value: config.value });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await upsertConfig(editingConfig?.id, formData);
        if (result.success) {
          toast.success(editingConfig ? "Configuración actualizada" : "Configuración creada");
          setIsDialogOpen(false);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const handleDeleteRequest = (config: AppConfig) => {
    setConfigToDelete(config);
  };

  const handleConfirmDelete = () => {
    if (!configToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteConfig(configToDelete.id);
        if (result.success) {
          toast.success("Configuración eliminada");
          setConfigToDelete(null);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="mx-auto max-w-5xl space-y-8">
        <AdminConfigHeader
          onAdd={handleOpenAdd}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <AdminConfigList
          configs={filteredConfigs}
          isPending={isPending}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRequest}
        />
      </div>

      <AdminConfigDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingConfig={editingConfig}
        isPending={isPending}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        existingConfigs={configs}
      />

      <ConfirmModal
        isOpen={!!configToDelete}
        onOpenChange={(open) => {
          if (!open) setConfigToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar configuración"
        description={
          configToDelete
            ? `¿Estás seguro de eliminar la configuración ${configToDelete.key}? Esta acción no se puede deshacer.`
            : "¿Estás seguro de eliminar esta configuración? Esta acción no se puede deshacer."
        }
        loading={isPending}
        variant="destructive"
      />
    </main>
  );
}
