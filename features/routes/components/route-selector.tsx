"use client";

import { useRouteStore, RouteWithCvSummary } from "@/store/use-route-store";
import { setActiveRoute } from "@/features/routes/actions/set-active-route";
import { createRoute } from "@/features/routes/actions/create-route";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ChevronDown,
  Check,
  Route as RouteIcon,
} from "lucide-react";
import { useState, useTransition, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RouteStatus } from "@prisma/client";
import {routes as  routesLib} from "@/lib/routes";

// ── Progress helpers ───────────────────────────────────
const JOURNEY_STEPS: RouteStatus[] = [
  "CV_CREATED",
  "ANALYSIS_DONE",
  "OPPORTUNITIES_DONE",
  "ROADMAP_DONE",
];

function getProgressFraction(status: RouteStatus): number {
  const idx = JOURNEY_STEPS.findIndex((s) => s === status);
  if (idx !== -1) return (idx + 1) / JOURNEY_STEPS.length;
  // In-between statuses
  if (status === "CV_PENDING") return 0;
  if (status === "ANALYSIS_PENDING") return 0.25;
  if (status === "OPPORTUNITIES_PENDING") return 0.5;
  if (status === "ROADMAP_PENDING") return 0.75;
  return 0;
}

function getProgressLabel(status: RouteStatus): string {
  switch (status) {
    case "CV_PENDING":
      return "Sin CV";
    case "CV_CREATED":
      return "CV listo";
    case "ANALYSIS_PENDING":
      return "Analizando...";
    case "ANALYSIS_DONE":
      return "Análisis listo";
    case "OPPORTUNITIES_PENDING":
      return "Buscando...";
    case "OPPORTUNITIES_DONE":
      return "Oportunidades";
    case "ROADMAP_PENDING":
      return "Generando roadmap...";
    case "ROADMAP_DONE":
      return "Ruta completa ✓";
    default:
      return "";
  }
}

// ── Mini progress bar ──────────────────────────────────
function MiniProgress({ status }: { status: RouteStatus }) {
  const pct = getProgressFraction(status) * 100;
  const isComplete = status === "ROADMAP_DONE";

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isComplete ? "bg-green-500" : "bg-primary",
          )}
          style={{ width: `${Math.max(pct, 5)}%` }}
        />
      </div>
      <span
        className={cn(
          "text-[9px] font-bold shrink-0",
          isComplete ? "text-green-600" : "text-muted-foreground",
        )}
      >
        {getProgressLabel(status)}
      </span>
    </div>
  );
}

// ── Route item in dropdown ─────────────────────────────
function RouteItem({
  route,
  isActive,
  onSelect,
}: {
  route: RouteWithCvSummary;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-secondary/70",
      )}
    >
      <div className="flex items-center gap-2">
        {isActive ? (
          <Check className="w-3 h-3 text-primary shrink-0" />
        ) : (
          <div className="w-3 h-3 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs font-bold truncate",
              isActive && "text-primary",
            )}
          >
            {route.name}
          </p>
          <MiniProgress status={route.status} />
        </div>
      </div>
    </button>
  );
}

// ── Main Component ─────────────────────────────────────
export function RouteSelector() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const router = useRouter();

  const {
    activeRoute,
    routes,
    setActiveRoute: setStoreActive,
    hydrate,
  } = useRouteStore();

  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (route: RouteWithCvSummary) => {
    if (route.id === activeRoute?.id) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      await setActiveRoute(route.id);
      setStoreActive(route);
      setOpen(false);
      router.refresh();
      router.push(routesLib.app.dashboard);
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createRoute(newName.trim());
      const result = await getRoutesForUser();
      hydrate(result.routes ?? []);
      setShowCreate(false);
      setNewName("");
      router.refresh();
    });
  };

  // ── Collapsed ─────────
  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            activeRoute
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary",
          )}
          title={activeRoute?.name ?? "Rutas"}
        >
          <RouteIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // ── Expanded ──────────
  return (
    <>
      <div className="px-3 py-2 relative" ref={dropdownRef}>
        {/* Trigger */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left",
            open
              ? "border-primary/30 bg-primary/5"
              : "border-border hover:border-primary/20 hover:bg-secondary/30",
          )}
        >
          <RouteIcon className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">
              {activeRoute?.name ?? "Sin ruta"}
            </p>
            {activeRoute && (
              <MiniProgress status={activeRoute.status} />
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-xl border border-border bg-card shadow-lg p-1.5 space-y-0.5 max-h-[280px] overflow-y-auto">
            {routes.map((route) => (
              <RouteItem
                key={route.id}
                route={route}
                isActive={route.id === activeRoute?.id}
                onSelect={() => handleSelect(route)}
              />
            ))}

            {/* New route button */}
            <div className="pt-1 border-t border-border mt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  setShowCreate(true);
                  router.push('/dashboard');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Nueva ruta</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create route dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nueva ruta</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder='Ej: "Mi camino al empleo"'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreate(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isPending || !newName.trim()}
            >
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



