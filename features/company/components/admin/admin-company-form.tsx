"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Palette, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CompanyCreateFormState, createCompanyAction } from "../../actions/create-company.action";

const SUGGESTED_COLORS = [
  { name: "Slate", hex: "#0f172a" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Violet", hex: "#8b5cf6" },
];

const initialState: CompanyCreateFormState = {
  success: false,
};

export function AdminCompanyForm({ company }: { company?: any }) {
  const [state, formAction, isPending] = useActionState(createCompanyAction, initialState);
  const router = useRouter();

  // 1. Estados del formulario (Añadido secondaryColor)
  const [name, setName] = useState(company?.name || "");
  const [primaryColor, setPrimaryColor] = useState(company?.primaryColor || "#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState(company?.secondaryColor || "#94a3b8");
  const [isActive, setIsActive] = useState(company?.isActive ?? true);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/admin/companies");
      router.refresh();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Sección: Información Principal */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre y Enlace</Label>
            <Card className="p-4 space-y-4 border-border/60 bg-card/50">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la empresa</Label>
                <Input
                  id="name"
                  name="name" // IMPORTANTE para el action
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Levely HQ"
                />
                {state.fieldErrors?.name && <p className="text-xs text-destructive">{state.fieldErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="flex items-center gap-2">
                  <LinkIcon className="h-3 w-3" /> Slug
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={company?.slug || ""}
                  placeholder="nombre-de-la-empresa"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Identificación y Web</Label>
            <Card className="p-4 space-y-4 border-border/60 bg-card/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC</Label>
                  <Input id="ruc" name="ruc" defaultValue={company?.ruc || ""} placeholder="20..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Web</Label>
                  <Input id="website" name="website" defaultValue={company?.website || ""} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Input id="logoUrl" name="logoUrl" defaultValue={company?.logoUrl || ""} placeholder="https://..." />
              </div>
            </Card>
          </div>
        </div>

        {/* Sección: Identidad Visual (Branding) */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Colores de Marca</Label>
            <Card className="p-4 space-y-6 border-border/60 bg-card/50">

              {/* 2. Preview Dinámico con ambos colores */}
              <div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-border/100 bg-background/50">
                <div className="flex -space-x-2">
                  <div className="h-12 w-12 rounded-lg shadow-md border-2 border-background" style={{ backgroundColor: primaryColor }} />
                  <div className="h-12 w-12 rounded-lg shadow-md border-2 border-background" style={{ backgroundColor: secondaryColor }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: primaryColor }}>{name || "Nombre Empresa"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">{primaryColor} / {secondaryColor}</p>
                </div>
              </div>

              {/* Selector Color Principal */}
              <div className="space-y-3">
                <Label className="text-[10px] font-semibold uppercase opacity-70">Color Principal</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="primaryColor"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="pl-9 font-mono"
                    />
                  </div>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border-none bg-transparent"
                  />
                </div>
              </div>

              {/* 3. Selector Color Secundario */}
              <div className="space-y-3">
                <Label className="text-[10px] font-semibold uppercase opacity-70">Color Secundario</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="secondaryColor"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="pl-9 font-mono"
                    />
                  </div>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border-none bg-transparent"
                  />
                </div>
              </div>

              {/* Sugerencias (aplica al color principal por defecto) */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Sugerencias (Principal)</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setPrimaryColor(c.hex)}
                      className={cn(
                        "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                        primaryColor === c.hex ? "border-primary" : "border-transparent"
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-accent/5 p-4">
            <div className="space-y-0.5">
              <Label className="font-bold">Empresa Activa</Label>
              <p className="text-xs text-muted-foreground">Permitir que la empresa sea visible</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <input type="hidden" name="isActive" value={String(isActive)} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
          Descartar
        </Button>
        <Button type="submit" disabled={isPending} variant="accent" className="min-w-[140px] rounded-xl font-bold">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {company ? "Guardar cambios" : "Crear Empresa"}
        </Button>
      </div>
    </form>
  );
}