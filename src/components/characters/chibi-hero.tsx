"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/asset";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ChibiHeroProps = {
  state?: "idle" | "happy" | "hero" | "hug";
  size?: number;
  className?: string;
};

export function ChibiHero({ state = "idle", size = 190, className }: ChibiHeroProps) {
  const isIdle = state === "idle";
  const isHappy = state === "happy";
  const isHero = state === "hero";
  const isHug = state === "hug";

  return (
    <motion.div
      className={cn("relative inline-flex items-end justify-center", className)}
      style={{ width: size }}
      animate={isIdle || isHappy ? { y: [0, -6, 0] } : { y: 0 }}
      transition={isIdle || isHappy ? { duration: 4, repeat: Infinity } : { duration: 0.2 }}
    >
      <div
        className="absolute -bottom-3 rounded-full bg-black/15 blur-lg"
        style={{ width: size * 0.6, height: size * 0.15 }}
      />
      <motion.div
        className="relative w-full"
        animate={
          isHero
            ? { scale: [1, 1.02, 1] }
            : isHappy
              ? { scale: [1, 1.01, 1] }
              : { scale: 1 }
        }
        transition={
          isHero
            ? { duration: 2.4, repeat: Infinity }
            : { duration: 2, repeat: isHappy ? Infinity : 0 }
        }
      >
        <Image
          src={withBasePath("/boy.png")}
          alt=""
          aria-hidden="true"
          width={301}
          height={445}
          className="block h-auto w-full select-none"
          draggable={false}
          priority
        />
      </motion.div>
      {isHug && (
        <div className="pointer-events-none absolute -right-2 top-6 flex gap-2">
          {[0, 1, 2].map((idx) => (
            <motion.span
              key={`hero-heart-${idx}`}
              className="h-3 w-3 rounded-full bg-accentPink/70"
              animate={{ opacity: [0, 1, 0], y: [-2, -18, -30] }}
              transition={{ duration: 1.2, delay: idx * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
