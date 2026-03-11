"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Filter, LayoutGrid, List, Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { AdminCreditPackageCard } from "@/features/credits/components/admin/admin-credit-package-card";
import { AdminCreditPackageRow } from "@/features/credits/components/admin/admin-credit-package-row";
import { AdminCreateCreditPackageModal } from "@/features/credits/components/admin/admin-create-credit-package-modal";
import { AdminCreditPackageItem } from "@/features/credits/actions/admin/get-admin-credit-packages";
import { AdminMonetizationTabs } from "@/components/shared/admin-monetization-tabs";
import { routes } from "@/lib/routes";

const PLAN_COLORS = [
  "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "bg-green-500/10 text-green-600 border-green-500/20",
  "bg-rose-500/10 text-rose-600 border-rose-500/20",
];

interface AdminCreditPackageListScreenProps {
  initialPackages: AdminCreditPackageItem[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  initialQuery?: string;
  initialActive?: string;
  initialType?: string;
  initialView?: "card" | "list";
  initialError?: string | null;
}

export function AdminCreditPackageListScreen({
  initialPackages,
  totalCount = 0,
  currentPage,
  pageSize,
  initialQuery = "",
  initialActive = "",
  initialType = "",
  initialView = "list",
  initialError = null,
}: AdminCreditPackageListScreenProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(Boolean(initialActive || initialType));
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

  const hasQuery = initialQuery.length > 0;
  const hasFilters = Boolean(initialActive || initialType);

  const groupedPackages = useMemo(() => {
    // Agrupar por planId 
    const map = new Map<string, { label: string; packages: AdminCreditPackageItem[] }>();

    for (const pkg of initialPackages) {
      const key = pkg.planId ?? "__no_plan__";
      const label = pkg.plan?.name ?? "Sin plan asociado";
      const existing = map.get(key);
      if (existing) {
        existing.packages.push(pkg);
      } else {
        map.set(key, { label, packages: [pkg] });
      }
    }

    // Planes con nombre primero (orden alfabético), luego "Sin plan"
    const entries = Array.from(map.entries()).sort(([a], [b]) => {
      if (a === "__no_plan__") return 1;
      if (b === "__no_plan__") return -1;
      return (map.get(a)!.label).localeCompare(map.get(b)!.label);
    });

    return entries.map(([key, { label, packages }], i) => ({
      key,
      label,
      packages,
      colorClass: PLAN_COLORS[i % PLAN_COLORS.length],
    }));
  }, [initialPackages]);

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
    const target = queryString ? `/admin/credit-packages?${queryString}` : "/admin/credit-packages";
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
    updateQuery({ q: null, active: null, type: null, page: "1" });
  };

  const handleViewChange = (value: string) => {
    if (value === "card" || value === "list") {
      updateQuery({ view: value });
    }
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-4">
            <AdminMonetizationTabs />
            <PageHeader
              title="Paquetes de Créditos"
              description="Gestiona los paquetes de créditos disponibles para los usuarios."
              actions={
                <Button variant="accent" onClick={() => setIsCreateOpen(true)} className="rounded-lg font-bold text-xs h-9 shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Paquete
                </Button>
              }
            />
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="flex w-full flex-1 items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Buscar por nombre o codigo..." className="pl-9" />
                </div>
                <Button type="submit" variant="secondary" className="h-10 px-4 text-xs font-semibold">Buscar</Button>
                {searchText && (
                  <Button type="button" variant="ghost" className="h-10 px-3 text-xs" onClick={handleClearSearch}>Limpiar</Button>
                )}
              </form>

              <div className="flex items-center gap-2">
                <Button variant={showFilters ? "default" : "outline"} size="sm" className="h-10 gap-2 text-xs font-semibold" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  Filtros
                  {hasFilters && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
                      {[initialActive, initialType].filter(Boolean).length}
                    </span>
                  )}
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
                  <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                      <Select value={initialActive || "all"} onValueChange={(value) => updateQuery({ active: value === "all" ? null : value, page: "1" })}>
                        <SelectTrigger className="w-[160px] h-10 text-xs"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="active">Activos</SelectItem>
                          <SelectItem value="inactive">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={initialType || "all"} onValueChange={(value) => updateQuery({ type: value === "all" ? null : value, page: "1" })}>
                        <SelectTrigger className="w-[220px] h-10 text-xs"><SelectValue placeholder="Tipo de credito" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          <SelectItem value="AI_ACTIONS">Acciones IA</SelectItem>
                          <SelectItem value="UPLOADS">Subidas</SelectItem>
                          <SelectItem value="MANAGE_CVS">Gestion CVs</SelectItem>
                          <SelectItem value="SEARCH_OPPORTUNITIES">Buscar Oportunidades</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {hasFilters && (
                      <Button variant="ghost" size="sm" className="h-10 gap-2 text-xs text-muted-foreground" onClick={handleClearFilters}>
                        <X className="h-3.5 w-3.5" />Limpiar filtros
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Packages — agrupados por plan */}
          {initialPackages.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {groupedPackages.map(({ key, label, packages, colorClass }, groupIndex) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: groupIndex * 0.06 }}
                    className="space-y-3"
                  >
                    {/* Cabecera del grupo */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${colorClass}`}>
                        <Coins className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-bold text-muted-foreground">
                        {packages.length}
                      </span>
                    </div>

                    {/* Paquetes del grupo */}
                    {initialView === "card" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packages.map((pkg, i) => (
                          <motion.div key={pkg.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
                            <AdminCreditPackageCard pkg={pkg} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {packages.map((pkg, i) => (
                          <motion.div key={pkg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                            <AdminCreditPackageRow pkg={pkg} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="text-xs text-muted-foreground">{totalCount} paquete{totalCount !== 1 ? "s" : ""} en total</div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={Coins}
                title={hasQuery || hasFilters ? "Sin resultados" : "No hay paquetes"}
                description={hasQuery || hasFilters ? "No se encontraron paquetes con esos criterios." : "Crea el primer paquete de créditos."}
                action={
                  hasFilters ? (
                    <Button variant="default" onClick={handleClearFilters} className="rounded-lg font-bold shadow-sm"><X className="mr-2 h-4 w-4" />Limpiar filtros</Button>
                  ) : (
                    <Button variant="default" onClick={() => setIsCreateOpen(true)} className="rounded-lg font-bold shadow-sm"><Plus className="mr-2 h-4 w-4" />Crear Paquete</Button>
                  )
                }
              />
            </div>
          )}
        </motion.div>
      </div>

      <AdminCreateCreditPackageModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(packageId) => {
          setIsCreateOpen(false);
          router.push(routes.app.admin.creditPackages.detail(packageId));
        }}
      />
    </main>
  );
}

