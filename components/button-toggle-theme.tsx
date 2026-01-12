"use client";

import * as React from "react";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export function ThemeToggleSwitch() {
  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitamos errores de hidratación asegurando que el componente esté montado
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-14 h-8"/>; // Placeholder para evitar saltos visuales

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
          ${isDark ? "bg-slate-800" : "bg-muted border border-border"}
        `}
      >
        {/* El "Thumb" o círculo deslizable */}
        <div
          className={`
            flex items-center justify-center w-6 h-6 rounded-full shadow-md transform transition-transform duration-300
            ${isDark ? "translate-x-6 bg-secondary text-secondary-foreground" : "translate-x-0 bg-white text-orange-500"}
          `}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-current"/>
          ) : (
            <Sun className="w-3.5 h-3.5 fill-current"/>
          )}
        </div>

        {/* Iconos de fondo para indicar los estados */}
        <div
          className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
          <Sun className={`w-3 h-3 ${isDark ? "opacity-40 text-slate-400" : "opacity-0"}`}/>
          <Moon className={`w-3 h-3 ${isDark ? "opacity-0" : "opacity-40 text-slate-400"}`}/>
        </div>
      </div>

      {/* Etiqueta opcional para mayor claridad visual */}
      <span
        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none">
        {isDark ? "Oscuro" : "Claro"}
      </span>
    </div>
  );
}
