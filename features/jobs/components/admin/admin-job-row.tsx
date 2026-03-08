"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, Ban, Calendar, Clock, Eye, FileText, MoreVertical, RefreshCw, Repeat, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminJobItem } from "@/features/jobs/actions/admin/get-admin-jobs";
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

interface AdminJobRowProps {
  job: AdminJobItem;
}

export function AdminJobRow({ job }: AdminJobRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const router = useRouter();

  const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const canRetry = job.status === "FAILED" || job.status === "CANCELLED";
  const canCancel = job.status === "PENDING" || job.status === "IN_PROGRESS";
  const canDelete = job.status !== "IN_PROGRESS";

  const duration = job.startedAt && job.finishedAt
    ? Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminJob(job.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      toast.error((result as { error: string }).error);
    }
    setIsDeleting(false);
  };

  const handleRetry = async () => {
    setIsActioning(true);
    const result = await retryAdminJob(job.id);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error((result as { error: string }).error);
    }
    setIsActioning(false);
  };

  const handleCancel = async () => {
    setIsActioning(true);
    const result = await cancelAdminJob(job.id);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error((result as { error: string }).error);
    }
    setIsActioning(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", statusCfg.color.split(" ").slice(0, 1).join(" "))}>
            <StatusIcon className={cn("h-5 w-5", statusCfg.color.split(" ").slice(1, 2).join(" "))} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate font-mono">{job.type}</span>
              <StatusBadge variant="outline" className={cn("text-[10px]", statusCfg.color)}>{statusCfg.label}</StatusBadge>
              {job.lastError && (
                <StatusBadge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20">Error</StatusBadge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono text-[10px]">{job.jobId.slice(0, 24)}...</span>
              <span>{job.attempts}/{job.maxAttempts} intentos</span>
              {duration !== null && <span>{duration}s duracion</span>}
              {job.cv && <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span className="truncate max-w-[120px]">{job.cv.title || "Sin titulo"}</span></div>}
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(job.createdAt, "d MMM, yyyy HH:mm")}</span></div>
            </div>
            {job.lastError && (
              <p className="text-[10px] text-red-500 line-clamp-1 mt-0.5 font-mono">{job.lastError}</p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.jobs.detail(job.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.jobs.detail(job.id))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
                </DropdownMenuItem>
                {canRetry && (
                  <DropdownMenuItem onClick={handleRetry} disabled={isActioning} className="cursor-pointer font-medium">
                    <Repeat className="mr-2 h-4 w-4" /> Reintentar
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <DropdownMenuItem onClick={handleCancel} disabled={isActioning} className="cursor-pointer font-medium text-amber-600 focus:text-amber-600">
                    <Ban className="mr-2 h-4 w-4" /> Cancelar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} disabled={!canDelete} className="cursor-pointer text-destructive focus:text-destructive font-medium">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar job" description={<>Se eliminara permanentemente el job <strong className="font-mono">{job.jobId.slice(0, 20)}...</strong>.</>} />
    </>
  );
}

