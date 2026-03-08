"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Eye, MoreVertical, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { CV_TYPE_CONFIG, OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import { cn } from "@/lib/utils";
import { AdminCvWithRelations } from "@/features/cv/actions/admin/get-admin-cvs";
import { softDeleteAdminCv } from "@/features/cv/actions/admin/soft-delete-admin-cv";
import { routes } from "@/lib/routes";

interface AdminCvCardProps {
  cv: AdminCvWithRelations;
}

export function AdminCvCard({ cv }: AdminCvCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const config = CV_TYPE_CONFIG[cv?.cvType || ""] || CV_TYPE_CONFIG.GENERAL;
  const Icon = config.icon;
  const opportunity = OPPORTUNITY_CONFIG[cv?.opportunityType || ""] || "No especificado";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await softDeleteAdminCv(cv.id);
    if (result.success) {
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error al eliminar el CV";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  const userLabel = cv.user ? `${cv.user.name} · ${cv.user.email}` : "Sin usuario";

  return (
    <>
      <EntityListItem
        icon={
          <div className={cn("p-2 rounded-lg transition-colors", config.colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant="outline">{config.label}</StatusBadge>
            <StatusBadge variant="outline">{opportunity}</StatusBadge>
          </div>
        }
        title={
          <span className="text-lg font-bold tracking-tight text-foreground">
            {cv.title || "Sin título"}
          </span>
        }
        metadata={
          <>
            <div className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              <span>{userLabel}</span>
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
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem
                onClick={() => router.push(routes.app.admin.cv.detail(cv.id))}
                className="cursor-pointer font-medium"
              >
                <Eye className="mr-2 h-4 w-4" /> Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(routes.app.admin.cv.edit(cv.id))}
                className="cursor-pointer font-medium"
              >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-destructive focus:text-destructive font-medium"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={
          <Button
            variant="accent"
            onClick={() => router.push(routes.app.admin.cv.detail(cv.id))}
            className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm"
          >
            Ver CV
          </Button>
        }
      />

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="¿Eliminar currículum?"
        description={
          <>Este CV se ocultara para el usuario. Puedes crear uno nuevo si es necesario.</>
        }
      />
    </>
  );
}
