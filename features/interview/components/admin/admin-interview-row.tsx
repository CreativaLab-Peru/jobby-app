"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar, Eye, FileText, Mic, MoreVertical, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { AdminInterviewItem } from "@/features/interview/actions/admin/get-admin-interviews";
import { deleteAdminInterview } from "@/features/interview/actions/admin/delete-admin-interview";
import { routes } from "@/lib/routes";

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completada",
  PENDING: "Pendiente",
  FAILED: "Fallida",
};

interface AdminInterviewRowProps {
  interview: AdminInterviewItem;
}

export function AdminInterviewRow({ interview }: AdminInterviewRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const statusStyle = STATUS_STYLES[interview.status] || STATUS_STYLES.PENDING;
  const statusLabel = STATUS_LABELS[interview.status] || interview.status;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminInterview(interview.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      toast.error((result as { error: string }).error);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            interview.status === "COMPLETED" ? "bg-green-500/10 text-green-600" :
            interview.status === "FAILED" ? "bg-red-500/10 text-red-600" :
            "bg-amber-500/10 text-amber-600"
          )}>
            <Mic className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">{interview.opportunity.title}</span>
              <StatusBadge variant="outline" className={cn("text-[10px]", statusStyle)}>{statusLabel}</StatusBadge>
              {interview.overallScore !== null && (
                <StatusBadge variant="outline" className={cn("text-[10px] font-bold",
                  interview.overallScore >= 70 ? "bg-green-500/10 text-green-600 border-green-500/20" :
                  interview.overallScore >= 40 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                  "bg-red-500/10 text-red-600 border-red-500/20"
                )}>{interview.overallScore}/100</StatusBadge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><UserIcon className="h-3 w-3" /><span>{interview.user.name}</span></div>
              {interview.opportunity.company && <div className="flex items-center gap-1"><Briefcase className="h-3 w-3" /><span>{interview.opportunity.company}</span></div>}
              <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span className="truncate max-w-[120px]">{interview.cv.title || "Sin titulo"}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(interview.createdAt, "d MMM, yyyy HH:mm")}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.app.admin.interviews.detail(interview.id))}>
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(routes.app.admin.interviews.detail(interview.id))} className="cursor-pointer font-medium">
                  <Eye className="mr-2 h-4 w-4" /> Ver detalle
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

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar entrevista" description={<>Se eliminara permanentemente la entrevista de <strong>{interview.user.name}</strong> para <strong>{interview.opportunity.title}</strong>.</>} />
    </>
  );
}

