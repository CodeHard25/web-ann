"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { transitions } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : transitions.major;

  return (
    <motion.main
      key={pathname}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
      className="min-h-screen"
    >
      {children}
    </motion.main>
  );
}
