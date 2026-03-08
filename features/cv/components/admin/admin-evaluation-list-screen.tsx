"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Target,
  X,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

interface EvaluationStats {
  total: number;
  succeeded: number;
  pending: number;
  inProgress: number;
  failed: number;
  cancelled: number;
  avgScore: number | null;
}

interface AdminEvaluationListScreenProps {
  initialEvaluations: AdminEvaluationWithRelations[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  stats: EvaluationStats;
  initialQuery?: string;
  initialStatus?: string;
  initialCvType?: string;
  initialOpportunityType?: string;
  initialUserId?: string;
  initialHasScore?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

const STAT_CARDS = [
  {
    key: "total",
    label: "Total",
    icon: BarChart3,
    color: "text-primary bg-primary/10",
    statusFilter: null,
  },
  {
    key: "succeeded",
    label: "Exitosas",
    icon: CheckCircle,
    color: "text-green-600 bg-green-500/10",
    statusFilter: "SUCCEEDED",
  },
  {
    key: "pending",
    label: "Pendientes",
    icon: Clock,
    color: "text-amber-600 bg-amber-500/10",
    statusFilter: "PENDING",
  },
  {
    key: "inProgress",
    label: "En progreso",
    icon: Loader2,
    color: "text-blue-600 bg-blue-500/10",
    statusFilter: "IN_PROGRESS",
  },
  {
    key: "failed",
    label: "Fallidas",
    icon: AlertTriangle,
    color: "text-red-600 bg-red-500/10",
    statusFilter: "FAILED",
  },
  {
    key: "cancelled",
    label: "Canceladas",
    icon: XCircle,
    color: "text-muted-foreground bg-muted",
    statusFilter: "CANCELLED",
  },
] as const;

export function AdminEvaluationListScreen({
  initialEvaluations,
  totalCount = 0,
  currentPage,
  pageSize,
  stats,
  initialQuery = "",
  initialStatus = "",
  initialCvType = "",
  initialOpportunityType = "",
  initialUserId = "",
  initialHasScore = "",
  initialDateFrom = "",
  initialDateTo = "",
  initialView = "list",
  initialError = null,
}: AdminEvaluationListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [userIdText, setUserIdText] = useState(initialUserId);
  const [showFilters, setShowFilters] = useState(
    Boolean(
      initialStatus ||
        initialCvType ||
        initialOpportunityType ||
        initialUserId ||
        initialHasScore ||
        initialDateFrom ||
        initialDateTo
    )
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchText(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setUserIdText(initialUserId);
  }, [initialUserId]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalCount, currentPage * pageSize);
  const hasQuery = initialQuery.length > 0;
  const hasFilters = Boolean(
    initialStatus ||
      initialCvType ||
      initialOpportunityType ||
      initialUserId ||
      initialHasScore ||
      initialDateFrom ||
      initialDateTo
  );
  const filterCount = [
    initialStatus,
    initialCvType,
    initialOpportunityType,
    initialUserId,
    initialHasScore,
    initialDateFrom,
    initialDateTo,
  ].filter(Boolean).length;

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
      router.push(qs ? `/admin/evaluations?${qs}` : "/admin/evaluations");
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
  const handleClearFilters = () => {
    setSearchText("");
    setUserIdText("");
    updateQuery({
      q: null,
      status: null,
      cvType: null,
      opportunityType: null,
      userId: null,
      hasScore: null,
      dateFrom: null,
      dateTo: null,
      page: "1",
    });
  };
  const handleViewChange = (v: string) => {
    if (v === "card" || v === "list") {
      updateQuery({ view: v });
    }
  };
  const handlePageChange = (p: number) => {
    updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) });
  };

  const handleStatClick = (statusFilter: string | null) => {
    if (!statusFilter) {
      updateQuery({ status: null, page: "1" });
    } else {
      const current = initialStatus === statusFilter ? null : statusFilter;
      updateQuery({ status: current, page: "1" });
    }
  };

  const handleUserIdSubmit = () => {
    updateQuery({ userId: userIdText.trim() || null, page: "1" });
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

          {/* Stats dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {STAT_CARDS.map(
              ({ key, label, icon: Icon, color, statusFilter }) => {
                const value = stats[key as keyof EvaluationStats];
                const isActive = statusFilter
                  ? initialStatus === statusFilter
                  : !initialStatus;
                return (
                  <Card
                    key={key}
                    onClick={() => handleStatClick(statusFilter)}
                    className={cn(
                      "rounded-xl border p-3 text-center cursor-pointer transition-all hover:shadow-md",
                      isActive
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border/60"
                    )}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          color
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-foreground">
                      {typeof value === "number" ? value : "—"}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {label}
                    </div>
                  </Card>
                );
              }
            )}
            {/* Avg score */}
            <Card className="rounded-xl border border-border/60 p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    stats.avgScore !== null && stats.avgScore >= 70
                      ? "bg-green-500/10 text-green-600"
                      : stats.avgScore !== null && stats.avgScore >= 40
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Target className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-black text-foreground">
                {stats.avgScore !== null ? stats.avgScore.toFixed(0) : "—"}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Score prom.
              </div>
            </Card>
          </div>

          {/* Search & Filters */}
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
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Buscar por titulo de CV, nombre o email..."
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
                  <Filter className="h-4 w-4" /> Filtros
                  {filterCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                      {filterCount}
                    </span>
                  )}
                </Button>
                <Tabs value={initialView} onValueChange={handleViewChange}>
                  <TabsList className="h-10">
                    <TabsTrigger value="list" className="gap-2">
                      <List className="h-4 w-4" />Lista
                    </TabsTrigger>
                    <TabsTrigger value="card" className="gap-2">
                      <LayoutGrid className="h-4 w-4" />Tarjetas
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4">
                    {/* Row 1: status, cvType, opportunityType, hasScore */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Select
                        value={initialStatus || "all"}
                        onValueChange={(v) =>
                          updateQuery({ status: v === "all" ? null : v, page: "1" })
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
                        onValueChange={(v) =>
                          updateQuery({ cvType: v === "all" ? null : v, page: "1" })
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
                        onValueChange={(v) =>
                          updateQuery({ opportunityType: v === "all" ? null : v, page: "1" })
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

                      <Select
                        value={initialHasScore || "all"}
                        onValueChange={(v) =>
                          updateQuery({ hasScore: v === "all" ? null : v, page: "1" })
                        }
                      >
                        <SelectTrigger className="w-[150px] h-10 text-xs">
                          <SelectValue placeholder="Score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="yes">Con score</SelectItem>
                          <SelectItem value="no">Sin score</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 2: userId, date range, clear */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          User ID:
                        </span>
                        <Input
                          value={userIdText}
                          onChange={(e) => setUserIdText(e.target.value)}
                          placeholder="UUID del usuario"
                          className="w-[260px] h-10 text-xs font-mono"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleUserIdSubmit();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-10 text-xs"
                          onClick={handleUserIdSubmit}
                        >
                          Aplicar
                        </Button>
                        {initialUserId && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 text-xs"
                            onClick={() => {
                              setUserIdText("");
                              updateQuery({ userId: null, page: "1" });
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Desde:
                        </span>
                        <Input
                          type="date"
                          value={initialDateFrom}
                          onChange={(e) =>
                            updateQuery({ dateFrom: e.target.value || null, page: "1" })
                          }
                          className="w-[160px] h-10 text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Hasta:
                        </span>
                        <Input
                          type="date"
                          value={initialDateTo}
                          onChange={(e) =>
                            updateQuery({ dateTo: e.target.value || null, page: "1" })
                          }
                          className="w-[160px] h-10 text-xs"
                        />
                      </div>

                      {hasFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 gap-2 text-xs text-muted-foreground ml-auto"
                          onClick={handleClearFilters}
                        >
                          <X className="h-3.5 w-3.5" />
                          Limpiar filtros
                        </Button>
                      )}
                    </div>
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
                title={
                  hasQuery || hasFilters
                    ? "Sin resultados"
                    : "No hay evaluaciones"
                }
                description={
                  hasQuery || hasFilters
                    ? "No se encontraron evaluaciones con esos criterios."
                    : "Aun no hay evaluaciones registradas en el sistema."
                }
                action={
                  hasFilters ? (
                    <Button
                      variant="default"
                      onClick={handleClearFilters}
                      className="rounded-lg font-bold shadow-sm"
                    >
                      <X className="mr-2 h-4 w-4" />
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

