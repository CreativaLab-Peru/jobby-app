"use client";

import { Settings2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppConfig } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { AdminConfigItem } from "./admin-config-item";

interface AdminConfigListProps {
  configs: AppConfig[];
  isPending: boolean;
  onAdd: () => void;
  onEdit: (config: AppConfig) => void;
  onDelete: (id: string) => void;
}

export function AdminConfigList({
  configs,
  isPending,
  onAdd,
  onEdit,
  onDelete,
}: AdminConfigListProps) {
  return (
    <div className="grid gap-4">
      <AnimatePresence mode="popLayout">
        {configs.map((config) => (
          <AdminConfigItem key={config.id} config={config} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </AnimatePresence>

      {configs.length === 0 && !isPending && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-[2rem] bg-muted/10">
          <Settings2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No hay configuraciones registradas.</p>
          <Button variant="link" onClick={onAdd} className="text-primary font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Crea la primera aquí
          </Button>
        </div>
      )}

      {isPending && configs.length === 0 && (
        <div className="flex justify-center py-20">
          <Settings2 className="h-8 w-8 animate-spin text-primary/30" />
        </div>
      )}
    </div>
  );
}
