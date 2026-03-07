"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Filter,
  LayoutGrid,
  List,
  Search,
  X,
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
import { AdminEvaluationWithRelations } from "@/features/cv/actions/admin/get-admin-evaluations";
import { AdminEvaluationCard } from "@/features/cv/components/admin/admin-evaluation-card";
import { AdminEvaluationRow } from "@/features/cv/components/admin/admin-evaluation-row";

interface AdminEvaluationListScreenProps {
  initialEvaluations: AdminEvaluationWithRelations[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  initialQuery?: string;
  initialStatus?: string;
  initialCvType?: string;
  initialOpportunityType?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

export function AdminEvaluationListScreen({
  initialEvaluations,
  totalCount = 0,
  currentPage,
  pageSize,
  initialQuery = "",
  initialStatus = "",
  initialCvType = "",
  initialOpportunityType = "",
  initialView = "list",
  initialError = null,
}: AdminEvaluationListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(
    Boolean(initialStatus || initialCvType || initialOpportunityType)
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
  const hasFilters = Boolean(initialStatus || initialCvType || initialOpportunityType);

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
    const target = queryString ? `/admin/evaluations?${queryString}` : "/admin/evaluations";
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
      status: null,
      cvType: null,
      opportunityType: null,
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
            title="Administracion de Evaluaciones"
            description="Gestiona las evaluaciones de CV de todos los usuarios."
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
                    placeholder="Buscar por titulo de CV, nombre o email..."
                    className="pl-9"
                  />
                </div>
                <Button type="submit" variant="secondary" className="h-10 px-4 text-xs font-semibold">
                  Buscar
                </Button>
                {searchText && (
                  <Button type="button" variant="ghost" className="h-10 px-3 text-xs" onClick={handleClearSearch}>
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
                      {[initialStatus, initialCvType, initialOpportunityType].filter(Boolean).length}
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
                        value={initialStatus || "all"}
                        onValueChange={(value) =>
                          updateQuery({ status: value === "all" ? null : value, page: "1" })
                        }
                      >
                        <SelectTrigger className="w-[160px] h-10 text-xs">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
                          <SelectItem value="SUCCEEDED">Exitosa</SelectItem>
                          <SelectItem value="FAILED">Fallida</SelectItem>
                          <SelectItem value="CANCELLED">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={initialCvType || "all"}
                        onValueChange={(value) =>
                          updateQuery({ cvType: value === "all" ? null : value, page: "1" })
                        }
                      >
                        <SelectTrigger className="w-[200px] h-10 text-xs">
                          <SelectValue placeholder="Tipo de CV" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          <SelectItem value="TECHNOLOGY_ENGINEERING">Tecnologia</SelectItem>
                          <SelectItem value="DESIGN_CREATIVITY">Diseno</SelectItem>
                          <SelectItem value="MARKETING_STRATEGY">Marketing</SelectItem>
                          <SelectItem value="MANAGEMENT_BUSINESS">Negocios</SelectItem>
                          <SelectItem value="FINANCE_PROJECTS">Finanzas</SelectItem>
                          <SelectItem value="SOCIAL_MEDIA">Redes Sociales</SelectItem>
                          <SelectItem value="EDUCATION">Educacion</SelectItem>
                          <SelectItem value="SCIENCE">Ciencia</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={initialOpportunityType || "all"}
                        onValueChange={(value) =>
                          updateQuery({ opportunityType: value === "all" ? null : value, page: "1" })
                        }
                      >
                        <SelectTrigger className="w-[200px] h-10 text-xs">
                          <SelectValue placeholder="Tipo de oportunidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las oportunidades</SelectItem>
                          <SelectItem value="INTERNSHIP">Pasantia</SelectItem>
                          <SelectItem value="SCHOLARSHIP">Beca</SelectItem>
                          <SelectItem value="EXCHANGE_PROGRAM">Intercambio</SelectItem>
                          <SelectItem value="EMPLOYMENT">Empleo</SelectItem>
                          <SelectItem value="STARTUP">Startup</SelectItem>
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

          {/* Evaluations List */}
          {initialEvaluations.length > 0 ? (
            <>
              {initialView === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {initialEvaluations.map((evaluation, index) => (
                      <motion.div
                        key={evaluation.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                      >
                        <AdminEvaluationCard evaluation={evaluation} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {initialEvaluations.map((evaluation, index) => (
                      <motion.div
                        key={evaluation.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: (index % 10) * 0.03 }}
                      >
                        <AdminEvaluationRow evaluation={evaluation} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">
                  Mostrando {startItem}-{endItem} de {totalCount} evaluaciones
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
                    Pagina {currentPage} de {totalPages}
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
                icon={BarChart3}
                title={hasQuery || hasFilters ? "Sin resultados" : "No hay evaluaciones"}
                description={
                  hasQuery || hasFilters
                    ? "No se encontraron evaluaciones con esos criterios."
                    : "Aun no hay evaluaciones registradas en el sistema."
                }
                action={
                  hasFilters ? (
                    <Button variant="default" onClick={handleClearFilters} className="rounded-lg font-bold shadow-sm">
                      Limpiar filtros
                    </Button>
                  ) : undefined
                }
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

