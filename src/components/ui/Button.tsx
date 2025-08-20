import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
};

export function Button({ className, variant = "primary", size = "md", leftIcon, children, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  }[size];
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-contrast)] hover:opacity-95 focus-visible:ring-[var(--primary)]",
    secondary: "bg-white text-black border border-black/10 hover:bg-black/5 focus-visible:ring-[var(--primary)]",
    ghost: "bg-transparent text-black hover:bg-black/5 focus-visible:ring-[var(--primary)]",
  }[variant];
  return (
    <button className={cn(base, sizes, variants, className)} {...props}>
      {leftIcon && <span className="mr-2 grid place-items-center">{leftIcon}</span>}
      {children}
    </button>
  );
}
