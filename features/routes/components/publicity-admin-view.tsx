"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  getAllPublicitySuggestions, 
  createPublicitySuggestion, 
  updatePublicitySuggestion, 
  deletePublicitySuggestion 
} from "@/features/routes/actions/publicity-actions";

type Suggestion = {
  id: string;
  icon: string | null;
  title: string;
  description: string | null;
  isActive: boolean;
};

export function PublicityAdminView({ initialSuggestions = [] }: { initialSuggestions?: Suggestion[] }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Sparkles",
    isActive: true,
  });

  // fetchSuggestions is called only after mutations (create/update/delete)
  const fetchSuggestions = async () => {
    const res = await getAllPublicitySuggestions();
    if (res.success) {
      setSuggestions(res.suggestions as Suggestion[]);
    } else {
      toast.error(res.message);
    }
  };

  const handleOpenDialog = (suggestion?: Suggestion) => {
    if (suggestion) {
      setEditingId(suggestion.id);
      setFormData({
        title: suggestion.title,
        description: suggestion.description || "",
        icon: suggestion.icon || "Sparkles",
        isActive: suggestion.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        icon: "Sparkles",
        isActive: true,
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (editingId) {
      const res = await updatePublicitySuggestion(editingId, formData);
      if (res.success) {
        toast.success("Sugerencia actualizada");
        fetchSuggestions();
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    } else {
      const res = await createPublicitySuggestion(formData);
      if (res.success) {
        toast.success("Sugerencia creada");
        fetchSuggestions();
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta sugerencia?")) {
      const res = await deletePublicitySuggestion(id);
      if (res.success) {
        toast.success("Sugerencia eliminada");
        fetchSuggestions();
      } else {
        toast.error(res.message);
      }
    }
  };

  const renderIcon = (iconName: string | null) => {
    const IconComponent = (LucideIcons as any)[iconName || "Sparkles"] || LucideIcons.Sparkles;
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

      {loading ? (
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
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título (Lo que se completará en el form)</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ej: Master en UK"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (Informativa)</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Explica de qué trata esta sugerencia..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icono (Nombre de Lucide)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="icon" 
                    value={formData.icon} 
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="Sparkles, GraduationCap..."
                  />
                  <div className="p-2 border rounded-md bg-muted flex items-center justify-center">
                    {renderIcon(formData.icon)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {["Sparkles", "GraduationCap", "Map", "Briefcase", "Globe", "Rocket", "Heart", "Star", "Target", "Zap"].map(iconName => (
                    <Button 
                      key={iconName}
                      type="button"
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setFormData({...formData, icon: iconName})}
                    >
                      {(() => {
                        const Icon = (LucideIcons as any)[iconName];
                        return Icon ? <Icon className="h-4 w-4" /> : null;
                      })()}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-8">
                <Label htmlFor="is-active">Activo</Label>
                <Switch 
                  id="is-active" 
                  checked={formData.isActive} 
                  onCheckedChange={(val) => setFormData({...formData, isActive: val})}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
