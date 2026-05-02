"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { AppConfig } from "@prisma/client";

import { upsertConfig, deleteConfig } from "../actions/config-actions";
import { AdminConfigDialog } from "../components/admin-config-dialog";
import { AdminConfigHeader } from "../components/admin-config-header";
import { AdminConfigList } from "../components/admin-config-list";

interface AdminConfigScreenProps {
  initialConfigs: AppConfig[];
}

export function AdminConfigScreen({ initialConfigs }: AdminConfigScreenProps) {
  const [configs, setConfigs] = useState<AppConfig[]>(initialConfigs);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AppConfig | null>(null);
  const [formData, setFormData] = useState({ key: "", value: "" });

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

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta configuración?")) return;

    startTransition(async () => {
      try {
        const result = await deleteConfig(id);
        if (result.success) {
          toast.success("Configuración eliminada");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="mx-auto max-w-5xl space-y-8">
        <AdminConfigHeader onAdd={handleOpenAdd} />

        <AdminConfigList
          configs={configs}
          isPending={isPending}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
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
      />
    </main>
  );
}
