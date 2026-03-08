"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle, Clock, Filter,
  LayoutGrid, List, Mic, Search, Target, X,
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
import { AdminInterviewCard } from "@/features/interview/components/admin/admin-interview-card";
import { AdminInterviewRow } from "@/features/interview/components/admin/admin-interview-row";
import { AdminInterviewItem } from "@/features/interview/actions/admin/get-admin-interviews";
import { cn } from "@/lib/utils";

interface InterviewStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  avgScore: number | null;
}

interface AdminInterviewListScreenProps {
  initialInterviews: AdminInterviewItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  stats: InterviewStats;
  initialQuery?: string;
  initialStatus?: string;
  initialHasTranscript?: string;
  initialHasFeedback?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

const STAT_CARDS = [
  { key: "total", label: "Total", icon: Mic, color: "text-primary bg-primary/10", statusFilter: null },
  { key: "completed", label: "Completadas", icon: CheckCircle, color: "text-green-600 bg-green-500/10", statusFilter: "COMPLETED" },
  { key: "pending", label: "Pendientes", icon: Clock, color: "text-amber-600 bg-amber-500/10", statusFilter: "PENDING" },
  { key: "failed", label: "Fallidas", icon: AlertTriangle, color: "text-red-600 bg-red-500/10", statusFilter: "FAILED" },
] as const;

export function AdminInterviewListScreen({
  initialInterviews,
  totalCount = 0,
  currentPage,
  pageSize,
  stats,
  initialQuery = "",
  initialStatus = "",
  initialHasTranscript = "",
  initialHasFeedback = "",
  initialDateFrom = "",
  initialDateTo = "",
  initialView = "list",
  initialError = null,
}: AdminInterviewListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(Boolean(initialStatus || initialHasTranscript || initialHasFeedback || initialDateFrom || initialDateTo));
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { setSearchText(initialQuery); }, [initialQuery]);
  useEffect(() => { if (initialError) toast.error(initialError); }, [initialError]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalCount, currentPage * pageSize);
  const hasQuery = initialQuery.length > 0;
  const hasFilters = Boolean(initialStatus || initialHasTranscript || initialHasFeedback || initialDateFrom || initialDateTo);
  const filterCount = [initialStatus, initialHasTranscript, initialHasFeedback, initialDateFrom, initialDateTo].filter(Boolean).length;

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key); else params.set(key, value);
    });
    const qs = params.toString();
    startTransition(() => { router.push(qs ? `/admin/interviews?${qs}` : "/admin/interviews"); });
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); updateQuery({ q: searchText.trim() || null, page: "1" }); };
  const handleClearSearch = () => { setSearchText(""); updateQuery({ q: null, page: "1" }); };
  const handleClearFilters = () => { setSearchText(""); updateQuery({ q: null, status: null, hasTranscript: null, hasFeedback: null, dateFrom: null, dateTo: null, page: "1" }); };
  const handleViewChange = (v: string) => { if (v === "card" || v === "list") updateQuery({ view: v }); };
  const handlePageChange = (p: number) => { updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) }); };

  const handleStatClick = (statusFilter: string | null) => {
    if (!statusFilter) {
      updateQuery({ status: null, page: "1" });
    } else {
      const current = initialStatus === statusFilter ? null : statusFilter;
      updateQuery({ status: current, page: "1" });
    }
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader title="Entrevistas" description="Monitorea las sesiones de entrevista simulada de todos los usuarios." />

          {/* Stats dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {STAT_CARDS.map(({ key, label, icon: Icon, color, statusFilter }) => {
              const value = stats[key as keyof InterviewStats];
              const isActive = statusFilter ? initialStatus === statusFilter : !initialStatus;
              return (
                <Card
                  key={key}
                  onClick={() => handleStatClick(statusFilter)}
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
                  <div className="text-xl font-black text-foreground">{typeof value === "number" ? value : "—"}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</div>
                </Card>
              );
            })}
            {/* Avg score card */}
            <Card className="rounded-xl border border-border/60 p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg",
                  stats.avgScore !== null && stats.avgScore >= 70 ? "bg-green-500/10 text-green-600" :
                  stats.avgScore !== null && stats.avgScore >= 40 ? "bg-amber-500/10 text-amber-600" :
                  "bg-muted text-muted-foreground"
                )}>
                  <Target className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-black text-foreground">{stats.avgScore !== null ? stats.avgScore.toFixed(0) : "—"}</div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Score prom.</div>
            </Card>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="flex w-full flex-1 items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar por usuario, oportunidad, CV o Vapi ID..." className="pl-9" />
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
                      <Select value={initialStatus || "all"} onValueChange={(v) => updateQuery({ status: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[160px] h-10 text-xs"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="COMPLETED">Completada</SelectItem>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="FAILED">Fallida</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={initialHasTranscript || "all"} onValueChange={(v) => updateQuery({ hasTranscript: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[170px] h-10 text-xs"><SelectValue placeholder="Transcripcion" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="yes">Con transcripcion</SelectItem>
                          <SelectItem value="no">Sin transcripcion</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={initialHasFeedback || "all"} onValueChange={(v) => updateQuery({ hasFeedback: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[150px] h-10 text-xs"><SelectValue placeholder="Feedback" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="yes">Con feedback</SelectItem>
                          <SelectItem value="no">Sin feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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

          {/* Interviews List */}
          {initialInterviews.length > 0 ? (
            <>
              {initialView === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {initialInterviews.map((interview, i) => (
                      <motion.div key={interview.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: (i % 10) * 0.05 }}>
                        <AdminInterviewCard interview={interview} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {initialInterviews.map((interview, i) => (
                      <motion.div key={interview.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: (i % 10) * 0.03 }}>
                        <AdminInterviewRow interview={interview} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">Mostrando {startItem}-{endItem} de {totalCount} entrevistas</div>
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
                icon={Mic}
                title={hasQuery || hasFilters ? "Sin resultados" : "No hay entrevistas"}
                description={hasQuery || hasFilters ? "No se encontraron entrevistas con esos criterios." : "Aun no hay sesiones de entrevista registradas."}
                action={hasFilters ? <Button variant="default" onClick={handleClearFilters} className="rounded-lg font-bold shadow-sm"><X className="mr-2 h-4 w-4" />Limpiar filtros</Button> : undefined}
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

