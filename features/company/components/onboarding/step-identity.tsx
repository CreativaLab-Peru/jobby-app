"use client";

import { useCompanyOnboardingStore } from "../../store/company-onboarding-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Palette, Globe, Building2, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoUpload } from "./logo-upload";

// Suggested Colors
const SUGGESTED_COLORS = [
  { name: "Amber", hex: "#f59e0b" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Slate", hex: "#475569" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Violet", hex: "#8b5cf6" },
];

export function StepIdentity() {
  const { formData, updateFormData, errors } = useCompanyOnboardingStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Identidad Corporativa</h2>
        <p className="text-muted-foreground">
          Cuéntanos sobre tu empresa para personalizar tu espacio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Información Básica */}
        <div className="space-y-6">
          <div className="flex justify-center md:justify-start">
            <LogoUpload
              value={formData.logoUrl}
              onChange={(url) => updateFormData({ logoUrl: url })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Nombre de la empresa *
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="Ej. Levely"
                className={cn("pl-10 h-12 rounded-xl", errors.name && "border-destructive")}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruc" className="text-sm font-semibold text-muted-foreground">
              RUC (Opcional)
            </Label>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ruc"
                value={formData.ruc || ""}
                onChange={(e) => updateFormData({ ruc: e.target.value })}
                placeholder="20123456789"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-semibold text-muted-foreground">
              Sitio Web (Opcional)
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                value={formData.website || ""}
                onChange={(e) => updateFormData({ website: e.target.value })}
                placeholder="https://tuempresa.com"
                className={cn("pl-10 h-12 rounded-xl", errors.website && "border-destructive")}
              />
            </div>
            {errors.website && (
              <p className="text-xs text-destructive font-medium">{errors.website}</p>
            )}
          </div>
        </div>

        {/* Branding y Preview */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Branding de Marca</Label>
            <Card className="p-6 space-y-6 border-border/60 bg-card/50 rounded-2xl shadow-sm">
              {/* Preview Dinámico */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border bg-background/50">
                <div
                  className="h-14 w-14 rounded-xl shadow-inner transition-all duration-300 ring-2 ring-white/20 flex items-center justify-center overflow-hidden bg-muted/20"
                  style={{
                    backgroundColor: !formData.logoUrl
                      ? formData.primaryColor || "#000000"
                      : "transparent",
                  }}
                >
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>
                <div>
                  <p
                    className="text-base font-bold"
                    style={{ color: formData.primaryColor || "#000000" }}
                  >
                    {formData.name || "Tu Empresa"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground uppercase font-mono tracking-widest">
                      P: {formData.primaryColor || "#000000"}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground uppercase font-mono tracking-widest border-l-2" style={{ borderLeftColor: formData.secondaryColor || "#ffffff" }}>
                      S: {formData.secondaryColor || "#ffffff"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector de Color Primario */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Color Primario</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={formData.primaryColor || ""}
                        onChange={(e) => updateFormData({ primaryColor: e.target.value })}
                        className="pl-9 h-11 font-mono rounded-xl"
                        placeholder="#000000"
                      />
                    </div>
                    <input
                      type="color"
                      value={formData.primaryColor || "#000000"}
                      onChange={(e) => updateFormData({ primaryColor: e.target.value })}
                      className="h-11 w-14 cursor-pointer rounded-xl border-2 border-border bg-transparent p-1 transition-transform active:scale-95"
                    />
                  </div>
                </div>

                {/* Selector de Color Secundario */}
                <div className="space-y-1.5 pt-2">
                  <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Color Secundario</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={formData.secondaryColor || ""}
                        onChange={(e) => updateFormData({ secondaryColor: e.target.value })}
                        className="pl-9 h-11 font-mono rounded-xl"
                        placeholder="#ffffff"
                      />
                    </div>
                    <input
                      type="color"
                      value={formData.secondaryColor || "#ffffff"}
                      onChange={(e) => updateFormData({ secondaryColor: e.target.value })}
                      className="h-11 w-14 cursor-pointer rounded-xl border-2 border-border bg-transparent p-1 transition-transform active:scale-95"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Sugerencias para el Primario
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {SUGGESTED_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateFormData({ primaryColor: c.hex })}
                        className={cn(
                          "h-7 w-7 rounded-full border-2 transition-all hover:scale-125 active:scale-90 shadow-sm",
                          formData.primaryColor === c.hex
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent",
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
