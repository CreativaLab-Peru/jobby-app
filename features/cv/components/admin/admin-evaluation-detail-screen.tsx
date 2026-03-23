"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Trash2,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { JobStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminEvaluationDetail } from "@/features/cv/actions/admin/get-admin-evaluation-by-id";
import { deleteAdminEvaluation } from "@/features/cv/actions/admin/delete-admin-evaluation";
import AnalysisScore from "@/features/analysis/components/score-analysis";
import { mapEvaluationToAnalysis } from "@/features/analysis/dto/map-evaluation-to-analysis";
import { routes } from "@/lib/routes";

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; icon: React.ElementType; colorClass: string }
> = {
  PENDING: { label: "Pendiente", icon: Clock, colorClass: "text-yellow-600" },
  IN_PROGRESS: { label: "En progreso", icon: Clock, colorClass: "text-blue-600" },
  SUCCEEDED: { label: "Exitosa", icon: CheckCircle2, colorClass: "text-green-600" },
  FAILED: { label: "Fallida", icon: XCircle, colorClass: "text-destructive" },
  CANCELLED: { label: "Cancelada", icon: XCircle, colorClass: "text-muted-foreground" },
};

interface AdminEvaluationDetailScreenProps {
  evaluation: AdminEvaluationDetail;
}

export function AdminEvaluationDetailScreen({
  evaluation,
}: AdminEvaluationDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const status = evaluation.status as JobStatus;
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.icon;

  const user = evaluation.cv?.user;
  const userLabel = user ? `${user.name} · ${user.email}` : "Sin usuario";
  const hasResults = evaluation.status === "SUCCEEDED" && evaluation.scores.length > 0;

  const { recommendations, scoreAnalysis, scoreBreakdown } = hasResults
    ? mapEvaluationToAnalysis(evaluation)
    : { recommendations: [], scoreAnalysis: null, scoreBreakdown: [] };

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
    <main className="min-h-[87vh] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(routes.app.admin.evaluations.root)}
            className="rounded-lg text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={() => router.push(routes.app.admin.evaluations.edit(evaluation.id))}
              className="rounded-lg font-bold text-xs shadow-sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            {status !== "CANCELLED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-lg font-bold text-xs"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            )}
          </div>
        </div>

        {/* Meta card */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl font-black tracking-tight text-primary">
              {evaluation.cv?.title || "CV Sin titulo"}
            </h1>
            <StatusBadge
              variant="outline"
              className={cn("text-sm font-semibold flex items-center gap-1", statusConfig.colorClass)}
            >
              <StatusIcon className="h-4 w-4" />
              {statusConfig.label}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{userLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Creada: {formatDate(evaluation.createdAt, "d MMM, yyyy HH:mm")}</span>
            </div>
            {evaluation.finishedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Finalizada: {formatDate(evaluation.finishedAt, "d MMM, yyyy HH:mm")}</span>
              </div>
            )}
          </div>

          {evaluation.overallScore !== null && evaluation.overallScore !== undefined && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Puntaje general:{" "}
                <span className="text-primary">{Math.round(evaluation.overallScore)}/100</span>
              </span>
            </div>
          )}

          {evaluation.summary && (
            <div className="pt-2 border-t border-border/40">
              <p className="text-sm text-muted-foreground italic">{evaluation.summary}</p>
            </div>
          )}
        </div>

        {/* Analysis results */}
        {hasResults ? (
          <AnalysisScore
            scoreBreakdown={scoreBreakdown}
            cvScore={scoreAnalysis?.overallScore ?? evaluation.overallScore ?? 0}
            recommendations={recommendations}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-secondary/10 p-10 text-center">
            <p className="text-muted-foreground font-medium">
              {status === "PENDING" || status === "IN_PROGRESS"
                ? "La evaluacion aun no ha finalizado."
                : "No hay resultados disponibles para esta evaluacion."}
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Cancelar evaluacion"
        description={<>Esta evaluacion sera marcada como cancelada. El usuario no podra acceder a sus resultados.</>}
      />
    </main>
  );
}
