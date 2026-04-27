"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouteStore, RouteWithCvSummary } from "@/store/use-route-store";
import { useTaskStore } from "@/store/use-task-store";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { setActiveRoute } from "@/features/routes/actions/set-active-route";
import { createRoute } from "@/features/routes/actions/create-route";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { routes as routesLib } from "@/lib/routes";

import { MiniProgress } from "./mini-progress";
import { RouteItem } from "./route-item";

export function RouteSelector() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const router = useRouter();
  const { activeRoute, routes, setActiveRoute: setStoreActive, hydrate } = useRouteStore();
  const tasks = useTaskStore((state) => state.tasks);

  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Verificamos si la ruta activa tiene algún proceso en curso
  const activeRouteTask = activeRoute
    ? Object.values(tasks).find(
        (t) =>
          t.status === "IN_PROGRESS" &&
          (t.scopeId === activeRoute.cv?.id ||
            t.metadata?.routeId === activeRoute.id ||
            t.scopeId === activeRoute.id),
      )
    : null;

  const isProcessingActive = !!activeRouteTask;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (route: RouteWithCvSummary) => {
    if (route.id === activeRoute?.id) {
      router.push(routesLib.app.dashboard);
      setOpen(false);
      return;
    }
    startTransition(async () => {
      try {
        await setActiveRoute(route.id);
        setStoreActive(route);
        setOpen(false);
        router.refresh();
        router.push(routesLib.app.dashboard);
      } catch (error) {
        console.error("Error setting active route:", error);
      }
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      try {
        await createRoute(newName.trim());
        const result = await getRoutesForUser();
        if (result.success) {
          hydrate(result.routes ?? []);
        }
        setShowCreate(false);
        setNewName("");
        router.refresh();
        router.push(routesLib.app.dashboard);
      } catch (error) {
        console.error("Error creating route:", error);
      }
    });
  };

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "p-2 rounded-lg transition-all relative",
            activeRoute ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary",
            isProcessingActive && "animate-pulse ring-2 ring-primary/20",
          )}
        >
          <RouteIcon className="h-5 w-5" />
          {isProcessingActive && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-3 py-2 relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left",
            open
              ? "border-primary/30 bg-primary/5"
              : "border-border hover:border-primary/20 hover:bg-secondary/30",
            isProcessingActive && "border-primary/40 bg-primary/5 shadow-sm",
          )}
        >
          <div className="relative">
            <RouteIcon
              className={cn(
                "w-4 h-4 shrink-0",
                isProcessingActive ? "text-primary animate-spin-slow" : "text-primary",
              )}
            />
            {isProcessingActive && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">
              {activeRoute?.name ?? "Sin ruta"}
              {isProcessingActive && (
                <span className="ml-2 text-[8px] text-primary animate-pulse italic">IA</span>
              )}
            </p>
            {activeRoute && <MiniProgress route={activeRoute} />}
          </div>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

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
            <div className="pt-1 border-t border-border mt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  setShowCreate(true);
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

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva ruta</DialogTitle>
          </DialogHeader>
          <Input
            placeholder='Ej: "Mi camino al empleo"'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            disabled={isPending}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isPending || !newName.trim()}>
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
