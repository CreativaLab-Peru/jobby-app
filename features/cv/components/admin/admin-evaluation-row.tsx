"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, BarChart3, Calendar, Edit, Eye, MoreVertical, Sparkles, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { JobStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminEvaluationWithRelations } from "@/features/cv/actions/admin/get-admin-evaluations";
import { deleteAdminEvaluation } from "@/features/cv/actions/admin/delete-admin-evaluation";
import { routes } from "@/lib/routes";

const STATUS_CONFIG: Record<JobStatus, { label: string; colorClass: string }> = {
  PENDING: { label: "Pendiente", colorClass: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  IN_PROGRESS: { label: "En progreso", colorClass: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  SUCCEEDED: { label: "Exitosa", colorClass: "bg-green-500/10 text-green-600 border-green-500/20" },
  FAILED: { label: "Fallida", colorClass: "bg-destructive/10 text-destructive border-destructive/20" },
  CANCELLED: { label: "Cancelada", colorClass: "bg-muted text-muted-foreground border-border" },
};

interface AdminEvaluationRowProps {
  evaluation: AdminEvaluationWithRelations;
}

export function AdminEvaluationRow({ evaluation }: AdminEvaluationRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const status = evaluation.status as JobStatus;
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const score = evaluation.overallScore;
  const cvTitle = evaluation.cv?.title || "CV Sin titulo";
  const user = evaluation.cv?.user;
  const userLabel = user ? `${user.name} · ${user.email}` : "Sin usuario";
  const isFailed = status === "FAILED" || status === "CANCELLED";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminEvaluation(evaluation.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error cancelando evaluacion";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black",
            isFailed ? "bg-destructive/10 text-destructive"
              : score !== null && score !== undefined && score >= 80 ? "bg-primary/10 text-primary"
              : score !== null && score !== undefined && score < 60 ? "bg-amber-500/10 text-amber-500"
              : "bg-blue-500/10 text-blue-500"
          )}>
            {isFailed ? <AlertCircle className="h-5 w-5" />
              : score !== null && score !== undefined ? Math.round(score)
              : <BarChart3 className="h-5 w-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{cvTitle}</span>
              <StatusBadge variant="outline" className={cn("text-[10px]", statusConfig.colorClass)}>
                {statusConfig.label}
              </StatusBadge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><UserIcon className="h-3 w-3" /><span>{userLabel}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(evaluation.createdAt, "d MMM, yyyy")}</span></div>
              {score !== null && score !== undefined && (
                <div className="flex items-center gap-1"><Sparkles className="h-3 w-3" /><span>{Math.round(score)}/100</span></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.evaluations.detail(evaluation.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.evaluations.edit(evaluation.id))}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Cancelar evaluacion" description={<>Esta evaluacion sera marcada como cancelada. El usuario no podra acceder a sus resultados.</>} />
    </>
  );
}

