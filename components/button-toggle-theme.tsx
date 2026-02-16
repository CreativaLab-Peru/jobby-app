"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Renderizamos un placeholder del mismo tamaño para evitar saltos (Layout Shift)
  if (!mounted) {
    return <div className="w-10 h-10 rounded-md border border-input bg-background" />;
  }

  return (
    <Button
      variant="hero"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Cambiar tema"
    >
      {/* Icono Sol: Visible en Light, Invisible en Dark */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

      {/* Icono Luna: Invisible en Light, Visible en Dark */}
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
