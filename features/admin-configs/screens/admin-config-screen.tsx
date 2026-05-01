"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Settings2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AppConfig } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { upsertConfig, deleteConfig } from "../actions/config-actions";

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <PageHeader
            title="Configuraciones del Sistema"
            description="Administra las variables globales y parámetros de la aplicación."
          />
          <Button onClick={handleOpenAdd} className="gap-2 font-bold shadow-sm">
            <Plus className="h-4 w-4" />
            Nueva Configuración
          </Button>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {configs.map((config) => (
              <ConfigItem
                key={config.id}
                config={config}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>

          {configs.length === 0 && !isPending && (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-[2rem] bg-muted/10">
              <Settings2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No hay configuraciones registradas.</p>
              <Button variant="link" onClick={handleOpenAdd} className="text-primary font-bold">
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                {editingConfig ? "Editar Configuración" : "Nueva Configuración"}
              </DialogTitle>
              <DialogDescription>
                Ingresa la clave y el valor para esta variable de entorno dinámica.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="key" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Clave (Key)
                </Label>
                <Input
                  id="key"
                  placeholder="EJ: STRIPE_PUBLIC_KEY"
                  className="rounded-xl font-mono uppercase text-xs"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  disabled={!!editingConfig || isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Valor (Value)
                </Label>
                <Input
                  id="value"
                  placeholder="Ingresa el valor..."
                  className="rounded-xl"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  disabled={isPending}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isPending} className="rounded-xl font-bold">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl font-bold gap-2">
                {isPending ? (
                  <Settings2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingConfig ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ConfigItem({
  config,
  onEdit,
  onDelete
}: {
  config: AppConfig;
  onEdit: (config: AppConfig) => void;
  onDelete: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card className="hover:border-primary/30 transition-colors shadow-sm">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded">
                KEY
              </span>
              <h3 className="font-bold text-foreground truncate uppercase tracking-tight">
                {config.key}
              </h3>
            </div>
            <div className="flex items-center gap-2 pt-1 group">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                VALUE
              </span>
              <p className="text-sm text-muted-foreground break-all font-mono">
                {isVisible ? config.value : "••••••••••••••••"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Eye className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
              onClick={() => onEdit(config)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-all"
              onClick={() => onDelete(config.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
