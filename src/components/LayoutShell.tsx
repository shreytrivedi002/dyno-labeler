"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { BottomNav } from "@/components/BottomNav";

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMinimal = pathname === "/" || (pathname?.startsWith("/product/") ?? false);

  if (isMinimal) {
    return <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>;
  }

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        <div className="grid gap-6">{children}</div>
      </main>
      <BottomNav />
    </>
  );
}
