"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
  User as UserIcon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import { AdminOpportunityItem } from "@/features/opportunities/actions/admin/get-admin-opportunities";
import { deleteAdminOpportunity } from "@/features/opportunities/actions/admin/delete-admin-opportunity";
import { routes } from "@/lib/routes";

interface AdminOpportunityCardProps {
  opportunity: AdminOpportunityItem;
}

export function AdminOpportunityCard({
  opportunity,
}: AdminOpportunityCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const typeLabel = OPPORTUNITY_CONFIG[opportunity.type] || opportunity.type;
  const matchPercent = opportunity.match ? Number(opportunity.match) : 0;
  const user = opportunity.cv?.user;
  const userLabel = user ? `${user.name} · ${user.email}` : "Sin usuario";
  const cvTitle = opportunity.cv?.title || "CV Sin titulo";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminOpportunity(
      opportunity.id,
      opportunity.cvId
    );
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg =
        (result as { error: string }).error ||
        "Error eliminando oportunidad";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <EntityListItem
        icon={
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black",
              matchPercent >= 80
                ? "bg-green-500/10 text-green-600"
                : matchPercent >= 60
                ? "bg-blue-500/10 text-blue-600"
                : "bg-amber-500/10 text-amber-500"
            )}
          >
            {matchPercent > 0
              ? `${Math.round(matchPercent)}%`
              : <Briefcase className="h-5 w-5" />}
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge variant="outline">{typeLabel}</StatusBadge>
            {opportunity.company && (
              <StatusBadge
                variant="outline"
                className="text-[10px]"
              >
                {opportunity.company}
              </StatusBadge>
            )}
          </div>
        }
        title={
          <span className="text-lg font-bold tracking-tight text-foreground">
            {opportunity.title}
          </span>
        }
        metadata={
          <>
            <div className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              <span>{userLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              <span>CV: {cvTitle}</span>
            </div>
            {opportunity.deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Cierre:{" "}
                  {formatDate(opportunity.deadline, "d MMM, yyyy")}
                </span>
              </div>
            )}
            {opportunity.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{opportunity.location}</span>
              </div>
            )}
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    routes.app.admin.opportunities.detail(
                      opportunity.id,
                      opportunity.cvId
                    )
                  )
                }
                className="cursor-pointer font-medium"
              >
                <Eye className="mr-2 h-4 w-4" /> Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    routes.app.admin.opportunities.edit(
                      opportunity.id,
                      opportunity.cvId
                    )
                  )
                }
                className="cursor-pointer font-medium"
              >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              {opportunity.linkUrl && (
                <DropdownMenuItem
                  onClick={() => window.open(opportunity.linkUrl, "_blank")}
                  className="cursor-pointer font-medium"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Abrir enlace
                </DropdownMenuItem>
              )}
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
            onClick={() =>
              router.push(
                routes.app.admin.opportunities.detail(
                  opportunity.id,
                  opportunity.cvId
                )
              )
            }
            className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm"
          >
            Ver Oportunidad
          </Button>
        }
      />
      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar oportunidad"
        description={
          <>
            Se eliminara permanentemente la oportunidad{" "}
            <strong>{opportunity.title}</strong> y todas sus entrevistas
            asociadas.
          </>
        }
      />
    </>
  );
}
