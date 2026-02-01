import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type HUDChipProps = HTMLAttributes<HTMLSpanElement>;

export function HUDChip({ className, ...props }: HUDChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink shadow-soft",
        className,
      )}
      {...props}
    />
  );
}
