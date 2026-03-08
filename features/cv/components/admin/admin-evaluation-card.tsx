"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, BarChart3, Calendar, Edit, Eye, MoreVertical, Sparkles, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { JobStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminEvaluationWithRelations } from "@/features/cv/actions/admin/get-admin-evaluations";
import { deleteAdminEvaluation } from "@/features/cv/actions/admin/delete-admin-evaluation";
import { routes } from "@/lib/routes";

const STATUS_CONFIG: Record<JobStatus, { label: string; colorClass: string }> = {
  PENDING: { label: "Pendiente", colorClass: "bg-yellow-500/10 text-yellow-600" },
  IN_PROGRESS: { label: "En progreso", colorClass: "bg-blue-500/10 text-blue-600" },
  SUCCEEDED: { label: "Exitosa", colorClass: "bg-green-500/10 text-green-600" },
  FAILED: { label: "Fallida", colorClass: "bg-destructive/10 text-destructive" },
  CANCELLED: { label: "Cancelada", colorClass: "bg-muted text-muted-foreground" },
};

interface AdminEvaluationCardProps {
  evaluation: AdminEvaluationWithRelations;
}

export function AdminEvaluationCard({ evaluation }: AdminEvaluationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const status = evaluation.status as JobStatus;
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const score = evaluation.overallScore;
  const cvTitle = evaluation.cv?.title || "CV Sin título";
  const user = evaluation.cv?.user;
  const userLabel = user ? `${user.name} · ${user.email}` : "Sin usuario";
  const isExcellent = score !== null && score !== undefined && score >= 80;
  const isWarning = score !== null && score !== undefined && score < 60;
  const isFailed = status === "FAILED" || status === "CANCELLED";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminEvaluation(evaluation.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      toast.error("Error al cancelar la evaluación");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <EntityListItem
        icon={
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black",
            isFailed ? "bg-destructive/10 text-destructive"
              : isExcellent ? "bg-primary/10 text-primary"
              : isWarning ? "bg-amber-500/10 text-amber-500"
              : "bg-blue-500/10 text-blue-500"
          )}>
            {isFailed ? <AlertCircle className="h-5 w-5" />
              : score !== null && score !== undefined ? Math.round(score)
              : <BarChart3 className="h-5 w-5" />}
          </div>
        }
        subtitle={
          <StatusBadge variant="outline" className={cn("text-xs font-semibold", statusConfig.colorClass)}>
            {statusConfig.label}
          </StatusBadge>
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">{cvTitle}</span>}
        metadata={
          <>
            <div className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /><span>{userLabel}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>Creada: {formatDate(evaluation.createdAt, "d MMM, yyyy")}</span></div>
            {score !== null && score !== undefined && (
              <div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /><span>Puntaje: {Math.round(score)}/100</span></div>
            )}
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.evaluations.detail(evaluation.id))} className="cursor-pointer font-medium">
                <Eye className="mr-2 h-4 w-4" /> Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(routes.app.admin.evaluations.edit(evaluation.id))} className="cursor-pointer font-medium">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium" disabled={status === "CANCELLED"}>
                <Trash2 className="mr-2 h-4 w-4" /> Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <Button variant="accent" onClick={() => router.push(routes.app.admin.evaluations.detail(evaluation.id))} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">
            Ver Evaluación
          </Button>
        }
      />
      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="¿Cancelar evaluación?"
        description={<>Esta evaluación será marcada como cancelada. El usuario no podrá acceder a sus resultados.</>}
      />
    </>
  );
}

