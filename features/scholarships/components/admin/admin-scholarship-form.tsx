"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  createScholarshipAction,
  type CreateScholarshipFormState,
} from "@/features/scholarships/actions/admin/create-scholarship";
import { updateScholarshipAction } from "@/features/scholarships/actions/admin/update-scholarship";
import { getCountries } from "@/features/scholarships/actions/admin/get-countries";
import { ScholarshipType } from "@prisma/client";

const initialState: CreateScholarshipFormState = { success: false };

const SCHOLARSHIP_TYPE_OPTIONS: { value: ScholarshipType; label: string }[] = [
  { value: ScholarshipType.MASTER, label: "Maestría" },
  { value: ScholarshipType.PHD, label: "Doctorado" },
  { value: ScholarshipType.FELLOWSHIP, label: "Beca" },
];

interface AdminScholarshipFormProps {
  scholarship?: {
    id: string;
    name: string;
    type: ScholarshipType;
    requirements: string[];
    benefits: string[];
    deadline: Date | null;
    url: string;
    isActive: boolean;
    countryId: string;
  };
  countries: { id: string; name: string; code: string; flag: string }[];
}

export function AdminScholarshipForm({ scholarship, countries }: AdminScholarshipFormProps) {
  const action = scholarship?.id
    ? (prevState: any, formData: FormData) =>
        updateScholarshipAction(scholarship.id, prevState, formData)
    : createScholarshipAction;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  const [name, setName] = useState(scholarship?.name || "");
  const [countryId, setCountryId] = useState(scholarship?.countryId || "");
  const [type, setType] = useState<ScholarshipType>(scholarship?.type || ScholarshipType.MASTER);
  const [requirements, setRequirements] = useState<string[]>(scholarship?.requirements || []);
  const [benefits, setBenefits] = useState<string[]>(scholarship?.benefits || []);
  const [deadline, setDeadline] = useState(
    scholarship?.deadline ? new Date(scholarship.deadline).toISOString().split("T")[0] : ""
  );
  const [url, setUrl] = useState(scholarship?.url || "");
  const [isActive, setIsActive] = useState(scholarship?.isActive ?? true);

  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || (scholarship ? "Beca actualizada" : "Beca creada"));
      router.push("/admin/scholarships");
      router.refresh();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, scholarship]);

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold">
          {scholarship ? "Editar Beca" : "Nueva Beca"}
        </h1>
        <p className="text-muted-foreground">
          {scholarship ? `Editando "${scholarship.name}"` : "Registra una nueva oportunidad de beca"}
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        {scholarship?.id && <input type="hidden" name="id" value={scholarship.id} />}

        {/* Hidden fields for arrays */}
        <input type="hidden" name="requirements" value={JSON.stringify(requirements)} />
        <input type="hidden" name="benefits" value={JSON.stringify(benefits)} />

        <Card className="p-6 border-border/60 bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la beca</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Programa Chevening"
              />
              {state.fieldErrors?.name && (
                <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryId">País</Label>
              <Select value={countryId} onValueChange={setCountryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.flag} {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="countryId"
                value={countryId}
                onChange={() => {}}
              />
              {state.fieldErrors?.countryId && (
                <p className="text-xs text-destructive">{state.fieldErrors.countryId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de beca</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as ScholarshipType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {SCHOLARSHIP_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="type" value={type} />
              {state.fieldErrors?.type && (
                <p className="text-xs text-destructive">{state.fieldErrors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Fecha límite (opcional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              {state.fieldErrors?.deadline && (
                <p className="text-xs text-destructive">{state.fieldErrors.deadline}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="url">URL de aplicación</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
              {state.fieldErrors?.url && (
                <p className="text-xs text-destructive">{state.fieldErrors.url}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Activa</Label>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => {
                    setIsActive(checked);
                  }}
                />
                <input type="hidden" name="isActive" value={String(isActive)} />
              </div>
            </div>
          </div>
        </Card>

        {/* Requirements */}
        <Card className="p-6 border-border/60 bg-card/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Requisitos
          </h3>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1 p-2 rounded bg-muted text-sm">{req}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Agregar requisito..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addRequirement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {state.fieldErrors?.requirements && (
            <p className="text-xs text-destructive mt-2">{state.fieldErrors.requirements}</p>
          )}
        </Card>

        {/* Benefits */}
        <Card className="p-6 border-border/60 bg-card/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Beneficios
          </h3>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1 p-2 rounded bg-muted text-sm">{benefit}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Agregar beneficio..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBenefit();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addBenefit}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {state.fieldErrors?.benefits && (
            <p className="text-xs text-destructive mt-2">{state.fieldErrors.benefits}</p>
          )}
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
            Descartar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {scholarship ? "Guardar cambios" : "Crear Beca"}
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}