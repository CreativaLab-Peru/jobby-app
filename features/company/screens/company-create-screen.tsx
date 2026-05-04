"use client";

import { useActionState } from "react";
import { Building2, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createCompanyAction, type CompanyCreateFormState } from "@/features/company/actions/create-company.action";
import { CompanyLinkCard } from "@/features/company/components/company-link-card";

const initialState: CompanyCreateFormState = {
  success: false,
};

export function CompanyCreateScreen() {
  const [state, formAction, isPending] = useActionState(createCompanyAction, initialState);
  const companyLink = state.company?.joinUrl;

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Building2 data-icon="inline-start" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                Levely Business
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                Crear empresa y copiar enlace
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Este es el primer paso del flujo B2B. Crea la empresa con sus campos básicos, guarda la
            configuración inicial y comparte el enlace de acceso en un clic.
          </p>
        </section>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Datos de la empresa</CardTitle>
            <CardDescription>
              Completa primero lo esencial. Los campos opcionales ayudan a personalizar la experiencia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="flex flex-col gap-8">
              <FieldGroup>
                <Field data-invalid={Boolean(state.fieldErrors?.name)}>
                  <FieldLabel htmlFor="name">Nombre de la empresa</FieldLabel>
                  <Input id="name" name="name" placeholder="Levely Business" disabled={isPending} aria-invalid={Boolean(state.fieldErrors?.name)} />
                  <FieldDescription>Será el nombre visible para administradores y miembros.</FieldDescription>
                  <FieldError errors={state.fieldErrors?.name ? [{ message: state.fieldErrors.name }] : undefined} />
                </Field>

                <Field data-invalid={Boolean(state.fieldErrors?.slug)}>
                  <FieldLabel htmlFor="slug">Slug público</FieldLabel>
                  <Input id="slug" name="slug" placeholder="levely-business" disabled={isPending} aria-invalid={Boolean(state.fieldErrors?.slug)} />
                  <FieldDescription>
                    Opcional. Si lo dejas vacío, lo generamos automáticamente desde el nombre.
                  </FieldDescription>
                  <FieldError errors={state.fieldErrors?.slug ? [{ message: state.fieldErrors.slug }] : undefined} />
                </Field>
              </FieldGroup>

              <FieldSet className="gap-4 rounded-2xl border p-4">
                <FieldLegend className="mb-0">Campos opcionales</FieldLegend>
                <p className="text-muted-foreground text-sm">
                  Definidos en el modelo `Company` para completar la ficha inicial.
                </p>

                <FieldGroup>
                  <Field data-invalid={Boolean(state.fieldErrors?.logoUrl)}>
                    <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>
                    <Input id="logoUrl" name="logoUrl" placeholder="https://..." disabled={isPending} aria-invalid={Boolean(state.fieldErrors?.logoUrl)} />
                    <FieldError errors={state.fieldErrors?.logoUrl ? [{ message: state.fieldErrors.logoUrl }] : undefined} />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field data-invalid={Boolean(state.fieldErrors?.ruc)}>
                      <FieldLabel htmlFor="ruc">RUC</FieldLabel>
                      <Input id="ruc" name="ruc" placeholder="20123456789" disabled={isPending} aria-invalid={Boolean(state.fieldErrors?.ruc)} />
                      <FieldError errors={state.fieldErrors?.ruc ? [{ message: state.fieldErrors.ruc }] : undefined} />
                    </Field>

                    <Field data-invalid={Boolean(state.fieldErrors?.primaryColor)}>
                      <FieldLabel htmlFor="primaryColor">Color principal</FieldLabel>
                      <Input id="primaryColor" name="primaryColor" placeholder="#1D9E75" disabled={isPending} aria-invalid={Boolean(state.fieldErrors?.primaryColor)} />
                      <FieldError errors={state.fieldErrors?.primaryColor ? [{ message: state.fieldErrors.primaryColor }] : undefined} />
                    </Field>
                  </div>

                  <Field data-invalid={Boolean(state.fieldErrors?.website)}>
                    <FieldLabel htmlFor="website">Sitio web</FieldLabel>
                    <Input id="website" name="website" placeholder="https://empresa.com" disabled={isPending} aria-invalid={Boolean(state.fieldErrors?.website)} />
                    <FieldError errors={state.fieldErrors?.website ? [{ message: state.fieldErrors.website }] : undefined} />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Separator />

              {state.message ? (
                <p className={state.success ? "text-primary text-sm font-medium" : "text-destructive text-sm font-medium"}>
                  {state.message}
                </p>
              ) : null}

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-end">
                <Button type="submit" disabled={isPending} className="sm:min-w-44">
                  {isPending ? (
                    <>
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Sparkles data-icon="inline-start" />
                      Crear empresa
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {companyLink ? <CompanyLinkCard joinUrl={companyLink} /> : null}
      </div>
    </main>
  );
}

