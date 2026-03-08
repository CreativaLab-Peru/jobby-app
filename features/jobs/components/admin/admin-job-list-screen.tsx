"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, Ban, CheckCircle, Clock, Filter,
  LayoutGrid, List, RefreshCw, Search, X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { AdminJobCard } from "@/features/jobs/components/admin/admin-job-card";
import { AdminJobRow } from "@/features/jobs/components/admin/admin-job-row";
import { AdminJobItem } from "@/features/jobs/actions/admin/get-admin-jobs";
import { cn } from "@/lib/utils";

interface JobStats {
  pending: number;
  inProgress: number;
  succeeded: number;
  failed: number;
  cancelled: number;
}

interface AdminJobListScreenProps {
  initialJobs: AdminJobItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  stats: JobStats;
  initialQuery?: string;
  initialStatus?: string;
  initialType?: string;
  initialHasError?: string;
  initialHasCv?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

const STAT_CARDS = [
  { key: "pending", label: "Pendientes", icon: Clock, color: "text-amber-600 bg-amber-500/10" },
  { key: "inProgress", label: "En progreso", icon: RefreshCw, color: "text-blue-600 bg-blue-500/10" },
  { key: "succeeded", label: "Exitosos", icon: CheckCircle, color: "text-green-600 bg-green-500/10" },
  { key: "failed", label: "Fallidos", icon: AlertTriangle, color: "text-red-600 bg-red-500/10" },
  { key: "cancelled", label: "Cancelados", icon: Ban, color: "text-muted-foreground bg-muted" },
] as const;

export function AdminJobListScreen({
  initialJobs,
  totalCount = 0,
  currentPage,
  pageSize,
  stats,
  initialQuery = "",
  initialStatus = "",
  initialType = "",
  initialHasError = "",
  initialHasCv = "",
  initialDateFrom = "",
  initialDateTo = "",
  initialView = "list",
  initialError = null,
}: AdminJobListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(Boolean(initialStatus || initialType || initialHasError || initialHasCv || initialDateFrom || initialDateTo));
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { setSearchText(initialQuery); }, [initialQuery]);
  useEffect(() => { if (initialError) toast.error(initialError); }, [initialError]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalCount, currentPage * pageSize);
  const hasQuery = initialQuery.length > 0;
  const hasFilters = Boolean(initialStatus || initialType || initialHasError || initialHasCv || initialDateFrom || initialDateTo);
  const filterCount = [initialStatus, initialType, initialHasError, initialHasCv, initialDateFrom, initialDateTo].filter(Boolean).length;

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key); else params.set(key, value);
    });
    const qs = params.toString();
    startTransition(() => { router.push(qs ? `/admin/jobs?${qs}` : "/admin/jobs"); });
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); updateQuery({ q: searchText.trim() || null, page: "1" }); };
  const handleClearSearch = () => { setSearchText(""); updateQuery({ q: null, page: "1" }); };
  const handleClearFilters = () => { setSearchText(""); updateQuery({ q: null, status: null, type: null, hasError: null, hasCv: null, dateFrom: null, dateTo: null, page: "1" }); };
  const handleViewChange = (v: string) => { if (v === "card" || v === "list") updateQuery({ view: v }); };
  const handlePageChange = (p: number) => { updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) }); };

  // Quick filter by status from stat cards
  const handleStatClick = (statusKey: string) => {
    const statusMap: Record<string, string> = { pending: "PENDING", inProgress: "IN_PROGRESS", succeeded: "SUCCEEDED", failed: "FAILED", cancelled: "CANCELLED" };
    const current = initialStatus === statusMap[statusKey] ? null : statusMap[statusKey];
    updateQuery({ status: current, page: "1" });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader title="Cola de Jobs" description="Monitorea y gestiona los jobs del sistema en tiempo real." />

          {/* Stats dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {STAT_CARDS.map(({ key, label, icon: Icon, color }) => {
              const value = stats[key as keyof JobStats];
              const isActive = initialStatus === { pending: "PENDING", inProgress: "IN_PROGRESS", succeeded: "SUCCEEDED", failed: "FAILED", cancelled: "CANCELLED" }[key];
              return (
                <Card
                  key={key}
                  onClick={() => handleStatClick(key)}
                  className={cn(
                    "rounded-xl border p-3 text-center cursor-pointer transition-all hover:shadow-md",
                    isActive ? "border-primary ring-2 ring-primary/20" : "border-border/60"
                  )}
                >
                  <div className="flex items-center justify-center mb-1">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-foreground">{value}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</div>
                </Card>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="flex w-full flex-1 items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar por jobId, tipo o error..." className="pl-9" />
                </div>
                <Button type="submit" variant="secondary" className="h-10 px-4 text-xs font-semibold">Buscar</Button>
                {searchText && <Button type="button" variant="ghost" className="h-10 px-3 text-xs" onClick={handleClearSearch}>Limpiar</Button>}
              </form>
              <div className="flex items-center gap-2">
                <Button variant={showFilters ? "default" : "outline"} size="sm" className="h-10 gap-2 text-xs font-semibold" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" /> Filtros
                  {filterCount > 0 && <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">{filterCount}</span>}
                </Button>
                <Tabs value={initialView} onValueChange={handleViewChange}>
                  <TabsList className="h-10">
                    <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" />Lista</TabsTrigger>
                    <TabsTrigger value="card" className="gap-2"><LayoutGrid className="h-4 w-4" />Tarjetas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status */}
                      <Select value={initialStatus || "all"} onValueChange={(v) => updateQuery({ status: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[160px] h-10 text-xs"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="IN_PROGRESS">En progreso</SelectItem>
                          <SelectItem value="SUCCEEDED">Exitoso</SelectItem>
                          <SelectItem value="FAILED">Fallido</SelectItem>
                          <SelectItem value="CANCELLED">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Type */}
                      <Input value={initialType} onChange={(e) => updateQuery({ type: e.target.value || null, page: "1" })} placeholder="Tipo de job..." className="w-[180px] h-10 text-xs" />

                      {/* Has error */}
                      <Select value={initialHasError || "all"} onValueChange={(v) => updateQuery({ hasError: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[150px] h-10 text-xs"><SelectValue placeholder="Con error" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="yes">Con error</SelectItem>
                          <SelectItem value="no">Sin error</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Has CV */}
                      <Select value={initialHasCv || "all"} onValueChange={(v) => updateQuery({ hasCv: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[140px] h-10 text-xs"><SelectValue placeholder="Con CV" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="yes">Con CV</SelectItem>
                          <SelectItem value="no">Sin CV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Date range */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Desde:</span>
                        <Input type="date" value={initialDateFrom} onChange={(e) => updateQuery({ dateFrom: e.target.value || null, page: "1" })} className="w-[160px] h-10 text-xs" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Hasta:</span>
                        <Input type="date" value={initialDateTo} onChange={(e) => updateQuery({ dateTo: e.target.value || null, page: "1" })} className="w-[160px] h-10 text-xs" />
                      </div>

                      {hasFilters && (
                        <Button variant="ghost" size="sm" className="h-10 gap-2 text-xs text-muted-foreground ml-auto" onClick={handleClearFilters}>
                          <X className="h-3.5 w-3.5" />Limpiar filtros
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Jobs List */}
          {initialJobs.length > 0 ? (
            <>
              {initialView === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {initialJobs.map((job, i) => (
                      <motion.div key={job.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: (i % 10) * 0.05 }}>
                        <AdminJobCard job={job} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {initialJobs.map((job, i) => (
                      <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: (i % 10) * 0.03 }}>
                        <AdminJobRow job={job} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">Mostrando {startItem}-{endItem} de {totalCount} jobs</div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || isPending}>Anterior</Button>
                  <span className="text-xs text-muted-foreground">Pagina {currentPage} de {totalPages}</span>
                  <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || isPending}>Siguiente</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={Activity}
                title={hasQuery || hasFilters ? "Sin resultados" : "No hay jobs"}
                description={hasQuery || hasFilters ? "No se encontraron jobs con esos criterios." : "No hay jobs registrados en la cola."}
                action={hasFilters ? <Button variant="default" onClick={handleClearFilters} className="rounded-lg font-bold shadow-sm"><X className="mr-2 h-4 w-4" />Limpiar filtros</Button> : undefined}
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

