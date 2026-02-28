"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function ThemeSync() {
  const { setTheme } = useTheme();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    fetch("/api/theme")
      .then((r) => r.json())
      .then(({ theme }) => {
        if (theme === "dark" || theme === "light") {
          setTheme(theme);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

