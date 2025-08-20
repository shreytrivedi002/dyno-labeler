"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function NavBar() {
  const pathname = usePathname();
  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm whitespace-nowrap",
        pathname?.startsWith(href)
          ? "bg-[var(--primary)] text-[var(--primary-contrast)] shadow"
          : "text-black/80 hover:bg-black/5"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/10">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 h-14">
        <Link href="/" className="font-semibold tracking-tight text-black/90">Dyno Labels</Link>
        <nav className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
          {link("/dashboard", "Dashboard")}
          {link("/dashboard/materials", "Materials")}
          {link("/dashboard/products", "Products")}
        </nav>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
