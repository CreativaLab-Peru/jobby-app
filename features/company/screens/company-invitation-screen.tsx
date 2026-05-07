"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { routes } from "@/lib/routes";

interface InvitationListItem {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expiresAt: string;
}

interface CompanyInvitationScreenProps {
  invitations: InvitationListItem[];
}

export function CompanyInvitationScreen({ invitations }: CompanyInvitationScreenProps) {

  const copyToClipboard = (token: string) => {
    // Ajusta según la estructura real de tus rutas
    const url = `${window.location.origin}${routes.website.joinInvitation(token)}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-10">
      <Card className="mx-auto max-w-4xl shadow-sm">
        <CardHeader>
          <CardTitle>Invitaciones</CardTitle>
          <CardDescription>Gestiona el acceso de los miembros.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {invitations.length > 0 ? (
            invitations.map((invite) => {
              const isExpired = new Date(invite.expiresAt) < new Date();
              const displayStatus = isExpired ? "EXPIRED" : invite.status;

              return (
                <div
                  key={invite.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="font-semibold leading-none">{invite.email}</p>
                    <p className="text-sm text-muted-foreground">{invite.role}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Expira: {new Date(invite.expiresAt).toLocaleString("es-PE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                    <StatusBadge status={displayStatus} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(invite.token)}
                      disabled={isExpired || invite.status !== "PENDING"}
                      className="h-8 gap-2"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copiar Link
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay invitaciones registradas.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; variant: "secondary" | "destructive" | "default"; icon: any }> = {
    PENDING: { label: "Pendiente", variant: "secondary", icon: Clock },
    ACCEPTED: { label: "Aceptada", variant: "default", icon: CheckCircle2 },
    EXPIRED: { label: "Vencida", variant: "destructive", icon: AlertCircle },
    CANCELLED: { label: "Cancelada", variant: "destructive", icon: AlertCircle },
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-0.5">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
