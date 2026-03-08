"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar, Edit, Eye, MapPin, MoreVertical, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { OPPORTUNITY_CONFIG } from "@/features/cv/consts";
import { AdminOpportunityItem } from "@/features/opportunities/actions/admin/get-admin-opportunities";
import { deleteAdminOpportunity } from "@/features/opportunities/actions/admin/delete-admin-opportunity";
import { routes } from "@/lib/routes";

interface AdminOpportunityRowProps {
  opportunity: AdminOpportunityItem;
}

export function AdminOpportunityRow({ opportunity }: AdminOpportunityRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const typeLabel = OPPORTUNITY_CONFIG[opportunity.type] || opportunity.type;
  const matchPercent = opportunity.match ? Number(opportunity.match) : 0;
  const user = opportunity.cv?.user;
  const userLabel = user ? `${user.name} · ${user.email}` : "Sin usuario";

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminOpportunity(opportunity.id, opportunity.cvId);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando oportunidad";
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
            matchPercent >= 80 ? "bg-green-500/10 text-green-600"
              : matchPercent >= 60 ? "bg-blue-500/10 text-blue-600"
              : "bg-amber-500/10 text-amber-500"
          )}>
            {matchPercent > 0 ? `${Math.round(matchPercent)}%` : <Briefcase className="h-5 w-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{opportunity.title}</span>
              <StatusBadge variant="outline" className="text-[10px]">{typeLabel}</StatusBadge>
              {opportunity.company && <StatusBadge variant="outline" className="text-[10px]">{opportunity.company}</StatusBadge>}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><UserIcon className="h-3 w-3" /><span>{userLabel}</span></div>
              {opportunity.deadline && (
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>Cierre: {formatDate(opportunity.deadline, "d MMM, yyyy")}</span></div>
              )}
              {opportunity.location && (
                <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{opportunity.location}</span></div>
              )}
              <span>{opportunity._count.interviewSessions} entrevistas</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.opportunities.detail(opportunity.id, opportunity.cvId))}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.opportunities.edit(opportunity.id, opportunity.cvId))}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.opportunities.detail(opportunity.id, opportunity.cvId))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.opportunities.edit(opportunity.id, opportunity.cvId))} className="cursor-pointer font-medium">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar oportunidad" description={<>Se eliminara permanentemente la oportunidad <strong>{opportunity.title}</strong>.</>} />
    </>
  );
}
