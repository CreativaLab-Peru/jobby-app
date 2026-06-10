"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, LayoutGrid, List, Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { deleteCountryAction } from "@/features/scholarships/actions/admin/delete-country";
import type { CountryListItem } from "@/features/scholarships/actions/admin/get-countries";

interface AdminCountryListScreenProps {
  initialCountries: CountryListItem[];
  initialError?: string | null;
}

export function AdminCountryListScreen({
  initialCountries,
  initialError = null,
}: AdminCountryListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [countries, setCountries] = useState(initialCountries);
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState<"card" | "list">("list");
  const [countryToDelete, setCountryToDelete] = useState<CountryListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setCountries(initialCountries);
  }, [initialCountries]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewChange = (v: string) => {
    if (v === "card" || v === "list") {
      setView(v);
    }
  };

  const handleDelete = () => {
    if (!countryToDelete) return;

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteCountryAction(countryToDelete.id);
      setIsDeleting(false);

      if (result.success) {
        toast.success(result.message);
        setCountries((prev) => prev.filter((c) => c.id !== countryToDelete.id));
        setCountryToDelete(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <PageHeader
        title="Países"
        description="Gestiona los países disponibles para las becas"
        actions={
          <Button onClick={() => router.push("/admin/countries/new")}>
            <Plus className="h-4 w-4" />
            Nuevo País
          </Button>
        }
      />

      {/* Search and View Toggle */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Client-side filtering, no navigation
          }}
          className="relative w-full md:w-96"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </form>

        <Tabs value={view} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="card">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {filteredCountries.length === 0 ? (
        <EmptyPlaceholder
          icon={Globe}
          title={searchText ? "Sin resultados" : "No hay países"}
          description={
            searchText
              ? `No se encontraron países para "${searchText}"`
              : "Aún no hay países registrados."
          }
          action={
            searchText ? (
              <Button variant="ghost" onClick={() => setSearchText("")}>
                Limpiar búsqueda
              </Button>
            ) : (
              <Button onClick={() => router.push("/admin/countries/new")}>
                <Plus className="h-4 w-4" />
                Crear País
              </Button>
            )
          }
        />
      ) : view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCountries.map((country) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="rounded-2xl border border-border/60 bg-card p-6 hover:border-border transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="font-bold text-lg">{country.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{country.code}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {country._count.opportunities} beca{Number(country._count.opportunities) === 1 ? "" : "s"}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/countries/${country.id}/edit`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setCountryToDelete(country)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredCountries.map((country) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold">{country.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{country.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm text-muted-foreground">
                    {country._count.opportunities} beca{Number(country._count.opportunities) === 1 ? "" : "s"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/countries/${country.id}`)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/countries/${country.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setCountryToDelete(country)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {countryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-2">Eliminar país</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de eliminar <strong>{countryToDelete.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setCountryToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}