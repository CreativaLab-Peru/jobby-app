"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, LayoutGrid, List, Plus, Search, X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { deleteScholarshipAction } from "@/features/scholarships/actions/admin/delete-scholarship";
import type { ScholarshipListItem } from "@/features/scholarships/actions/admin/get-scholarships";
import { ScholarshipType } from "@prisma/client";

const SCHOLARSHIP_TYPE_LABELS: Record<ScholarshipType, string> = {
  MASTER: "Maestría",
  PHD: "Doctorado",
  FELLOWSHIP: "Beca",
};

interface AdminScholarshipListScreenProps {
  initialScholarships: ScholarshipListItem[];
  initialError?: string | null;
}

export function AdminScholarshipListScreen({
  initialScholarships,
  initialError = null,
}: AdminScholarshipListScreenProps) {
  const [isPending, startTransition] = useTransition();
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState<"card" | "list">("list");
  const [scholarshipToDelete, setScholarshipToDelete] = useState<ScholarshipListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setScholarships(initialScholarships);
  }, [initialScholarships]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.country.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.country.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewChange = (v: string) => {
    if (v === "card" || v === "list") {
      setView(v);
    }
  };

  const handleDelete = () => {
    if (!scholarshipToDelete) return;

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteScholarshipAction(scholarshipToDelete.id);
      setIsDeleting(false);

      if (result.success) {
        toast.success(result.message);
        setScholarships((prev) => prev.filter((s) => s.id !== scholarshipToDelete.id));
        setScholarshipToDelete(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <PageHeader
        title="Becas"
        description="Gestiona las oportunidades de becas disponibles"
        actions={
          <Button onClick={() => router.push("/admin/scholarships/new")}>
            <Plus className="h-4 w-4" />
            Nueva Beca
          </Button>
        }
      />

      {/* Search and View Toggle */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, país..."
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
        </div>

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
      {filteredScholarships.length === 0 ? (
        <EmptyPlaceholder
          icon={Award}
          title={searchText ? "Sin resultados" : "No hay becas"}
          description={
            searchText
              ? `No se encontraron becas para "${searchText}"`
              : "Aún no hay becas registradas."
          }
          action={
            searchText ? (
              <Button variant="ghost" onClick={() => setSearchText("")}>
                Limpiar búsqueda
              </Button>
            ) : (
              <Button onClick={() => router.push("/admin/scholarships/new")}>
                <Plus className="h-4 w-4" />
                Crear Beca
              </Button>
            )
          }
        />
      ) : view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredScholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="rounded-2xl border border-border/60 bg-card p-6 hover:border-border transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{scholarship.country.flag}</span>
                      <span className="text-sm text-muted-foreground">
                        {scholarship.country.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          scholarship.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {scholarship.isActive ? "Activa" : "Inactiva"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {SCHOLARSHIP_TYPE_LABELS[scholarship.type]}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{scholarship.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {scholarship.country.name}
                  </p>

                  {scholarship.deadline && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Fecha límite: {new Date(scholarship.deadline).toLocaleDateString("es-ES")}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                    <a
                      href={scholarship.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver sitio
                    </a>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/scholarships/${scholarship.id}/edit`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setScholarshipToDelete(scholarship)}
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
            {filteredScholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{scholarship.country.flag}</span>
                  <div>
                    <h3 className="font-bold">{scholarship.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {scholarship.country.name} • {SCHOLARSHIP_TYPE_LABELS[scholarship.type]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {scholarship.deadline && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(scholarship.deadline).toLocaleDateString("es-ES")}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      scholarship.isActive
                        ? "bg-green-500/10 text-green-600"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {scholarship.isActive ? "Activa" : "Inactiva"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                    >
                      <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/scholarships/${scholarship.id}`)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/scholarships/${scholarship.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setScholarshipToDelete(scholarship)}
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
      {scholarshipToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-2">Eliminar beca</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de eliminar <strong>{scholarshipToDelete.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setScholarshipToDelete(null)}
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