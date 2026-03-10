"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Eye, FileText, MoreVertical, Shield, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/avatar-user";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminUserItem } from "@/features/user/actions/admin/get-admin-users";
import { deleteAdminUser } from "@/features/user/actions/admin/delete-admin-user";
import { toggleBlockAdminUser } from "@/features/user/actions/admin/toggle-block-admin-user";
import { ConfirmModal } from "@/components/shared/confirm-modal";

interface AdminUserRowProps {
  user: AdminUserItem;
}

export function AdminUserRow({ user }: AdminUserRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminUser(user.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.refresh();
    } else {
      toast.error("error" in result ? result.error : "Error eliminando usuario");
    }
    setIsDeleting(false);
  };

  const handleToggleBlock = async () => {
    setIsBlocking(true);
    const result = await toggleBlockAdminUser(user.id);
    if (result.success) {
      toast.success(result.message);
      setShowBlockDialog(false);
      router.refresh();
    } else {
      toast.error("error" in result ? result.error : "Error actualizando estado");
    }
    setIsBlocking(false);
  };

  return (
    <>
      <Card className="group border border-border/60 bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <UserAvatar image={user.image} name={user.name} className="h-10 w-10 shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-foreground truncate">
                {user.name?.startsWith("tmp_") || !user.name ? user.email : user.name}
              </span>
              <StatusBadge variant={user.role === "ADMIN" ? "primary" : "outline"}>
                {user.role === "ADMIN" ? "Admin" : "Usuario"}
              </StatusBadge>
              {user.isBlocked && (
                <StatusBadge variant="default" className="bg-destructive/10 text-destructive border-destructive/20">Bloqueado</StatusBadge>
              )}
              {!user.emailVerified && (
                <StatusBadge variant="default" className="bg-amber-500/10 text-amber-600 border-amber-500/20">No verificado</StatusBadge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{user.email}</span>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(user.createdAt, "d MMM, yyyy")}</span></div>
              <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span>{user._count.cvs} CVs</span></div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(`/admin/users/${user.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => setShowBlockDialog(true)} className={cn("cursor-pointer font-medium", user.isBlocked ? "text-green-600 focus:text-green-600" : "text-amber-600 focus:text-amber-600")}>
                  {user.isBlocked ? <><ShieldOff className="mr-2 h-4 w-4" /> Desbloquear</> : <><Shield className="mr-2 h-4 w-4" /> Bloquear</>}
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

      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar usuario" description={<>Se eliminara permanentemente al usuario <strong>{user.name}</strong> y todos sus datos.</>} />
      <ConfirmModal isOpen={showBlockDialog} onOpenChange={setShowBlockDialog} onConfirm={handleToggleBlock} loading={isBlocking} variant={user.isBlocked ? "default" : "destructive"} title={user.isBlocked ? "Desbloquear usuario" : "Bloquear usuario"} description={user.isBlocked ? <>El usuario podra acceder nuevamente.</> : <>El usuario no podra acceder mientras este bloqueado.</>} />
    </>
  );
}
