"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, Ban, Clock, Eye, MoreVertical, RefreshCw, Repeat, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
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

interface AdminJobCardProps {
  job: AdminJobItem;
}

export function AdminJobCard({ job }: AdminJobCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const router = useRouter();

  const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const canRetry = job.status === "FAILED" || job.status === "CANCELLED";
  const canCancel = job.status === "PENDING" || job.status === "IN_PROGRESS";
  const canDelete = job.status !== "IN_PROGRESS";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminJob(job.id);
    if (result.success) { toast.success(result.message); setShowDeleteDialog(false); router.refresh(); }
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

  return (
    <>
      <EntityListItem
        icon={
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", statusCfg.color.split(" ").slice(0, 1).join(" "))}>
            <StatusIcon className={cn("h-5 w-5", statusCfg.color.split(" ").slice(1, 2).join(" "))} />
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant="outline" className={cn("text-[10px]", statusCfg.color)}>{statusCfg.label}</StatusBadge>
            {job.lastError && <StatusBadge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20">Error</StatusBadge>}
          </div>
        }
        title={<span className="text-sm font-bold tracking-tight text-foreground font-mono">{job.type}</span>}
        metadata={
          <>
            <span className="font-mono text-[10px]">{job.jobId.slice(0, 20)}...</span>
            <span>{job.attempts}/{job.maxAttempts} intentos</span>
            <span>{formatDate(job.createdAt, "d MMM HH:mm")}</span>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.jobs.detail(job.id))} className="cursor-pointer font-medium"><Eye className="mr-2 h-4 w-4" /> Ver detalle</DropdownMenuItem>
              {canRetry && <DropdownMenuItem onClick={handleRetry} disabled={isActioning} className="cursor-pointer font-medium"><Repeat className="mr-2 h-4 w-4" /> Reintentar</DropdownMenuItem>}
              {canCancel && <DropdownMenuItem onClick={handleCancel} disabled={isActioning} className="cursor-pointer font-medium text-amber-600"><Ban className="mr-2 h-4 w-4" /> Cancelar</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} disabled={!canDelete} className="cursor-pointer text-destructive focus:text-destructive font-medium"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <Button variant="accent" onClick={() => router.push(routes.app.admin.jobs.detail(job.id))} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">Ver Job</Button>
        }
      />
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar job" description={<>Se eliminara permanentemente el job <strong className="font-mono">{job.jobId.slice(0, 20)}...</strong>.</>} />
    </>
  );
}

