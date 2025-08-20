import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & { full?: boolean };

export function Input({ className, full, ...props }: Props) {
  return (
    <input
      className={cn(
        "border border-black/10 bg-white text-black rounded-md px-3 py-2 placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/20",
        full && "w-full",
        className
      )}
      {...props}
    />
  );
}
