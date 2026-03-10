"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Eye, FileText, MoreVertical, Shield, ShieldOff, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { EntityListItem } from "@/components/shared/entity-list-item";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/avatar-user";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { AdminUserItem } from "@/features/user/actions/admin/get-admin-users";
import { deleteAdminUser } from "@/features/user/actions/admin/delete-admin-user";
import { toggleBlockAdminUser } from "@/features/user/actions/admin/toggle-block-admin-user";

interface AdminUserCardProps {
  user: AdminUserItem;
}

export function AdminUserCard({ user }: AdminUserCardProps) {
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
      const errorMsg = (result as { error: string }).error || "Error eliminando usuario";
      toast.error(errorMsg);
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
      const errorMsg = (result as { error: string }).error || "Error actualizando estado";
      toast.error(errorMsg);
    }
    setIsBlocking(false);
  };

  return (
    <>
      <EntityListItem
        icon={<UserAvatar image={user.image} name={user.name} className="h-10 w-10" />}
        subtitle={
          <div className="flex items-center gap-2">
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
        }
        title={<span className="text-lg font-bold tracking-tight text-foreground">
          {user.name?.startsWith("tmp_") || !user.name ? user.email : user.name}
        </span>}
        metadata={
          <>
            <div className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /><span>{user.email}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>Registro: {formatDate(user.createdAt, "d MMM, yyyy")}</span></div>
            <div className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /><span>{user._count.cvs} CVs</span></div>
          </>
        }
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)} className="cursor-pointer font-medium"><Eye className="mr-2 h-4 w-4" /> Ver detalle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/edit`)} className="cursor-pointer font-medium"><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowBlockDialog(true)} className={cn("cursor-pointer font-medium", user.isBlocked ? "text-green-600 focus:text-green-600" : "text-amber-600 focus:text-amber-600")}>
                {user.isBlocked ? <><ShieldOff className="mr-2 h-4 w-4" /> Desbloquear</> : <><Shield className="mr-2 h-4 w-4" /> Bloquear</>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive font-medium"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footerActions={<Button variant="accent" onClick={() => router.push(`/admin/users/${user.id}`)} className="h-9 rounded-lg px-6 text-xs font-bold shadow-sm">Ver Usuario</Button>}
      />
      <ConfirmModal isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} loading={isDeleting} title="Eliminar usuario" description={<>Se eliminara permanentemente al usuario <strong>{user.name}</strong> y todos sus datos asociados. Esta accion no se puede deshacer.</>} />
      <ConfirmModal isOpen={showBlockDialog} onOpenChange={setShowBlockDialog} onConfirm={handleToggleBlock} loading={isBlocking} variant={user.isBlocked ? "default" : "destructive"} title={user.isBlocked ? "Desbloquear usuario" : "Bloquear usuario"} description={user.isBlocked ? <>El usuario podra acceder nuevamente a la plataforma.</> : <>El usuario no podra acceder a la plataforma mientras este bloqueado.</>} />
    </>
  );
}
