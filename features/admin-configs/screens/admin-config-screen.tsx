"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { AppConfig } from "@prisma/client";
import { useRouter } from "next/navigation";

import { ConfirmModal } from "@/components/shared/confirm-modal";
import { deleteConfigAction, type DeleteConfigFormState } from "../actions/delete-config";
import { upsertConfigAction, type UpsertConfigFormState } from "../actions/create-update-config";
import { AdminConfigDialog } from "../components/admin-config-dialog";
import { AdminConfigHeader } from "../components/admin-config-header";
import { AdminConfigList } from "../components/admin-config-list";

interface AdminConfigScreenProps {
  initialConfigs: AppConfig[];
}

const initialUpsertState: UpsertConfigFormState = {
  success: false,
};

const initialDeleteState: DeleteConfigFormState = {
  success: false,
};

export function AdminConfigScreen({ initialConfigs }: AdminConfigScreenProps) {
  const [configs, setConfigs] = useState<AppConfig[]>(initialConfigs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AppConfig | null>(null);
  const [configToDelete, setConfigToDelete] = useState<AppConfig | null>(null);
  const [formData, setFormData] = useState({ key: "", value: "" });
  const router = useRouter();
  const deleteFormRef = useRef<HTMLFormElement | null>(null);
  const lastUpsertMessageRef = useRef<string | null>(null);
  const lastDeleteMessageRef = useRef<string | null>(null);
  const [upsertState, upsertFormAction, isUpserting] = useActionState(
    upsertConfigAction,
    initialUpsertState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteConfigAction,
    initialDeleteState,
  );

  // Filtrar configuraciones por búsqueda
  const filteredConfigs = configs.filter((config) =>
    config.key.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setConfigs(initialConfigs);
  }, [initialConfigs]);

  useEffect(() => {
    if (
      upsertState.success &&
      upsertState.message &&
      lastUpsertMessageRef.current !== upsertState.message
    ) {
      lastUpsertMessageRef.current = upsertState.message;
      toast.success(upsertState.message);
      setIsDialogOpen(false);
      setEditingConfig(null);
      setFormData({ key: "", value: "" });
      router.refresh();
      return;
    }

    if (
      !upsertState.success &&
      upsertState.error &&
      lastUpsertMessageRef.current !== upsertState.error
    ) {
      lastUpsertMessageRef.current = upsertState.error;
      toast.error(upsertState.error);
    }
  }, [router, upsertState]);

  useEffect(() => {
    if (
      deleteState.success &&
      deleteState.message &&
      lastDeleteMessageRef.current !== deleteState.message
    ) {
      lastDeleteMessageRef.current = deleteState.message;
      toast.success(deleteState.message);
      setConfigToDelete(null);
      router.refresh();
      return;
    }

    if (
      !deleteState.success &&
      deleteState.error &&
      lastDeleteMessageRef.current !== deleteState.error
    ) {
      lastDeleteMessageRef.current = deleteState.error;
      toast.error(deleteState.error);
    }
  }, [deleteState, router]);

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

  const handleDeleteRequest = (config: AppConfig) => {
    setConfigToDelete(config);
  };

  const handleConfirmDelete = () => {
    deleteFormRef.current?.requestSubmit();
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
        isPending={isPending || isUpserting}
        formData={formData}
        onFormDataChange={setFormData}
        action={upsertFormAction}
        existingConfigs={configs}
      />

      <form ref={deleteFormRef} action={deleteFormAction} className="hidden">
        <input type="hidden" name="configId" value={configToDelete?.id ?? ""} />
      </form>

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
        loading={isPending || isDeleting}
        variant="destructive"
      />
    </main>
  );
}
