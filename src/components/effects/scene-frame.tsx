import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gradients } from "@/lib/theme";
import { FilmGrainOverlay } from "./film-grain-overlay";
import { SoftParticles } from "./soft-particles";
import { VignetteOverlay } from "./vignette-overlay";

type SceneFrameProps = {
  children: ReactNode;
  mood?: "night" | "dusk" | "sunrise" | "muted" | "vibrant";
  particles?: boolean | "stars" | "bokeh" | "petals";
  particleVariant?: "stars" | "bokeh" | "petals";
  particleDensity?: number;
  particleSpeed?: "slow" | "medium";
  className?: string;
};

export function SceneFrame({
  children,
  mood = "night",
  particles = true,
  particleVariant = "stars",
  particleDensity,
  particleSpeed = "slow",
  className,
}: SceneFrameProps) {
  const background = gradients[mood] ?? gradients.night;
  const resolvedParticles =
    typeof particles === "string" ? particles : particleVariant;
  const shouldRenderParticles = particles !== false;

  return (
    <div
      className={cn("relative min-h-screen overflow-hidden", className)}
      style={{ background }}
    >
      {shouldRenderParticles ? (
        <SoftParticles
          variant={resolvedParticles}
          density={particleDensity}
          speed={particleSpeed}
          disableOnReducedMotion
        />
      ) : null}
      <VignetteOverlay />
      <FilmGrainOverlay />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
