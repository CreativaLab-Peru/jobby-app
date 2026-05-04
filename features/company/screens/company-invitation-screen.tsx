"use client";

import { useActionState } from "react";
import { MailPlus, Loader2, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  createCompanyInvitationAction,
  type CreateCompanyInvitationState,
} from "@/features/company/actions/create-company-invitation.action";

interface InvitationListItem {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

interface CompanyInvitationScreenProps {
  companyId: string;
  companyName: string;
  companySlug: string;
  invitations: InvitationListItem[];
}

const initialState: CreateCompanyInvitationState = {
  success: false,
  error: "",
};

const statusLabel: Record<string, { label: string; tone: "default" | "secondary" | "destructive" }> = {
  PENDING: { label: "Pendiente", tone: "secondary" },
  ACCEPTED: { label: "Aceptada", tone: "default" },
  EXPIRED: { label: "Expirada", tone: "destructive" },
  CANCELLED: { label: "Cancelada", tone: "destructive" },
};

export function CompanyInvitationScreen({
  companyId,
  companyName,
  companySlug,
  invitations,
}: CompanyInvitationScreenProps) {
  const [state, formAction, isPending] = useActionState(createCompanyInvitationAction, initialState);
  const fieldErrors = "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <MailPlus data-icon="inline-start" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                Invitaciones B2B
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                Invitar miembros a {companyName}
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Administra el acceso al equipo desde un solo lugar. Cada invitación genera un código
            de 6 dígitos y expira automáticamente en 48 horas.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link2 data-icon="inline-start" />
            <span>Empresa: /empresas/{companySlug}</span>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Nueva invitación</CardTitle>
              <CardDescription>
                Define el correo y el rol que tendrá el miembro dentro de la empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="flex flex-col gap-5">
                <input type="hidden" name="companyId" value={companyId} />

                <FieldGroup>
                  <Field data-invalid={Boolean(fieldErrors?.email)}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="colaborador@empresa.com"
                      disabled={isPending}
                      aria-invalid={Boolean(fieldErrors?.email)}
                    />
                    <FieldDescription>
                      El código llegará a este correo y deberá coincidir al aceptar la invitación.
                    </FieldDescription>
                    <FieldError errors={fieldErrors?.email ? [{ message: fieldErrors.email }] : undefined} />
                  </Field>

                  <Field data-invalid={Boolean(fieldErrors?.role)}>
                    <FieldLabel htmlFor="role">Rol</FieldLabel>
                    <select
                      id="role"
                      name="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="MIEMBRO"
                      disabled={isPending}
                      aria-invalid={Boolean(fieldErrors?.role)}
                    >
                      <option value="MIEMBRO">Miembro</option>
                      <option value="SUB_ENCARGADO">Sub encargado</option>
                      <option value="ENCARGADO">Encargado</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <FieldDescription>
                      En MVP dejamos libertad total al admin; el RBAC fino lo reforzamos en la siguiente iteración.
                    </FieldDescription>
                    <FieldError errors={fieldErrors?.role ? [{ message: fieldErrors.role }] : undefined} />
                  </Field>
                </FieldGroup>

                {state.success === false && state.error ? (
                  <p className="text-destructive text-sm font-medium">{state.error}</p>
                ) : null}
                {state.success ? <p className="text-primary text-sm font-medium">{state.message}</p> : null}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MailPlus data-icon="inline-start" />
                      Crear invitación
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Invitaciones recientes</CardTitle>
              <CardDescription>
                Estado actual de las invitaciones de la empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {invitations.length > 0 ? (
                invitations.map((invite, index) => {
                  const status = statusLabel[invite.status] ?? statusLabel.PENDING;
                  return (
                    <div key={invite.id}>
                      {index > 0 ? <Separator className="mb-4" /> : null}
                      <div className="flex flex-col gap-3 rounded-2xl border bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{invite.email}</p>
                          <p className="text-muted-foreground text-sm">Rol: {invite.role}</p>
                          <p className="text-muted-foreground text-xs">
                            Expira: {new Date(invite.expiresAt).toLocaleString("es-PE", {
                              timeZone: "America/Lima",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                        <Badge variant={status.tone}>{status.label}</Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
                  Todavía no se han enviado invitaciones para esta empresa.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

