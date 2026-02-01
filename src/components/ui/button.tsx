import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accentPink via-baby-pink to-accentLilac text-white shadow-glow border border-white/60 hover:shadow-soft",
  secondary:
    "bg-white/40 text-ink backdrop-blur-lg border border-white/50 hover:bg-white/60",
  ghost: "bg-white/20 text-ink border border-white/40 hover:bg-white/35",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-pill px-5 py-3 text-sm font-semibold uppercase tracking-wide transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentPink/60 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
