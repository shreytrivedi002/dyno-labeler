"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export type ThemeKey = "emerald" | "royal" | "amber" | "rose";

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>(() => (typeof window !== "undefined" ? (localStorage.getItem("theme") as ThemeKey) || "emerald" : "emerald"));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-emerald", "theme-royal", "theme-amber", "theme-rose");
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
