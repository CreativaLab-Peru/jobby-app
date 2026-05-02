"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";

interface AdminConfigHeaderProps {
  onAdd: () => void;
}

export function AdminConfigHeader({ onAdd }: AdminConfigHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
      <PageHeader
        title="Configuraciones del Sistema"
        description="Administra las variables globales y parámetros de la aplicación."
      />
      <Button onClick={onAdd} className="gap-2 font-bold shadow-sm">
        <Plus className="h-4 w-4" />
        Nueva Configuración
      </Button>
    </div>
  );
}
