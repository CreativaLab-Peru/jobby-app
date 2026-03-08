"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  Calendar,
  Edit,
  FileText,
  Globe,
  Layers,
  Link2,
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
import { CV_TYPE_CONFIG, OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import { AdminCvWithSections } from "@/features/cv/actions/admin/get-admin-cv-by-id";
import { softDeleteAdminCv } from "@/features/cv/actions/admin/soft-delete-admin-cv";
import { routes } from "@/lib/routes";

interface AdminCvDetailScreenProps {
  cv: AdminCvWithSections;
}

export function AdminCvDetailScreen({ cv }: AdminCvDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const config = CV_TYPE_CONFIG[cv?.cvType || ""] || CV_TYPE_CONFIG.GENERAL;
  const Icon = config.icon;
  const opportunity = OPPORTUNITY_CONFIG[cv?.opportunityType || ""] || "No especificado";
  const userLabel = cv.user ? `${cv.user.name} (${cv.user.email})` : "Sin usuario";
  const isDeleted = cv.deletedAt !== null;
  const latestEval = cv.evaluations?.[0];
  const score = latestEval?.overallScore;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await softDeleteAdminCv(cv.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.push(routes.app.admin.cv.root);
    } else {
      const errorMsg = (result as { error: string }).error || "Error ocultando CV";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  const stats = [
    { label: "Secciones", value: cv.sections.length, icon: Layers },
    { label: "Evaluaciones", value: cv.evaluations.length, icon: BarChart3 },
    { label: "Previews", value: cv._count.previews, icon: FileText },
    { label: "Oportunidades", value: cv._count.opportunities, icon: Briefcase },
  ];

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.cv.root)}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a CVs
          </Button>

          {/* Header */}
          <PageHeader
            title={cv.title || "Sin titulo"}
            description={userLabel}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="accent"
                  onClick={() => router.push(routes.app.admin.cv.edit(cv.id))}
                  className="rounded-lg font-bold text-xs h-9 shadow-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {!isDeleted && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="rounded-lg font-bold text-xs h-9"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                )}
              </div>
            }
          />

          {/* CV info card */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <div className="flex items-start gap-6">
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl p-3 shrink-0", config.colorClass)}>
                <Icon className="h-8 w-8" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge variant="outline">{config.label}</StatusBadge>
                  <StatusBadge variant="outline">{opportunity}</StatusBadge>
                  {isDeleted && (
                    <StatusBadge variant="default" className="bg-destructive/10 text-destructive border-destructive/20">
                      Eliminado
                    </StatusBadge>
                  )}
                  {score !== null && score !== undefined && (
                    <StatusBadge variant="default" className={cn(
                      score >= 80 ? "bg-green-500/10 text-green-600 border-green-500/20" :
                      score >= 60 ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}>
                      Puntaje: {Math.round(score)}/100
                    </StatusBadge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-foreground">{userLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 shrink-0" />
                    <span>Idioma: <span className="font-medium text-foreground">{cv.language}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Creado: <span className="font-medium text-foreground">{formatDate(cv.createdAt, "d MMM, yyyy HH:mm")}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Actualizado: <span className="font-medium text-foreground">{formatDate(cv.updatedAt, "d MMM, yyyy HH:mm")}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Sections */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Secciones del CV</h3>
            {cv.sections.length > 0 ? (
              <div className="space-y-3">
                {cv.sections.map((section, index) => (
                  <div key={section.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-foreground">{section.title || section.sectionType}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{section.sectionType}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(section.updatedAt, "d MMM, yyyy")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este CV no tiene secciones registradas.</p>
            )}
          </Card>

          {/* Evaluations */}
          {cv.evaluations.length > 0 && (
            <Card className="rounded-2xl border border-border/60 p-6">
              <h3 className="text-lg font-bold tracking-tight mb-4">Evaluaciones ({cv.evaluations.length})</h3>
              <div className="space-y-3">
                {cv.evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                      evaluation.status === "SUCCEEDED" ? "bg-green-500/10 text-green-600" :
                      evaluation.status === "FAILED" || evaluation.status === "CANCELLED" ? "bg-destructive/10 text-destructive" :
                      "bg-blue-500/10 text-blue-600"
                    )}>
                      {evaluation.overallScore !== null && evaluation.overallScore !== undefined ? Math.round(evaluation.overallScore) : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <StatusBadge variant="outline" className="text-[10px]">{evaluation.status}</StatusBadge>
                      <span className="ml-2 text-xs text-muted-foreground">{evaluation.scores.length} secciones evaluadas, {evaluation.recommendations.length} recomendaciones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatDate(evaluation.createdAt, "d MMM, yyyy")}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => router.push(routes.app.admin.evaluations.detail(evaluation.id))}>
                        <Link2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
                <span className="ml-2 font-mono text-xs text-foreground">{cv.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Usuario ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{cv.userId || "Sin asignar"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Job ID creador:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{cv.createdByJobId || "Manual"}</span>
              </div>
              {cv.deletedAt && (
                <div>
                  <span className="text-muted-foreground">Eliminado el:</span>
                  <span className="ml-2 font-medium text-destructive">{formatDate(cv.deletedAt, "d MMM, yyyy HH:mm")}</span>
                </div>
              )}
              {cv.notes && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Notas:</span>
                  <p className="mt-1 text-foreground">{cv.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar CV"
        description={<>Este CV se ocultara para el usuario. Puedes crear uno nuevo si es necesario.</>}
      />
    </main>
  );
}

