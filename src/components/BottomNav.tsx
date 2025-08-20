"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, CubeIcon } from "@heroicons/react/24/solid";
import { BeakerIcon } from "@heroicons/react/24/outline";

export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
    { href: "/dashboard/materials", label: "Materials", icon: <BeakerIcon className="h-5 w-5" /> },
    { href: "/dashboard/products", label: "Products", icon: <CubeIcon className="h-5 w-5" /> },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-black/10">
      <ul className="flex items-center justify-around h-14">
        {items.map(item => {
          const active = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className="flex flex-col items-center gap-1 text-xs">
                <span className={active ? "text-[var(--primary)]" : "text-black/70"}>{item.icon}</span>
                <span className={active ? "text-[var(--primary)]" : "text-black/70"}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
