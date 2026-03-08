"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Eye, MoreVertical, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { CV_TYPE_CONFIG, OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import { AdminCvWithRelations } from "@/features/cv/actions/admin/get-admin-cvs";
import { softDeleteAdminCv } from "@/features/cv/actions/admin/soft-delete-admin-cv";
import { routes } from "@/lib/routes";

interface AdminCvRowProps {
  cv: AdminCvWithRelations;
}

export function AdminCvRow({ cv }: AdminCvRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const config = CV_TYPE_CONFIG[cv?.cvType || ""] || CV_TYPE_CONFIG.GENERAL;
  const Icon = config.icon;
  const opportunity = OPPORTUNITY_CONFIG[cv?.opportunityType || ""] || "No especificado";
  const userLabel = cv.user ? `${cv.user.name} · ${cv.user.email}` : "Sin usuario";
  const isDeleted = cv.deletedAt !== null;
  const latestEval = cv.evaluations?.[0];
  const score = latestEval?.overallScore;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await softDeleteAdminCv(cv.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error ocultando CV";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-2", config.colorClass)}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{cv.title || "Sin titulo"}</span>
              <StatusBadge variant="outline" className="text-[10px]">{config.label}</StatusBadge>
              <StatusBadge variant="outline" className="text-[10px]">{opportunity}</StatusBadge>
              {isDeleted && (
                <StatusBadge variant="default" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Eliminado</StatusBadge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><UserIcon className="h-3 w-3" /><span>{userLabel}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(cv.updatedAt, "d MMM, yyyy")}</span></div>
              <span>{cv.sections.length} secciones</span>
              {score !== null && score !== undefined && <span>Puntaje: {Math.round(score)}/100</span>}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.cv.detail(cv.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.cv.edit(cv.id))}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.cv.detail(cv.id))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.cv.edit(cv.id))} className="cursor-pointer font-medium">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium" disabled={isDeleted}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar CV" description={<>Este CV se ocultara para el usuario. Puedes crear uno nuevo si es necesario.</>} />
    </>
  );
}

