"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Edit,
  ExternalLink,
  MapPin,
  MessageSquare,
  Sparkles,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import { AdminOpportunityDetail } from "@/features/opportunities/actions/admin/get-admin-opportunity-by-id";
import { deleteAdminOpportunity } from "@/features/opportunities/actions/admin/delete-admin-opportunity";
import { routes } from "@/lib/routes";

interface AdminOpportunityDetailScreenProps {
  opportunity: AdminOpportunityDetail;
}

export function AdminOpportunityDetailScreen({ opportunity }: AdminOpportunityDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const typeLabel = OPPORTUNITY_CONFIG[opportunity.type] || opportunity.type;
  const matchPercent = opportunity.match ? Number(opportunity.match) : 0;
  const user = opportunity.cv?.user;
  const userLabel = user ? `${user.name} (${user.email})` : "Sin usuario";
  const cvTitle = opportunity.cv?.title || "CV Sin titulo";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminOpportunity(opportunity.id, opportunity.cvId);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.push(routes.app.admin.opportunities.root);
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando oportunidad";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  const stats = [
    { label: "Match", value: `${Math.round(matchPercent)}%`, icon: Sparkles },
    { label: "Entrevistas", value: opportunity.interviewSessions.length, icon: MessageSquare },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.opportunities.root)}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Oportunidades
          </Button>

          <PageHeader
            title={opportunity.title}
            description={`${typeLabel} · ${opportunity.company || "Sin empresa"}`}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="accent"
                  onClick={() => router.push(routes.app.admin.opportunities.edit(opportunity.id, opportunity.cvId))}
                  className="rounded-lg font-bold text-xs h-9 shadow-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="rounded-lg font-bold text-xs h-9"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            }
          />

          {/* Main info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline">{typeLabel}</StatusBadge>
              {opportunity.modality && <StatusBadge variant="outline">{opportunity.modality}</StatusBadge>}
              {opportunity.salary && <StatusBadge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{opportunity.salary}</StatusBadge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>Usuario: <span className="font-medium text-foreground">{userLabel}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>CV: <span className="font-medium text-foreground">{cvTitle}</span></span>
              </div>
              {opportunity.company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>Empresa: <span className="font-medium text-foreground">{opportunity.company}</span></span>
                </div>
              )}
              {opportunity.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>Ubicacion: <span className="font-medium text-foreground">{opportunity.location}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Creada: <span className="font-medium text-foreground">{formatDate(opportunity.createdAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
              {opportunity.deadline && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Cierre: <span className="font-medium text-foreground">{formatDate(opportunity.deadline, "d MMM, yyyy")}</span></span>
                </div>
              )}
            </div>

            {opportunity.linkUrl && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={opportunity.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate">
                  {opportunity.linkUrl}
                </a>
              </div>
            )}
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="rounded-xl border border-border/60 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-black text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Description */}
          {opportunity.description && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-3">Descripcion</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
            </Card>
          )}

          {/* Requirements */}
          {opportunity.requirements && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-3">Requisitos</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.requirements}</p>
            </Card>
          )}

          {/* Benefits */}
          {opportunity.benefits && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-3">Beneficios</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.benefits}</p>
            </Card>
          )}

          {/* Interview Sessions */}
          {opportunity.interviewSessions.length > 0 && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-4">Entrevistas ({opportunity.interviewSessions.length})</h3>
              <div className="space-y-3">
                {opportunity.interviewSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                      session.overallScore && session.overallScore >= 70 ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                    )}>
                      {session.overallScore ?? "-"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <StatusBadge variant="outline" className="text-[10px]">{session.status}</StatusBadge>
                      {session.overallScore !== null && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Puntaje: {session.overallScore}/100
                          {session.confidence !== null && ` · Confianza: ${session.confidence}%`}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(session.createdAt, "d MMM, yyyy")}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{opportunity.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">CV ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{opportunity.cvId}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar oportunidad"
        description={<>Se eliminara permanentemente la oportunidad <strong>{opportunity.title}</strong> y todas sus entrevistas asociadas.</>}
      />
    </main>
  );
}

