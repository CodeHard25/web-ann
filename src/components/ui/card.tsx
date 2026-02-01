import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-white/70 text-ink shadow-soft backdrop-blur-lg",
        className,
      )}
      {...props}
    />
  );
}
