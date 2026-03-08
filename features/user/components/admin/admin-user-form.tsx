"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { AdminUserDetail } from "@/features/user/actions/admin/get-admin-user-by-id";
import { updateAdminUser } from "@/features/user/actions/admin/update-admin-user";

interface AdminUserFormProps {
  user: AdminUserDetail;
}

export function AdminUserForm({ user }: AdminUserFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<"USER" | "ADMIN">(user.role);
  const [isBlocked, setIsBlocked] = useState(user.isBlocked);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateAdminUser(user.id, {
      name,
      email,
      role,
      isBlocked,
    });

    if (!result.success) {
      toast.error("error" in result ? result.error : "Error actualizando usuario");
    } else {
      toast.success(result.message);
      router.push(`/admin/users/${user.id}`);
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/users/${user.id}`)}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader
            title="Editar Usuario"
            description={`Editando a ${user.name} (${user.email})`}
          />

          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del usuario"
                  required
                  minLength={2}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold">
                  Rol
                </Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as "USER" | "ADMIN")}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="blocked" className="text-sm font-semibold">
                    Usuario bloqueado
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Si esta activo, el usuario no podra acceder a la plataforma.
                  </p>
                </div>
                <Switch
                  id="blocked"
                  checked={isBlocked}
                  onCheckedChange={setIsBlocked}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  disabled={isLoading}
                  className="rounded-lg font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg font-bold shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

