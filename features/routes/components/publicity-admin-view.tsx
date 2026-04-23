"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTransition } from "react";
import { PublicityForm, PublicityFormValues } from "./publicity-form";
import {
  getAllPublicitySuggestions,
  createPublicitySuggestion,
  updatePublicitySuggestion,
  deletePublicitySuggestion
} from "@/features/routes/actions/publicity-actions";
import { RoutePublicitySuggestion } from "@prisma/client";



export function PublicityAdminView({ initialSuggestions = [] }: { initialSuggestions?: RoutePublicitySuggestion[] }) {
  const [suggestions, setSuggestions] = useState<RoutePublicitySuggestion[]>(initialSuggestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSuggestion, setEditingSuggestion] = useState<RoutePublicitySuggestion | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // fetchSuggestions is called only after mutations (create/update/delete)
  const fetchSuggestions = async () => {
    const res = await getAllPublicitySuggestions();
    if (res.success) {
      setSuggestions(res.suggestions);
    } else {
      toast.error(res.message);
    }
  };

  const handleOpenDialog = (suggestion?: RoutePublicitySuggestion) => {
    if (suggestion) {
      setEditingId(suggestion.id);
      setEditingSuggestion(suggestion);
    } else {
      setEditingId(null);
      setEditingSuggestion(null);
    }
    setIsOpen(true);
  };

  const onSubmit = async (values: PublicityFormValues) => {
    startTransition(async () => {
      if (editingId) {
        const res = await updatePublicitySuggestion(editingId, {
          ...values,
          description: values.description || undefined,
          icon: values.icon || undefined,
        });
        if (res.success) {
          toast.success("Sugerencia actualizada");
          await fetchSuggestions();
          setIsOpen(false);
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createPublicitySuggestion({
          ...values,
          description: values.description || undefined,
          icon: values.icon || undefined,
        });
        if (res.success) {
          toast.success("Sugerencia creada");
          await fetchSuggestions();
          setIsOpen(false);
        } else {
          toast.error(res.message);
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta sugerencia?")) {
      startTransition(async () => {
        const res = await deletePublicitySuggestion(id);
        if (res.success) {
          toast.success("Sugerencia eliminada");
          await fetchSuggestions();
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  const renderIcon = (iconName: string | null) => {
    const icons = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;
    const IconComponent = icons[iconName || "Sparkles"] || LucideIcons.Sparkles;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Publicidad y Rutas</h2>
          <p className="text-muted-foreground">Gestiona las sugerencias que aparecen al crear una nueva ruta.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Sugerencia
        </Button>
      </div>

      {isPending && suggestions.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((s) => (
            <Card key={s.id} className={!s.isActive ? "opacity-60 bg-muted/50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {renderIcon(s.icon)}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="mt-2">{s.title}</CardTitle>
                <CardDescription className="line-clamp-2">{s.description || "Sin descripción"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs">
                  {s.isActive ? (
                    <span className="flex items-center text-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Activo</span>
                  ) : (
                    <span className="flex items-center text-muted-foreground"><XCircle className="h-3 w-3 mr-1" /> Inactivo</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {suggestions.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
              <p className="text-muted-foreground">No hay sugerencias configuradas.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Sugerencia" : "Nueva Sugerencia"}</DialogTitle>
            <DialogDescription>
              Configura los detalles de la sugerencia que verá el usuario.
            </DialogDescription>
          </DialogHeader>

          <PublicityForm 
            key={editingId || "new"}
            initialData={editingSuggestion}
            onSubmit={onSubmit}
            isPending={isPending}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
