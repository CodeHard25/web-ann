"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function JumpToBottom() {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className="group fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink shadow-soft transition hover:shadow-glow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Jump to bottom"
    >
      <ArrowDown className="h-5 w-5" />
      <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-pill bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-ink/70 opacity-0 transition group-hover:opacity-100">
        jump to bottom
      </span>
    </motion.button>
  );
}
