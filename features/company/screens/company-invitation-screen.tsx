"use client";

import {useEffect, useState} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  Plus, RefreshCcw,
  ShieldCheck,
  X
} from "lucide-react";
import {toast} from "sonner";
import {motion, AnimatePresence} from "framer-motion";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {PageHeader} from "@/components/shared/page-header";
import {EmptyPlaceholder} from "@/components/shared/empty-placeholder";
import {routes} from "@/lib/routes";
import {useInvitationModal} from "@/features/company/hooks/use-invitation-modal";
import {CompanyInvitationModal} from "@/features/company/components/company-invitation-modal";
import {
  regenerateCompanyInvitationAction
} from "@/features/company/actions/admin/regenerate-company-invitation.action";

interface InvitationListItem {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expiresAt: string;
}

interface CompanyInvitationScreenProps {
  companyId: string;
  companyName: string;
  invitations: InvitationListItem[];
  totalCount: number;
  currentPage: number;
  initialError?: string | null;
}

export function CompanyInvitationScreen({
                                          companyId,
                                          companyName,
                                          invitations,
                                          totalCount,
                                          currentPage,
                                          initialError
                                        }: CompanyInvitationScreenProps) {
  const {onOpen: openInvitationModal} = useInvitationModal();
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  useEffect(() => {
    if (initialError) toast.error(initialError);
  }, [initialError]);

  const copyToClipboard = (token: string, silent = false) => {
    const url = `${window.location.origin}${routes.website.joinInvitation(token)}`;
    navigator.clipboard.writeText(url);
    if (!silent) toast.success("Enlace copiado al portapapeles");
  };

  const handleRegenerate = async (id: string) => {
    setIsRegenerating(id);
    const result = await regenerateCompanyInvitationAction(id);

    if (result.success && result.newToken) {
      copyToClipboard(result.newToken);
      toast.success("Link regenerado y copiado al portapapeles", {
        description: "El código de acceso también ha cambiado.",
      });
    } else {
      toast.error(result.error || "Error al regenerar");
    }
    setIsRegenerating(null);
  };

  return (
    <>
      <main className="min-h-[90vh] p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <PageHeader
            title={`Invitaciones: ${companyName}`}
            description="Gestiona y monitorea los accesos enviados a futuros miembros."
            actions={
              <Button
                variant="accent"
                className="rounded-lg font-bold text-xs h-9 shadow-sm"
                onClick={() => openInvitationModal(companyName)} // Asumiendo que el modal ya sabe el contextId o se lo pasas
              >
                <Plus className="mr-2 h-4 w-4"/> Crear Invitación
              </Button>
            }
          />

          {invitations.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {invitations.map((invite, index) => {
                  const isExpired = new Date(invite.expiresAt) < new Date();
                  const displayStatus = isExpired ? "EXPIRED" : invite.status;

                  return (
                    <motion.div
                      key={invite.id}
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: index * 0.05}}
                    >
                      <Card
                        className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden p-4">
                        <div
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                              <Mail className="h-5 w-5"/>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-foreground">{invite.email}</p>
                                <StatusBadge status={displayStatus}/>
                              </div>
                              <div
                                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <ShieldCheck className="h-3 w-3"/>
                                  <span className="capitalize">{invite.role.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3"/>
                                  <span>
                                  Expira: {new Date(invite.expiresAt).toLocaleDateString("es-PE", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                  })}
                                </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {invite.status !== "ACCEPTED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegenerate(invite.id)}
                                disabled={isRegenerating === invite.id}
                                className="h-8 gap-2 rounded-lg text-[11px] font-bold border-primary/20 hover:bg-primary/5 text-primary"
                                title="Genera un nuevo link y código sin enviar correo"
                              >
                                {isRegenerating === invite.id ? (
                                  <RefreshCcw className="h-3.5 w-3.5 animate-spin"/>
                                ) : (
                                  <RefreshCcw className="h-3.5 w-3.5"/>
                                )}
                                REGENERAR LINK
                              </Button>
                            )}

                            {/* Botón normal de copiar link */}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => copyToClipboard(invite.token)}
                              disabled={isExpired || invite.status !== "PENDING"}
                              className="h-8 gap-2 rounded-lg text-[11px] font-bold"
                            >
                              <Copy className="h-3.5 w-3.5"/>
                              COPIAR ACTUAL
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Footer de info rápida */}
              <div
                className="flex items-center justify-between px-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                <span>Total: {totalCount} invitaciones</span>
                <span>Página {currentPage}</span>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 py-12">
              <EmptyPlaceholder
                icon={Mail}
                title="No hay invitaciones"
                description="Aún no has enviado invitaciones para esta empresa."
                action={
                  <Button variant="default" onClick={() => openInvitationModal(companyId)}
                          className="rounded-lg font-bold">
                    <Plus className="mr-2 h-4 w-4"/> Enviar primera invitación
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </main>
      <CompanyInvitationModal/>
    </>
  );
}

function StatusBadge({status}: { status: string }) {
  const configs: Record<string, { label: string; className: string; icon: any }> = {
    PENDING: {
      label: "PENDIENTE",
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      icon: Clock
    },
    ACCEPTED: {
      label: "ACEPTADA",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: CheckCircle2
    },
    EXPIRED: {
      label: "VENCIDA",
      className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      icon: AlertCircle
    },
    CANCELLED: {
      label: "CANCELADA",
      className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      icon: X
    },
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant="outline"
           className={`gap-1 px-1.5 py-0 border text-[10px] font-bold ${config.className}`}>
      <Icon className="h-3 w-3"/>
      {config.label}
    </Badge>
  );
}
