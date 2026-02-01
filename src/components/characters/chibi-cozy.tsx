"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/asset";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ChibiCozyProps = {
  state?: "idle" | "blush" | "happy" | "hug";
  size?: number;
  className?: string;
  imageSrc?: string;
};

export function ChibiCozy({
  state = "idle",
  size = 180,
  className,
  imageSrc = "/G1.png",
}: ChibiCozyProps) {
  const isIdle = state === "idle";
  const isBlush = state === "blush";
  const isHappy = state === "happy";
  const isHug = state === "hug";

  return (
    <motion.div
      className={cn("relative inline-flex items-end justify-center", className)}
      style={{ width: size }}
      animate={isIdle || isHappy ? { y: [0, -5, 0] } : { y: 0 }}
      transition={isIdle || isHappy ? { duration: 4, repeat: Infinity } : { duration: 0.2 }}
    >
      <div
        className="absolute -bottom-3 rounded-full bg-black/15 blur-lg"
        style={{ width: size * 0.6, height: size * 0.15 }}
      />
      <motion.div
        className="relative w-full"
        animate={
          isBlush
            ? { scale: [1, 1.03, 1] }
            : isHappy
              ? { scale: [1, 1.01, 1] }
              : { scale: 1 }
        }
        transition={
          isBlush
            ? { duration: 1.6, repeat: Infinity }
            : { duration: 2, repeat: isHappy ? Infinity : 0 }
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
        <Image
          src={withBasePath(imageSrc)}
          alt=""
          aria-hidden="true"
              width={408}
              height={612}
              className="block h-auto w-full select-none"
              draggable={false}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {isBlush && (
        <div className="pointer-events-none absolute -right-1 top-3">
          <motion.span
            className="block h-3 w-3 rounded-full bg-white/90"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </div>
      )}
      {isHug && (
        <div className="pointer-events-none absolute -right-2 top-8 flex gap-2">
          {[0, 1, 2].map((idx) => (
            <motion.span
              key={`cozy-heart-${idx}`}
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
