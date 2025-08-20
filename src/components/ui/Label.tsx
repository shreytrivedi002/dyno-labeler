import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: Props) {
  return <label className={cn("text-sm text-black/70", className)} {...props} />;
}
