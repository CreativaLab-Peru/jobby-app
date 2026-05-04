"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Palette, Globe, Fingerprint, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Paleta de colores sugeridos (profesionales y vibrantes)
const SUGGESTED_COLORS = [
  { name: "Slate", hex: "#0f172a" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Violet", hex: "#8b5cf6" },
];

export function AdminCompanyForm({ company }: { company?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estados del formulario
  const [name, setName] = useState(company?.name || "");
  const [slug, setSlug] = useState(company?.slug || "");
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || "");
  const [ruc, setRuc] = useState(company?.ruc || "");
  const [website, setWebsite] = useState(company?.website || "");
  const [primaryColor, setPrimaryColor] = useState(company?.primaryColor || "#4f46e5");
  const [isActive, setIsActive] = useState(company?.isActive ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // ... (Tu lógica de submit se mantiene igual)
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Levely HQ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="flex items-center gap-2">
                  <LinkIcon className="h-3 w-3" /> Slug
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
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
                  <Input id="ruc" value={ruc} onChange={(e) => setRuc(e.target.value)} placeholder="20..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Web</Label>
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
              </div>
            </Card>
          </div>
        </div>

        {/* Sección: Identidad Visual (Branding) */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Color de Marca</Label>
            <Card className="p-4 space-y-6 border-border/60 bg-card/50">

              {/* Preview Dinámico */}
              <div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-border/100 bg-background/50">
                <div
                  className="h-12 w-12 rounded-lg shadow-inner transition-colors duration-300"
                  style={{ backgroundColor: primaryColor }}
                />
                <div>
                  <p className="text-sm font-bold" style={{ color: primaryColor }}>{name || "Nombre Empresa"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">{primaryColor}</p>
                </div>
              </div>

              {/* Selector y Hex */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
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

                {/* Sugerencias */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Sugerencias</p>
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
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Estado */}
          {company && (
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-accent/5 p-4">
              <div className="space-y-0.5">
                <Label className="font-bold">Empresa Activa</Label>
                <p className="text-xs text-muted-foreground">Permitir que la empresa sea visible</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="font-semibold"
        >
          Descartar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          variant="accent"
          className="min-w-[140px] rounded-xl font-bold shadow-md transition-all active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {company ? "Guardar cambios" : "Crear Empresa"}
        </Button>
      </div>
    </form>
  );
}
