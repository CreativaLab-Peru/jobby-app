"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { AdminCompanyCard } from "@/features/company/components/admin/admin-company-card";
import { AdminCompanyItem } from "@/features/company/actions/admin/get-admin-companies";

interface AdminCompanyListScreenProps {
  initialCompanies: AdminCompanyItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  initialQuery?: string;
  initialError?: string | null;
}

export function AdminCompanyListScreen({
                                         initialCompanies,
                                         totalCount = 0,
                                         currentPage,
                                         pageSize,
                                         initialQuery = "",
                                         initialError = null,
                                       }: AdminCompanyListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sincronizar búsqueda inicial
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

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/admin/companies?${qs}` : "/admin/companies");
    });
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQuery({ q: searchText.trim() || null, page: "1" });
  };

  const handleClearSearch = () => {
    setSearchText("");
    updateQuery({ q: null, page: "1" });
  };

  const handlePageChange = (p: number) => {
    updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) });
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
            title="Administración de Empresas"
            description="Gestiona todas las empresas registradas en el sistema."
            actions={
              <Button
                variant="accent"
                className="rounded-lg font-bold text-xs h-9 shadow-sm"
                onClick={() => router.push("/admin/companies/new")}
              >
                  <Plus className="mr-2 h-4 w-4" /> Nueva Empresa
              </Button>
            }
          />

          {/* Barra de Búsqueda Estilizada */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full flex-1 items-center gap-2"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Buscar por nombre, RUC o industria..."
                  className="pl-9"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="h-10 px-4 text-xs font-semibold"
                disabled={isPending}
              >
                {isPending ? "Buscando..." : "Buscar"}
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
          </div>

          {/* Listado de Empresas */}
          {initialCompanies.length > 0 ? (
            <>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {initialCompanies.map((company, index) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: (index % 10) * 0.03,
                      }}
                    >
                      <AdminCompanyCard company={company} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Paginación Estilizada */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">
                  Mostrando <span className="font-medium text-foreground">{startItem}-{endItem}</span> de <span className="font-medium text-foreground">{totalCount}</span> empresas
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
                icon={Building2}
                title={hasQuery ? "Sin resultados" : "No hay empresas"}
                description={
                  hasQuery
                    ? "No se encontraron empresas con esos criterios."
                    : "Aún no hay empresas registradas en la plataforma."
                }
                action={
                  hasQuery ? (
                    <Button
                      variant="default"
                      onClick={handleClearSearch}
                      className="rounded-lg font-bold shadow-sm"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Limpiar búsqueda
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      asChild
                      className="rounded-lg font-bold shadow-sm"
                    >
                      <a href="/admin/companies/new">
                        <Plus className="mr-2 h-4 w-4" /> Crear Empresa
                      </a>
                    </Button>
                  )
                }
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
