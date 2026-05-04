"use client";

import { Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";

interface AdminConfigHeaderProps {
  onAdd: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function AdminConfigHeader({ onAdd, searchTerm, onSearchChange }: AdminConfigHeaderProps) {
  return (
    <div className="space-y-4 border-b border-border pb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title="Configuraciones del Sistema"
          description="Administra las variables globales y parámetros de la aplicación."
        />
        <Button onClick={onAdd} className="gap-2 font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          Nueva Configuración
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por clave..."
          className="pl-10 pr-10 rounded-xl"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 hover:bg-muted"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
