"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, LayoutGrid, List, Plus, Search, Sparkles, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { AdminCvEvaluationPromptItem } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompts";
import { AdminCreateCvEvaluationPromptModal } from "@/features/cv/components/admin/admin-create-cv-evaluation-prompt-modal";
import { AdminCvEvaluationPromptRow } from "@/features/cv/components/admin/admin-cv-evaluation-prompt-row";
import { AdminCvEvaluationPromptCard } from "@/features/cv/components/admin/admin-cv-evaluation-prompt-card";
import { routes } from "@/lib/routes";

interface AdminCvEvaluationPromptListScreenProps {
  initialPrompts: AdminCvEvaluationPromptItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  initialQuery?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

export function AdminCvEvaluationPromptListScreen({
  initialPrompts,
  totalCount = 0,
  currentPage,
  pageSize,
  initialQuery = "",
  initialDateFrom = "",
  initialDateTo = "",
  initialView = "list",
  initialError = null,
}: AdminCvEvaluationPromptListScreenProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(Boolean(initialDateFrom || initialDateTo));
  const [isPending, startTransition] = useTransition();
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
  const hasFilters = Boolean(initialDateFrom || initialDateTo);

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
      router.push(qs ? `${routes.app.admin.cvEvaluationPrompts.root}?${qs}` : routes.app.admin.cvEvaluationPrompts.root);
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
    updateQuery({ q: null, dateFrom: null, dateTo: null, page: "1" });
  };

  const handleViewChange = (v: string) => {
    if (v === "card" || v === "list") {
      updateQuery({ view: v });
    }
  };

  const handlePageChange = (p: number) => {
    updateQuery({ page: String(Math.max(1, Math.min(totalPages, p))) });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <PageHeader
            title="Administracion de Prompts de Evaluacion"
            description="Gestiona los prompts por beca para el analisis de CV."
            actions={
              <Button variant="accent" onClick={() => setIsCreateOpen(true)} className="rounded-lg font-bold text-xs h-9 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Crear Prompt
              </Button>
            }
          />

          <div className="space-y-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="flex w-full flex-1 items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Buscar por beca o prompt..."
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
                  <Filter className="h-4 w-4" /> Filtros
                  {hasFilters && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                      {[initialDateFrom, initialDateTo].filter(Boolean).length}
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

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Desde:</span>
                      <Input
                        type="date"
                        value={initialDateFrom}
                        onChange={(e) => updateQuery({ dateFrom: e.target.value || null, page: "1" })}
                        className="w-[160px] h-10 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Hasta:</span>
                      <Input
                        type="date"
                        value={initialDateTo}
                        onChange={(e) => updateQuery({ dateTo: e.target.value || null, page: "1" })}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {initialPrompts.length > 0 ? (
            <>
              {initialView === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {initialPrompts.map((prompt, index) => (
                      <motion.div key={prompt.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}>
                        <AdminCvEvaluationPromptCard prompt={prompt} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {initialPrompts.map((prompt, index) => (
                      <motion.div key={prompt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: (index % 10) * 0.03 }}>
                        <AdminCvEvaluationPromptRow prompt={prompt} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="text-xs text-muted-foreground">
                  Mostrando {startItem}-{endItem} de {totalCount} prompts
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
                icon={Sparkles}
                title={hasQuery || hasFilters ? "Sin resultados" : "No hay prompts"}
                description={
                  hasQuery || hasFilters
                    ? "No se encontraron prompts con esos criterios."
                    : "Crea el primer prompt de evaluacion."
                }
                action={
                  hasFilters ? (
                    <Button variant="default" onClick={handleClearFilters} className="rounded-lg font-bold shadow-sm">
                      <X className="mr-2 h-4 w-4" />
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button variant="default" onClick={() => setIsCreateOpen(true)} className="rounded-lg font-bold shadow-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Prompt
                    </Button>
                  )
                }
              />
            </div>
          )}
        </motion.div>
      </div>

      <AdminCreateCvEvaluationPromptModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(promptId) => {
          setIsCreateOpen(false);
          router.push(routes.app.admin.cvEvaluationPrompts.detail(promptId));
        }}
      />
    </main>
  );
}

