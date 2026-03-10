"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { OpportunityType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/shared/searchable-select";

import { createAdminOpportunity } from "@/features/opportunities/actions/admin/create-admin-opportunity";
import {
  getCvsForOpportunitySelect,
  CvSelectItem,
} from "@/features/opportunities/actions/admin/get-cvs-for-opportunity-select";

const TYPE_OPTIONS: { value: OpportunityType; label: string }[] = [
  { value: "EMPLOYMENT", label: "Empleo" },
  { value: "INTERNSHIP", label: "Pasantía" },
  { value: "SCHOLARSHIP", label: "Beca" },
  { value: "EXCHANGE_PROGRAM", label: "Intercambio" },
  { value: "STARTUP", label: "Aceleradora" },
];

interface AdminCreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const EMPTY_FORM = {
  title: "",
  cvId: "",
  type: "EMPLOYMENT" as OpportunityType,
  company: "",
  description: "",
  requirements: "",
  linkUrl: "",
  location: "",
  modality: "",
  salary: "",
  benefits: "",
  deadline: "",
};

export function AdminCreateOpportunityModal({
  isOpen,
  onClose,
  onCreated,
}: AdminCreateOpportunityModalProps) {
  const router = useRouter();
  const [isSubmitting, startSubmit] = useTransition();
  const [isCvsLoading, startCvsLoad] = useTransition();

  const [form, setForm] = useState(EMPTY_FORM);
  const [cvs, setCvs] = useState<CvSelectItem[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  useEffect(() => {
    if (!isOpen) return;
    startCvsLoad(async () => {
      const result = await getCvsForOpportunitySelect();
      if (result.success) {
        setCvs(result.data);
      }
    });
  }, [isOpen]);

  const set =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "El título es obligatorio";
    if (!form.cvId) newErrors.cvId = "Selecciona un CV";
    if (!form.requirements.trim()) newErrors.requirements = "Los requisitos son obligatorios";
    if (!form.linkUrl.trim()) newErrors.linkUrl = "La URL es obligatoria";
    else {
      try {
        new URL(form.linkUrl);
      } catch {
        newErrors.linkUrl = "URL inválida";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startSubmit(async () => {
      const result = await createAdminOpportunity({
        title: form.title.trim(),
        cvId: form.cvId,
        type: form.type,
        requirements: form.requirements.trim(),
        linkUrl: form.linkUrl.trim(),
        company: form.company.trim() || null,
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        modality: form.modality.trim() || null,
        salary: form.salary.trim() || null,
        benefits: form.benefits.trim() || null,
        deadline: form.deadline || null,
      });

      if (result.success) {
        toast.success(result.message);
        setForm(EMPTY_FORM);
        setErrors({});
        onCreated();
        router.refresh();
      } else {
        toast.error((result as { success: false; error: string }).error);
      }
    });
  };

  const cvSelectItems = cvs.map((cv) => ({
    value: cv.id,
    label: cv.title ? `${cv.title} — ${cv.userLabel}` : `Sin título — ${cv.userLabel}`,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Crear Oportunidad
          </DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Completa los datos para registrar una nueva oportunidad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Título *
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={set("title")}
              placeholder="Ej: Desarrollador Full Stack en Startup"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* CV */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">CV asociado *</Label>
            {isCvsLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando CVs...
              </div>
            ) : (
              <SearchableSelect
                items={cvSelectItems}
                placeholder="Buscar y seleccionar CV..."
                searchPlaceholder="Buscar por título o usuario..."
                emptyMessage="No se encontraron CVs."
                selectedValue={form.cvId || null}
                onSelect={(val) => {
                  setForm((prev) => ({ ...prev, cvId: val ?? "" }));
                  if (val)
                    setErrors((prev) => ({ ...prev, cvId: undefined }));
                }}
              />
            )}
            {errors.cvId && (
              <p className="text-xs text-destructive">{errors.cvId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tipo</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, type: v as OpportunityType }))
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">
                Empresa
              </Label>
              <Input
                id="company"
                value={form.company}
                onChange={set("company")}
                placeholder="Nombre de la empresa"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold">
                Ubicación
              </Label>
              <Input
                id="location"
                value={form.location}
                onChange={set("location")}
                placeholder="Ej: Bogotá, Colombia"
                disabled={isSubmitting}
              />
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <Label htmlFor="modality" className="text-sm font-semibold">
                Modalidad
              </Label>
              <Input
                id="modality"
                value={form.modality}
                onChange={set("modality")}
                placeholder="Remoto / Híbrido"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Salario */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-semibold">
                Salario
              </Label>
              <Input
                id="salary"
                value={form.salary}
                onChange={set("salary")}
                placeholder="Ej: $2,000 - $3,000 USD"
                disabled={isSubmitting}
              />
            </div>

            {/* Fecha límite */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-semibold">
                Fecha límite
              </Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={set("deadline")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="linkUrl" className="text-sm font-semibold">
              URL de postulación *
            </Label>
            <Input
              id="linkUrl"
              value={form.linkUrl}
              onChange={set("linkUrl")}
              placeholder="https://..."
              disabled={isSubmitting}
            />
            {errors.linkUrl && (
              <p className="text-xs text-destructive">{errors.linkUrl}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={set("description")}
              placeholder="Describe la oportunidad..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Requisitos */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-semibold">
              Requisitos *
            </Label>
            <Textarea
              id="requirements"
              value={form.requirements}
              onChange={set("requirements")}
              placeholder="Lista los requisitos necesarios..."
              rows={3}
              disabled={isSubmitting}
            />
            {errors.requirements && (
              <p className="text-xs text-destructive">{errors.requirements}</p>
            )}
          </div>

          {/* Beneficios */}
          <div className="space-y-2">
            <Label htmlFor="benefits" className="text-sm font-semibold">
              Beneficios
            </Label>
            <Textarea
              id="benefits"
              value={form.benefits}
              onChange={set("benefits")}
              placeholder="Seguro médico, bonos, capacitaciones..."
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg font-bold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Oportunidad
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
