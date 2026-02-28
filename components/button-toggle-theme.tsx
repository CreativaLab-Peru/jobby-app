"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { updateThemeAction } from "@/features/settings/actions/update-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-md border border-input bg-background" />;
  }

  const handleToggle = async () => {
    const previousTheme = theme;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    try {
      const result = await updateThemeAction(newTheme);
      if (result && "success" in result && !result.success) {
        setTheme(previousTheme as "light" | "dark");
      }
    } catch (error) {
      console.error("[THEME_TOGGLE_ERROR]", error);
      setTheme(previousTheme as "light" | "dark");
    }
  };

  return (
    <Button
      variant="hero"
      size="icon"
      onClick={handleToggle}
      title="Cambiar tema"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
