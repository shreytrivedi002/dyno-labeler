"use client";

import { useEffect, useState } from "react";
import type { ThemeKey } from "@/app/providers";

const options: { key: ThemeKey; color: string; label: string }[] = [
  { key: "emerald", color: "#059669", label: "Emerald" },
  { key: "royal", color: "#3b82f6", label: "Royal" },
  { key: "amber", color: "#f59e0b", label: "Amber" },
  { key: "rose", color: "#f43f5e", label: "Rose" },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeKey>("emerald");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/theme", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { theme?: ThemeKey };
          if (data.theme) setTheme(data.theme);
        } else {
          const current = (typeof window !== "undefined" ? (localStorage.getItem("theme") as ThemeKey) : null) || "emerald";
          setTheme(current);
        }
      } catch {
        const current = (typeof window !== "undefined" ? (localStorage.getItem("theme") as ThemeKey) : null) || "emerald";
        setTheme(current);
      }
    })();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-emerald", "theme-royal", "theme-amber", "theme-rose");
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function choose(next: ThemeKey) {
    setTheme(next);
    try {
      await fetch("/api/settings/theme", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: next }) });
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => choose(o.key)}
          title={o.label}
          className={`h-6 w-6 rounded-full border ${theme === o.key ? 'ring-2 ring-[var(--primary)]' : ''}`}
          style={{ backgroundColor: o.color }}
        />
      ))}
    </div>
  );
}
