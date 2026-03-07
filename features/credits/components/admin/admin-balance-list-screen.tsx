"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ban, Coins, Filter, LayoutGrid, List, Search, Sparkles, Upload, Wallet, X, FileText, Briefcase,
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
import { AdminBalanceCard } from "@/features/credits/components/admin/admin-balance-card";
import { AdminBalanceRow } from "@/features/credits/components/admin/admin-balance-row";
import { AdminBalanceItem } from "@/features/credits/actions/admin/get-admin-balances";
import { cn } from "@/lib/utils";

interface BalanceStats {
  total: number;
  aiActions: number;
  uploads: number;
  manageCvs: number;
  searchOpportunities: number;
  zeroBalance: number;
  totalCredits: number;
}

interface AdminBalanceListScreenProps {
  initialBalances: AdminBalanceItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  stats: BalanceStats;
  initialQuery?: string;
  initialType?: string;
  initialBalanceStatus?: string;
  initialHasTransactions?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

const STAT_CARDS = [
  { key: "total", label: "Total", icon: Wallet, color: "text-primary bg-primary/10", typeFilter: null },
  { key: "aiActions", label: "IA", icon: Sparkles, color: "text-violet-600 bg-violet-500/10", typeFilter: "AI_ACTIONS" },
  { key: "uploads", label: "Subidas", icon: Upload, color: "text-blue-600 bg-blue-500/10", typeFilter: "UPLOADS" },
  { key: "manageCvs", label: "CVs", icon: FileText, color: "text-emerald-600 bg-emerald-500/10", typeFilter: "MANAGE_CVS" },
  { key: "searchOpportunities", label: "Oportunidades", icon: Briefcase, color: "text-amber-600 bg-amber-500/10", typeFilter: "SEARCH_OPPORTUNITIES" },
  { key: "zeroBalance", label: "Sin creditos", icon: Ban, color: "text-red-600 bg-red-500/10", typeFilter: null },
] as const;

export function AdminBalanceListScreen({
  initialBalances,
  totalCount = 0,
  currentPage,
  pageSize,
  stats,
  initialQuery = "",
  initialType = "",
  initialBalanceStatus = "",
  initialHasTransactions = "",
  initialDateFrom = "",
  initialDateTo = "",
  initialView = "list",
  initialError = null,
}: AdminBalanceListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(
    Boolean(initialType || initialBalanceStatus || initialHasTransactions || initialDateFrom || initialDateTo)
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { setSearchText(initialQuery); }, [initialQuery]);
  useEffect(() => { if (initialError) toast.error(initialError); }, [initialError]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalCount, currentPage * pageSize);
  const hasQuery = initialQuery.length > 0;
  const hasFilters = Boolean(initialType || initialBalanceStatus || initialHasTransactions || initialDateFrom || initialDateTo);
  const filterCount = [initialType, initialBalanceStatus, initialHasTransactions, initialDateFrom, initialDateTo].filter(Boolean).length;

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key); else params.set(key, value);
    });
    const qs = params.toString();
    startTransition(() => { router.push(qs ? `/admin/balances?${qs}` : "/admin/balances"); });
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); updateQuery({ q: searchText.trim() || null, page: "1" }); };
  const handleClearSearch = () => { setSearchText(""); updateQuery({ q: null, page: "1" }); };
  const handleClearFilters = () => {
    setSearchText("");
    updateQuery({ q: null, type: null, balanceStatus: null, hasTransactions: null, dateFrom: null, dateTo: null, page: "1" });
  };
  const handleViewChange = (v: string) => { if (v === "card" || v === "list") updateQuery({ view: v }); };
  const handlePageChange = (p: number) => { updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) }); };

  const handleStatClick = (typeFilter: string | null, key: string) => {
    if (key === "zeroBalance") {
      const current = initialBalanceStatus === "zero" ? null : "zero";
      updateQuery({ balanceStatus: current, type: null, page: "1" });
      return;
    }
    if (!typeFilter) {
      updateQuery({ type: null, balanceStatus: null, page: "1" });
      return;
    }
    const current = initialType === typeFilter ? null : typeFilter;
    updateQuery({ type: current, balanceStatus: null, page: "1" });
  };

  const isStatActive = (typeFilter: string | null, key: string) => {
    if (key === "zeroBalance") return initialBalanceStatus === "zero";
    if (!typeFilter) return !initialType && !initialBalanceStatus;
    return initialType === typeFilter;
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader title="Balances de Creditos" description="Gestiona los balances de creditos de todos los usuarios." />

          {/* Stats dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {STAT_CARDS.map(({ key, label, icon: Icon, color, typeFilter }) => {
              const value = stats[key as keyof BalanceStats];
              const active = isStatActive(typeFilter, key);
              return (
                <Card
                  key={key}
                  onClick={() => handleStatClick(typeFilter, key)}
                  className={cn(
                    "rounded-xl border p-3 text-center cursor-pointer transition-all hover:shadow-md",
                    active ? "border-primary ring-2 ring-primary/20" : "border-border/60"
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
            {/* Total credits */}
            <Card className="rounded-xl border border-border/60 p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                  <Coins className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-black text-foreground">{stats.totalCredits.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Creditos tot.</div>
            </Card>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="flex w-full flex-1 items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar por nombre o email de usuario..." className="pl-9" />
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
                    {/* Row 1: type, balanceStatus, hasTransactions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Select value={initialType || "all"} onValueChange={(v) => updateQuery({ type: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[220px] h-10 text-xs"><SelectValue placeholder="Tipo de credito" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          <SelectItem value="AI_ACTIONS">Acciones IA</SelectItem>
                          <SelectItem value="UPLOADS">Subidas</SelectItem>
                          <SelectItem value="MANAGE_CVS">Gestion CVs</SelectItem>
                          <SelectItem value="SEARCH_OPPORTUNITIES">Buscar Oportunidades</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={initialBalanceStatus || "all"} onValueChange={(v) => updateQuery({ balanceStatus: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[170px] h-10 text-xs"><SelectValue placeholder="Balance" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="zero">Sin creditos (0)</SelectItem>
                          <SelectItem value="positive">Con creditos (&gt;0)</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={initialHasTransactions || "all"} onValueChange={(v) => updateQuery({ hasTransactions: v === "all" ? null : v, page: "1" })}>
                        <SelectTrigger className="w-[180px] h-10 text-xs"><SelectValue placeholder="Transacciones" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="yes">Con transacciones</SelectItem>
                          <SelectItem value="no">Sin transacciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 2: date range, clear */}
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

          {/* Balances List */}
          {initialBalances.length > 0 ? (
            <>
              {initialView === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {initialBalances.map((balance, index) => (
                      <motion.div key={balance.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}>
                        <AdminBalanceCard balance={balance} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {initialBalances.map((balance, index) => (
                      <motion.div key={balance.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: (index % 10) * 0.03 }}>
                        <AdminBalanceRow balance={balance} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">Mostrando {startItem}-{endItem} de {totalCount} balances</div>
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
                icon={Wallet}
                title={hasQuery || hasFilters ? "Sin resultados" : "No hay balances"}
                description={hasQuery || hasFilters ? "No se encontraron balances con esos criterios." : "Aun no hay balances de creditos registrados."}
                action={
                  hasFilters ? (
                    <Button variant="default" onClick={handleClearFilters} className="rounded-lg font-bold shadow-sm"><X className="mr-2 h-4 w-4" />Limpiar filtros</Button>
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

