"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownCircle, ArrowUpCircle, Filter, Gift, RefreshCw,
  Receipt, X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import { UserTransactionItem } from "@/features/credits/actions/get-user-transactions";

const TYPE_CONFIG: Record<string, { label: string; icon: typeof ArrowUpCircle; color: string }> = {
  RECHARGE: { label: "Recarga", icon: ArrowUpCircle, color: "text-green-600 bg-green-500/10" },
  CONSUMPTION: { label: "Consumo", icon: ArrowDownCircle, color: "text-red-600 bg-red-500/10" },
  REFUND: { label: "Reembolso", icon: RefreshCw, color: "text-blue-600 bg-blue-500/10" },
  BONUS: { label: "Bonus", icon: Gift, color: "text-amber-600 bg-amber-500/10" },
};

const CREDIT_TYPE_LABELS: Record<string, string> = {
  AI_ACTIONS: "IA",
  UPLOADS: "Subidas",
  MANAGE_CVS: "CVs",
  SEARCH_OPPORTUNITIES: "Oportunidades",
};

interface MyTransactionsScreenProps {
  transactions: UserTransactionItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  initialType?: string;
  initialCreditType?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialError?: string | null;
}

export function MyTransactionsScreen({
  transactions,
  totalCount,
  currentPage,
  pageSize,
  initialType = "",
  initialCreditType = "",
  initialDateFrom = "",
  initialDateTo = "",
  initialError = null,
}: MyTransactionsScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(Boolean(initialType || initialCreditType || initialDateFrom || initialDateTo));
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { if (initialError) toast.error(initialError); }, [initialError]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalCount, currentPage * pageSize);
  const hasFilters = Boolean(initialType || initialCreditType || initialDateFrom || initialDateTo);
  const filterCount = [initialType, initialCreditType, initialDateFrom, initialDateTo].filter(Boolean).length;

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key); else params.set(key, value);
    });
    const qs = params.toString();
    startTransition(() => { router.push(qs ? `/credits/transactions?${qs}` : "/credits/transactions"); });
  };

  const handleClearFilters = () => { updateQuery({ type: null, creditType: null, dateFrom: null, dateTo: null, page: "1" }); };
  const handlePageChange = (p: number) => { updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) }); };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Mis transacciones</h1>
        <p className="text-sm text-muted-foreground">Revisa el detalle de tus movimientos de créditos: recargas, consumos y reembolsos.</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button variant={showFilters ? "default" : "outline"} size="sm" className="h-9 gap-2 text-xs font-semibold" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-3.5 w-3.5" /> Filtros
            {filterCount > 0 && <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">{filterCount}</span>}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs text-muted-foreground" onClick={handleClearFilters}>
              <X className="h-3.5 w-3.5" /> Limpiar
            </Button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{totalCount} transacciones</span>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3">
                <Select value={initialType || "all"} onValueChange={(v) => updateQuery({ type: v === "all" ? null : v, page: "1" })}>
                  <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="RECHARGE">Recarga</SelectItem>
                    <SelectItem value="CONSUMPTION">Consumo</SelectItem>
                    <SelectItem value="REFUND">Reembolso</SelectItem>
                    <SelectItem value="BONUS">Bonus</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={initialCreditType || "all"} onValueChange={(v) => updateQuery({ creditType: v === "all" ? null : v, page: "1" })}>
                  <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Credito" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="AI_ACTIONS">IA</SelectItem>
                    <SelectItem value="UPLOADS">Subidas</SelectItem>
                    <SelectItem value="MANAGE_CVS">CVs</SelectItem>
                    <SelectItem value="SEARCH_OPPORTUNITIES">Oportunidades</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1.5">
                  <Input type="date" value={initialDateFrom} onChange={(e) => updateQuery({ dateFrom: e.target.value || null, page: "1" })} className="w-[140px] h-9 text-xs" />
                  <span className="text-xs text-muted-foreground">—</span>
                  <Input type="date" value={initialDateTo} onChange={(e) => updateQuery({ dateTo: e.target.value || null, page: "1" })} className="w-[140px] h-9 text-xs" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction List */}
      {transactions.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {transactions.map((tx, i) => {
              const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.RECHARGE;
              const Icon = cfg.icon;
              const isPositive = tx.amount > 0;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: (i % 10) * 0.02 }}
                >
                  <Card className="rounded-xl border border-border/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", cfg.color)}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{cfg.label}</span>
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
                            {CREDIT_TYPE_LABELS[tx.balance.type] || tx.balance.type}
                          </span>
                        </div>
                        {tx.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{tx.description}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className={cn("text-sm font-bold tabular-nums", isPositive ? "text-green-600" : "text-red-600")}>
                          {isPositive ? "+" : ""}{tx.amount}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{formatDate(tx.createdAt, "d MMM, yy")}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{startItem}–{endItem} de {totalCount}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || isPending}>Anterior</Button>
                <span className="text-xs text-muted-foreground">{currentPage}/{totalPages}</span>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || isPending}>Siguiente</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyPlaceholder
          icon={Receipt}
          title={hasFilters ? "Sin resultados" : "Sin transacciones"}
          description={hasFilters ? "No se encontraron transacciones con esos filtros." : "Aún no tienes movimientos de créditos."}
          action={
            hasFilters ? (
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs"><X className="mr-1.5 h-3.5 w-3.5" /> Limpiar filtros</Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

