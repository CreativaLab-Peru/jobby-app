"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowLeft, Ban, Calendar, Clock, FileText,
  RefreshCw, Repeat, Timer, Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminJobDetail } from "@/features/jobs/actions/admin/get-admin-job-by-id";
import { deleteAdminJob } from "@/features/jobs/actions/admin/delete-admin-job";
import { retryAdminJob } from "@/features/jobs/actions/admin/retry-admin-job";
import { cancelAdminJob } from "@/features/jobs/actions/admin/cancel-admin-job";
import { routes } from "@/lib/routes";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Activity }> = {
  PENDING: { label: "Pendiente", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  IN_PROGRESS: { label: "En progreso", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: RefreshCw },
  SUCCEEDED: { label: "Exitoso", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: Activity },
  FAILED: { label: "Fallido", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: AlertTriangle },
  CANCELLED: { label: "Cancelado", color: "bg-muted text-muted-foreground border-border", icon: Ban },
};

interface AdminJobDetailScreenProps {
  job: AdminJobDetail;
}

export function AdminJobDetailScreen({ job }: AdminJobDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const router = useRouter();

  const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.PENDING;
  const canRetry = job.status === "FAILED" || job.status === "CANCELLED";
  const canCancel = job.status === "PENDING" || job.status === "IN_PROGRESS";
  const canDelete = job.status !== "IN_PROGRESS";

  const duration = job.startedAt && job.finishedAt
    ? Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
    : null;

  const waitTime = job.startedAt
    ? Math.round((new Date(job.startedAt).getTime() - new Date(job.createdAt).getTime()) / 1000)
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminJob(job.id);
    if (result.success) { toast.success(result.message); setShowDeleteDialog(false); router.push(routes.app.admin.jobs.root); }
    else { toast.error((result as { error: string }).error); }
    setIsDeleting(false);
  };

  const handleRetry = async () => {
    setIsActioning(true);
    const result = await retryAdminJob(job.id);
    result.success ? toast.success(result.message) : toast.error((result as { error: string }).error);
    setIsActioning(false);
    router.refresh();
  };

  const handleCancel = async () => {
    setIsActioning(true);
    const result = await cancelAdminJob(job.id);
    result.success ? toast.success(result.message) : toast.error((result as { error: string }).error);
    setIsActioning(false);
    router.refresh();
  };

  const stats = [
    { label: "Intentos", value: `${job.attempts}/${job.maxAttempts}`, icon: Repeat },
    { label: "Duracion", value: duration !== null ? `${duration}s` : "—", icon: Timer },
    { label: "Espera", value: waitTime !== null ? `${waitTime}s` : "—", icon: Clock },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button variant="ghost" onClick={() => router.push(routes.app.admin.jobs.root)} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Jobs
          </Button>

          <PageHeader
            title={job.type}
            description={`Job ID: ${job.jobId}`}
            actions={
              <div className="flex items-center gap-2">
                {canRetry && (
                  <Button variant="accent" onClick={handleRetry} disabled={isActioning} className="rounded-lg font-bold text-xs h-9 shadow-sm">
                    <Repeat className="mr-2 h-4 w-4" /> Reintentar
                  </Button>
                )}
                {canCancel && (
                  <Button variant="outline" onClick={handleCancel} disabled={isActioning} className="rounded-lg font-bold text-xs h-9 text-amber-600 border-amber-500/30">
                    <Ban className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                )}
                {canDelete && (
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="rounded-lg font-bold text-xs h-9">
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                )}
              </div>
            }
          />

          {/* Status + info card */}
          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge variant="outline" className={cn("text-xs", statusCfg.color)}>{statusCfg.label}</StatusBadge>
              <StatusBadge variant="outline" className="text-[10px] font-mono">{job.type}</StatusBadge>
              {job.lastError && <StatusBadge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20">Con error</StatusBadge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4 shrink-0" />
                <span>Tipo: <span className="font-mono font-medium text-foreground">{job.type}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Repeat className="h-4 w-4 shrink-0" />
                <span>Intentos: <span className="font-medium text-foreground">{job.attempts} / {job.maxAttempts}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Creado: <span className="font-medium text-foreground">{formatDate(job.createdAt, "d MMM, yyyy HH:mm:ss")}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Actualizado: <span className="font-medium text-foreground">{formatDate(job.updatedAt, "d MMM, yyyy HH:mm:ss")}</span></span>
              </div>
              {job.startedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Inicio: <span className="font-medium text-foreground">{formatDate(job.startedAt, "d MMM, yyyy HH:mm:ss")}</span></span>
                </div>
              )}
              {job.finishedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="h-4 w-4 shrink-0" />
                  <span>Fin: <span className="font-medium text-foreground">{formatDate(job.finishedAt, "d MMM, yyyy HH:mm:ss")}</span></span>
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
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

          {/* Error */}
          {job.lastError && (
            <Card className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold tracking-tight text-red-600">Error</h3>
              </div>
              <pre className="text-xs text-red-600/80 bg-red-500/10 rounded-lg p-3 overflow-auto max-h-40 whitespace-pre-wrap font-mono">{job.lastError}</pre>
            </Card>
          )}

          {/* Payload */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-3">Payload</h3>
            <pre className="text-xs bg-secondary/20 rounded-lg p-3 overflow-auto max-h-60 whitespace-pre-wrap font-mono">{JSON.stringify(job.payload, null, 2)}</pre>
          </Card>

          {/* Linked CV */}
          {job.cv && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">CV vinculado</h3>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-foreground">{job.cv.title || "Sin titulo"}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{job.cv.opportunityType}</span>
                    {job.cv.cvType && <span>{job.cv.cvType}</span>}
                    <span>Creado: {formatDate(job.cv.createdAt, "d MMM, yyyy")}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => router.push(routes.app.admin.cv.detail(job.cv!.id))}>
                  <FileText className="mr-1.5 h-3.5 w-3.5" /> Ver CV
                </Button>
              </div>
            </Card>
          )}

          {/* Additional info */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Informacion adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">ID (DB):</span> <span className="ml-2 font-mono text-xs text-foreground">{job.id}</span></div>
              <div><span className="text-muted-foreground">Job ID:</span> <span className="ml-2 font-mono text-xs text-foreground">{job.jobId}</span></div>
              {job.cvId && <div><span className="text-muted-foreground">CV ID:</span> <span className="ml-2 font-mono text-xs text-foreground">{job.cvId}</span></div>}
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar job" description={<>Se eliminara permanentemente el job <strong className="font-mono">{job.jobId.slice(0, 20)}...</strong>.</>} />
    </main>
  );
}

