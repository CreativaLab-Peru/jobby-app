"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Edit, Trash2,
  Calendar, Target, MoreVertical, ExternalLink, Briefcase
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDate } from "@/utils/format-date";
import { TitleAndForm } from "@/components/title-and-form";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";

import { CvWithRelations } from "../actions/get-cv-for-current-user";
import { softDeleteCv } from "../actions/soft-delete-cv";
import { updateCvTitle } from "@/features/cv/actions/update-title";
import { CV_TYPE_CONFIG, OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import {ConfirmModal} from "@/components/shared/confirm-modal";
import {cn} from "@/lib/utils";

interface CVCardProps {
  cv: CvWithRelations;
}

export function CVCard({ cv }: CVCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const config = CV_TYPE_CONFIG[cv?.cvType || ""] || CV_TYPE_CONFIG.GENERAL;
  const Icon = config.icon; // El componente del icono

  const opportunity = OPPORTUNITY_CONFIG[cv?.opportunityType || ""] || "No especificado";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await softDeleteCv(cv.id);
    if (result.success) {
      setShowDeleteDialog(false);
      router.refresh();
    }
    setIsDeleting(false);
  };

  const handleChangeTitle = (newTitle: string) => {
    if (isPending) return;
    startTransition(() => {
      updateCvTitle(cv.id, newTitle).then((result) => {
        if (result.success) router.refresh();
      });
    });
  };

  return (
    <>
      <EntityListItem
        icon={
          <div className={cn("p-2 rounded-lg transition-colors", config.colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
        }
        subtitle={
          <StatusBadge variant="outline">
            {config.label}
          </StatusBadge>
        }
        title={
          <TitleAndForm
            title={cv.title || "Sin título"}
            onSubmit={handleChangeTitle}
            isSubmitting={isPending}
            className="text-lg font-bold tracking-tight text-foreground"
          />
        }
        metadata={
          <>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{opportunity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Actualizado: {formatDate(cv.updatedAt, "d MMM, yyyy")}</span>
            </div>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(`/cv/${cv.id}/edit`)} className="cursor-pointer font-medium">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              {/*<DropdownMenuItem*/}
              {/*  onClick={() => setShowDeleteDialog(true)}*/}
              {/*  className="cursor-pointer text-destructive focus:text-destructive font-medium"*/}
              {/*>*/}
              {/*  <Trash2 className="mr-2 h-4 w-4" /> Eliminar*/}
              {/*</DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/evaluations?cvId=${cv.id}`)}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Ver Evaluaciones
              <FileText className="ml-2 h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/opportunities?cvId=${cv.id}`)}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Ver Oportunidades
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
            <Button
              variant="accent" // Usa el color primary del sistema
              onClick={() => router.push(`/cv/${cv.id}/preview`)}
              className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm"
            >
              Ver Detalles
            </Button>
          </div>
        }
      />

      {/* Diálogo de alerta para eliminación */}
      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="¿Eliminar currículum?"
        description={
          <>Esta acción ocultará el CV <span className="text-foreground font-bold italic">"{cv.title}"</span>. Podrás restaurarlo después.</>
        }
      />
    </>
  );
}
