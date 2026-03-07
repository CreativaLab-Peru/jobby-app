"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Users,
  X,
  Filter,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { AdminUserCard } from "@/features/user/components/admin/admin-user-card";
import { AdminUserRow } from "@/features/user/components/admin/admin-user-row";
import { AdminCreateUserModal } from "@/features/user/components/admin/admin-create-user-modal";
import { AdminUserItem } from "@/features/user/actions/admin/get-admin-users";

interface AdminUserListScreenProps {
  initialUsers: AdminUserItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  initialQuery?: string;
  initialRole?: string;
  initialStatus?: string;
  initialEmailVerified?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

export function AdminUserListScreen({
  initialUsers,
  totalCount = 0,
  currentPage,
  pageSize,
  initialQuery = "",
  initialRole = "",
  initialStatus = "",
  initialEmailVerified = "",
  initialView = "list",
  initialError = null,
}: AdminUserListScreenProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(
    Boolean(initialRole || initialStatus || initialEmailVerified)
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchText(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalCount, currentPage * pageSize);
  const hasQuery = initialQuery.length > 0;
  const hasFilters = Boolean(initialRole || initialStatus || initialEmailVerified);

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    const target = queryString ? `/admin/users?${queryString}` : "/admin/users";
    startTransition(() => {
      router.push(target);
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = searchText.trim();
    updateQuery({ q: value || null, page: "1" });
  };

  const handleClearSearch = () => {
    setSearchText("");
    updateQuery({ q: null, page: "1" });
  };

  const handleClearFilters = () => {
    setSearchText("");
    updateQuery({
      q: null,
      role: null,
      status: null,
      emailVerified: null,
      page: "1",
    });
  };

  const handleViewChange = (value: string) => {
    if (value === "card" || value === "list") {
      updateQuery({ view: value });
    }
  };

  const handlePageChange = (nextPage: number) => {
    const safePage = Math.max(1, Math.min(totalPages, nextPage));
    updateQuery({ page: String(safePage) });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Administración de Usuarios"
            description="Gestiona los usuarios de la plataforma."
            actions={
              <Button
                variant="accent"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-lg font-bold text-xs h-9 shadow-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Usuario
              </Button>
            }
          />

          {/* Search & Filters Bar */}
          <div className="space-y-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full flex-1 items-center gap-2"
              >
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  className="h-10 px-4 text-xs font-semibold"
                >
                  Buscar
                </Button>
                {searchText && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 px-3 text-xs"
                    onClick={handleClearSearch}
                  >
                    Limpiar
                  </Button>
                )}
              </form>

              <div className="flex items-center gap-2">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  className="h-10 gap-2 text-xs font-semibold"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {hasFilters && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                      {[initialRole, initialStatus, initialEmailVerified].filter(Boolean).length}
                    </span>
                  )}
                </Button>

                <Tabs value={initialView} onValueChange={handleViewChange}>
                  <TabsList className="h-10">
                    <TabsTrigger value="list" className="gap-2">
                      <List className="h-4 w-4" />
                      Lista
                    </TabsTrigger>
                    <TabsTrigger value="card" className="gap-2">
                      <LayoutGrid className="h-4 w-4" />
                      Tarjetas
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                      <Select
                        value={initialRole || "all"}
                        onValueChange={(value) =>
                          updateQuery({
                            role: value === "all" ? null : value,
                            page: "1",
                          })
                        }
                      >
                        <SelectTrigger className="w-[160px] h-10 text-xs">
                          <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los roles</SelectItem>
                          <SelectItem value="USER">Usuario</SelectItem>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={initialStatus || "all"}
                        onValueChange={(value) =>
                          updateQuery({
                            status: value === "all" ? null : value,
                            page: "1",
                          })
                        }
                      >
                        <SelectTrigger className="w-[160px] h-10 text-xs">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="blocked">Bloqueado</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={initialEmailVerified || "all"}
                        onValueChange={(value) =>
                          updateQuery({
                            emailVerified: value === "all" ? null : value,
                            page: "1",
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px] h-10 text-xs">
                          <SelectValue placeholder="Email verificado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="verified">Verificado</SelectItem>
                          <SelectItem value="unverified">No verificado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {hasFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 gap-2 text-xs text-muted-foreground"
                        onClick={handleClearFilters}
                      >
                        <X className="h-3.5 w-3.5" />
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Users List */}
          {initialUsers.length > 0 ? (
            <>
              {initialView === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {initialUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: (index % 10) * 0.05,
                        }}
                      >
                        <AdminUserCard user={user} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {initialUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: (index % 10) * 0.03,
                        }}
                      >
                        <AdminUserRow user={user} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">
                  Mostrando {startItem}-{endItem} de {totalCount} usuarios
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isPending}
                  >
                    Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isPending}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={Users}
                title={
                  hasQuery || hasFilters
                    ? "Sin resultados"
                    : "No hay usuarios disponibles"
                }
                description={
                  hasQuery || hasFilters
                    ? "No se encontraron usuarios con esos criterios."
                    : "Aún no hay usuarios registrados en la plataforma."
                }
                action={
                  hasFilters ? (
                    <Button
                      variant="default"
                      onClick={handleClearFilters}
                      className="rounded-lg font-bold shadow-sm"
                    >
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => setIsCreateOpen(true)}
                      className="rounded-lg font-bold shadow-sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Usuario
                    </Button>
                  )
                }
              />
            </div>
          )}
        </motion.div>
      </div>

      <AdminCreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(userId) => {
          setIsCreateOpen(false);
          router.push(`/admin/users/${userId}`);
        }}
      />
    </main>
  );
}

