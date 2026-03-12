"use client";

import { useRouteStore } from "@/store/use-route-store";
import { setActiveRoute } from "@/features/routes/actions/set-active-route";
import { createRoute } from "@/features/routes/actions/create-route";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Route as RouteIcon } from "lucide-react";
import { useState, useTransition } from "react";

export function RouteSelector() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const router = useRouter();

  const { activeRoute, routes, setActiveRoute: setStoreActive, hydrate } = useRouteStore();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (routeId: string) => {
    if (routeId === "__new__") {
      setShowCreate(true);
      return;
    }
    const target = routes.find((r) => r.id === routeId);
    if (!target) return;
    startTransition(async () => {
      await setActiveRoute(routeId);
      setStoreActive(target);
      router.refresh();
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

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={() => setShowCreate(true)}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
          title="Rutas"
        >
          <RouteIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Select
            value={activeRoute?.id ?? ""}
            onValueChange={handleChange}
          >
            <SelectTrigger className="flex-1 h-9 text-sm truncate">
              <SelectValue placeholder="Selecciona una ruta" />
            </SelectTrigger>
            <SelectContent>
              {routes.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
              <SelectItem value="__new__" className="text-primary font-medium">
                <span className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Nueva ruta
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <Button onClick={handleCreate} disabled={isPending || !newName.trim()}>
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

