"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, LogOut, Settings, BookA, Loader2, Home, ChevronRight
} from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface ProfileButtonProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
  redirectUrl?: string;
}

export function ProfileButton({ user, redirectUrl }: ProfileButtonProps) {
  const router = useRouter();
  const { state } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);

  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut();
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/login");
      }

    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuGroups = [
    {
      items: [
        { label: "Inicio", icon: Home, onClick: () => router.push("/dashboard") },
        { label: "Configuración", icon: Settings, onClick: () => router.push("/settings") },
      ]
    },
    {
      items: [
        { label: "Libro de reclamaciones", icon: BookA, onClick: () => router.push("/complaints") },
      ]
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-10 w-10 rounded-full p-0 transition-all hover:ring-2 hover:ring-primary/50",
            !isCollapsed && "hover:bg-primary/10"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm transition-colors hover:border-primary">
            <AvatarImage src={user?.image || ""} alt={user?.name || "Avatar"} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side={isCollapsed ? "right" : "top"}
        align={isCollapsed ? "end" : "center"}
        sideOffset={15}
        className="w-64 rounded-xl p-2 shadow-xl border-border bg-popover/95 backdrop-blur-md"
      >
        {/* Header con Info de Usuario usando Primary */}
        <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-primary/5 rounded-lg border border-primary/10">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold truncate leading-none mb-1 text-primary">
              {user?.name || "Usuario"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate font-medium">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              {group.items.map((item) => (
                <MenuAction key={item.label} onClick={item.onClick} icon={item.icon}>
                  {item.label}
                </MenuAction>
              ))}
              <Separator className="my-1 opacity-50" />
            </div>
          ))}

          {/* Logout manteniendo la semántica de error pero con transiciones suaves */}
          <Button
            variant="ghost"
            disabled={isLoading}
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 px-3 h-10 transition-all duration-200",
              "text-destructive hover:bg-destructive hover:text-destructive-foreground"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="font-medium text-sm">
              {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
            </span>
          </Button>
        </div>

        {/* Footer con acento Secondary */}
        <div className="mt-2 pt-2 border-t border-border/40 flex justify-center">
          <span
            className="text-[9px] uppercase tracking-[0.2em] font-bold text-secondary-foreground/60">
            Levely <span className="text-secondary">v1.0.0</span>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-componente Interno: MenuAction con acentos Secondary                   */
/* -------------------------------------------------------------------------- */

interface MenuActionProps extends ButtonProps {
  icon: React.ElementType;
  children: React.ReactNode;
}

function MenuAction({ icon: Icon, children, className, ...props }: MenuActionProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-between px-3 h-10 font-medium group transition-all",
        "hover:bg-secondary hover:text-secondary-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Icon
          className="h-4 w-4 text-muted-foreground group-hover:text-secondary-foreground transition-colors"
        />
        <span className="text-sm transition-colors">
          {children}
        </span>
      </div>

      <ChevronRight
        className="h-3 w-3 text-muted-foreground/30 group-hover:text-secondary-foreground transition-all group-hover:translate-x-0.5"
      />
    </Button>
  );
}
