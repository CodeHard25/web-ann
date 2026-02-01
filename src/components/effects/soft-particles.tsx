"use client";

import { useMemo, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ParticleVariant = "stars" | "bokeh" | "petals";

type SoftParticlesProps = {
  variant?: ParticleVariant;
  density?: number;
  speed?: "slow" | "medium";
  disableOnReducedMotion?: boolean;
  className?: string;
};

const speedRanges = {
  slow: [14, 22],
  medium: [10, 16],
} as const;

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function SoftParticles({
  variant = "stars",
  density = 18,
  speed = "slow",
  disableOnReducedMotion = false,
  className,
}: SoftParticlesProps) {
  const prefersReducedMotion = useReducedMotion();

  const particles = useMemo(() => {
    const [min, max] = speedRanges[speed];
    const rand = mulberry32(hashSeed(`${variant}-${density}-${speed}`));
    return Array.from({ length: density }, (_, index) => {
      const size = 4 + rand() * 8;
      const duration = min + rand() * (max - min);
      const delay = rand() * -duration;
      return {
        id: `${variant}-${index}`,
        size,
        x: rand() * 100,
        y: rand() * 100,
        duration,
        delay,
      };
    });
  }, [density, speed, variant]);

  if (prefersReducedMotion && disableOnReducedMotion) {
    return null;
  }

  return (
    <div
      className={cn("particle-field", className)}
      aria-hidden="true"
      style={{
        opacity: prefersReducedMotion ? 0.3 : 0.7,
      }}
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={cn("particle", `particle--${variant}`)}
          style={{
            "--size": `${particle.size}px`,
            "--x": `${particle.x}%`,
            "--y": `${particle.y}%`,
            "--duration": `${particle.duration}s`,
            "--delay": `${particle.delay}s`,
            animationPlayState: prefersReducedMotion ? "paused" : "running",
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
