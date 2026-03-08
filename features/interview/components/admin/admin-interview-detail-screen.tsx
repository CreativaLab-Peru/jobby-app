"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Briefcase, Calendar, Eye, FileText, MessageSquare,
  Mic, Shield, Target, Trash2, User as UserIcon, Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminInterviewDetail } from "@/features/interview/actions/admin/get-admin-interview-by-id";
import { deleteAdminInterview } from "@/features/interview/actions/admin/delete-admin-interview";
import { routes } from "@/lib/routes";

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completada",
  PENDING: "Pendiente",
  FAILED: "Fallida",
};

function scoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number | null): string {
  if (score === null) return "bg-muted";
  if (score >= 70) return "bg-green-500/10";
  if (score >= 40) return "bg-amber-500/10";
  return "bg-red-500/10";
}

interface AdminInterviewDetailScreenProps {
  interview: AdminInterviewDetail;
}

export function AdminInterviewDetailScreen({ interview }: AdminInterviewDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const statusStyle = STATUS_STYLES[interview.status] || STATUS_STYLES.PENDING;
  const statusLabel = STATUS_LABELS[interview.status] || interview.status;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminInterview(interview.id);
    if (result.success) { toast.success(result.message); setShowDeleteDialog(false); router.push(routes.app.admin.interviews.root); }
    else { toast.error((result as { error: string }).error); }
    setIsDeleting(false);
  };

  const kpis = [
    { label: "Score General", value: interview.overallScore, icon: Target },
    { label: "Confianza", value: interview.confidence, icon: Shield },
    { label: "Claridad", value: interview.clarity, icon: Eye },
    { label: "Alineacion", value: interview.alignment, icon: Zap },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.interviews.root)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Entrevistas
          </Button>

          <PageHeader
            title={interview.opportunity.title}
            description={`Entrevista de ${interview.user.name} · ${formatDate(interview.createdAt, "d MMMM, yyyy HH:mm")}`}
            actions={
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="rounded-lg font-bold text-xs h-9">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </Button>
            }
          />

          {/* Status + info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline" className={cn("text-xs", statusStyle)}>{statusLabel}</StatusBadge>
              <StatusBadge variant="outline" className="text-[10px]">{interview.opportunity.type}</StatusBadge>
              {interview.opportunity.company && (
                <StatusBadge variant="outline" className="text-[10px]">{interview.opportunity.company}</StatusBadge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>Usuario: <span className="font-medium text-foreground">{interview.user.name}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span>Oportunidad: <span className="font-medium text-foreground">{interview.opportunity.title}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0" />
                <span>CV: <span className="font-medium text-foreground">{interview.cv.title || "Sin titulo"}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Fecha: <span className="font-medium text-foreground">{formatDate(interview.createdAt, "d MMM, yyyy HH:mm")}</span></span>
              </div>
              {interview.vapiCallId && (
                <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                  <Mic className="h-4 w-4 shrink-0" />
                  <span>Vapi Call ID: <span className="font-mono text-xs text-foreground">{interview.vapiCallId}</span></span>
                </div>
              )}
            </div>
          </Card>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="rounded-xl border border-border/60 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", scoreBg(value))}>
                    <Icon className={cn("h-5 w-5", scoreColor(value))} />
                  </div>
                </div>
                <div className={cn("text-2xl font-black", scoreColor(value))}>
                  {value !== null ? `${value}` : "—"}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </Card>
            ))}
          </div>

          {/* Feedback */}
          {interview.feedback && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold tracking-tight">Feedback</h3>
              </div>
              <div className="rounded-lg border border-border/40 bg-secondary/10 p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{interview.feedback}</p>
              </div>
            </Card>
          )}

          {/* Transcript */}
          {interview.transcript && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold tracking-tight">Transcripcion</h3>
              </div>
              <pre className="text-xs bg-secondary/20 rounded-lg p-3 overflow-auto max-h-80 whitespace-pre-wrap font-mono">
                {JSON.stringify(interview.transcript, null, 2)}
              </pre>
            </Card>
          )}

          {/* Linked User */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Usuario</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {interview.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{interview.user.name}</span>
                  <StatusBadge variant="outline" className="text-[10px]">{interview.user.role}</StatusBadge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>{interview.user.email}</span>
                  <span>·</span>
                  <span>Registrado el {formatDate(interview.user.createdAt, "d MMM, yyyy")}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => router.push(`/admin/users/${interview.user.id}`)}>
                <UserIcon className="mr-1.5 h-3.5 w-3.5" /> Ver usuario
              </Button>
            </div>
          </Card>

          {/* Linked Opportunity & CV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Oportunidad</h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground">{interview.opportunity.title}</p>
                {interview.opportunity.company && <p className="text-muted-foreground">Empresa: {interview.opportunity.company}</p>}
                {interview.opportunity.location && <p className="text-muted-foreground">Ubicacion: {interview.opportunity.location}</p>}
                {interview.opportunity.modality && <p className="text-muted-foreground">Modalidad: {interview.opportunity.modality}</p>}
                <p className="text-muted-foreground">Match: <span className="font-semibold text-foreground">{Number(interview.opportunity.match).toFixed(1)}%</span></p>
              </div>
            </Card>
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">CV vinculado</h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground">{interview.cv.title || "Sin titulo"}</p>
                <p className="text-muted-foreground">Tipo: {interview.cv.opportunityType}</p>
                {interview.cv.cvType && <p className="text-muted-foreground">Categoria: {interview.cv.cvType}</p>}
                <p className="text-muted-foreground">Creado: {formatDate(interview.cv.createdAt, "d MMM, yyyy")}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg text-xs mt-3" onClick={() => router.push(routes.app.admin.cv.detail(interview.cv.id))}>
                <FileText className="mr-1.5 h-3.5 w-3.5" /> Ver CV
              </Button>
            </Card>
          </div>

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">ID Sesion:</span> <span className="ml-2 font-mono text-xs text-foreground">{interview.id}</span></div>
              <div><span className="text-muted-foreground">ID Usuario:</span> <span className="ml-2 font-mono text-xs text-foreground">{interview.userId}</span></div>
              <div><span className="text-muted-foreground">ID CV:</span> <span className="ml-2 font-mono text-xs text-foreground">{interview.cvId}</span></div>
              <div><span className="text-muted-foreground">ID Oportunidad:</span> <span className="ml-2 font-mono text-xs text-foreground">{interview.opportunityId}</span></div>
              {interview.vapiCallId && <div className="md:col-span-2"><span className="text-muted-foreground">Vapi Call ID:</span> <span className="ml-2 font-mono text-xs text-foreground">{interview.vapiCallId}</span></div>}
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar entrevista" description={<>Se eliminara la entrevista de <strong>{interview.user.name}</strong> para <strong>{interview.opportunity.title}</strong>.</>} />
    </main>
  );
}

