"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { createCountryAction, type CreateCountryFormState } from "@/features/scholarships/actions/admin/create-country";
import { updateCountryAction } from "@/features/scholarships/actions/admin/update-country";

const initialState: CreateCountryFormState = { success: false };

interface AdminCountryFormProps {
  country?: {
    id: string;
    name: string;
    code: string;
    flag: string;
  };
}

export function AdminCountryForm({ country }: AdminCountryFormProps) {
  const action = country?.id
    ? (prevState: any, formData: FormData) =>
        updateCountryAction(country.id, prevState, formData)
    : createCountryAction;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  const [name, setName] = useState(country?.name || "");
  const [code, setCode] = useState(country?.code || "");
  const [flag, setFlag] = useState(country?.flag || "");

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || (country ? "País actualizado" : "País creado"));
      router.push("/admin/countries");
      router.refresh();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router, country]);

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold">
          {country ? "Editar País" : "Nuevo País"}
        </h1>
        <p className="text-muted-foreground">
          {country
            ? `Editando información de ${country.name}`
            : "Registra un nuevo país para las becas"}
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        {country?.id && <input type="hidden" name="id" value={country.id} />}

        <Card className="p-6 border-border/60 bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del país</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Reino Unido"
              />
              {state.fieldErrors?.name && (
                <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej. UK"
                maxLength={3}
                className="font-mono"
              />
              {state.fieldErrors?.code && (
                <p className="text-xs text-destructive">{state.fieldErrors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="flag">Bandera (emoji o URL)</Label>
              <Input
                id="flag"
                name="flag"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="Ej. 🇬🇧 o https://..."
              />
              {state.fieldErrors?.flag && (
                <p className="text-xs text-destructive">{state.fieldErrors.flag}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 border-border/60 bg-card/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Vista previa
          </h3>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/100 bg-background/50">
            <span className="text-4xl">{flag || "🏳️"}</span>
            <div>
              <p className="font-bold text-lg">{name || "Nombre del país"}</p>
              <p className="text-sm text-muted-foreground font-mono">{code || "Código"}</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
          >
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
                {country ? "Guardar cambios" : "Crear País"}
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}