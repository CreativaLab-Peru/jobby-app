"use client";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  SparkleIcon, Rocket
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {Button} from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Home, label: "Mis CVs", href: "/cv" },
  { icon: SparkleIcon, label: "Mis Evaluaciones", href: "/evaluations" },
  { icon: Rocket, label: "Oportunidades", href: "/opportunities" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

export function CustomSidebar() {
  const { isOpen, isCollapsed, toggleCollapse, closeMobile } = useSidebarStore();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay Mobile: Se cierra al hacer click fuera */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity sm:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobile}
      />

      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      )}>
        <div className="flex h-full flex-col p-4">

          {/* Header del Sidebar */}
          <div className="flex items-center justify-between mb-8 h-10">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center mt-4">
                {/* Eliminamos el div relativo con alturas fijas si es posible */}
                <Image
                  src="/logo_light.png"
                  alt="Levely logo"
                  width={120} // El ancho real del logo recortado
                  height={40}  // La altura real proporcional
                  priority
                  className="block dark:hidden h-36 w-auto object-contain"
                />
                <Image
                  src="/logo_dark.png"
                  alt="Levely logo dark"
                  width={120}
                  height={40}
                  priority
                  className="hidden dark:block h-36 w-auto object-contain"
                />
              </Link>
            )}
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={toggleCollapse}
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
            <button onClick={closeMobile} className="sm:hidden p-1">
              <X size={20} />
            </button>
          </div>

          {/* Items de Navegación */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile} // Importante: cerrar al navegar en mobile
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all group",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
