"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SceneFrame } from "@/components/effects/scene-frame";
import { ChibiCozy } from "@/components/characters/chibi-cozy";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { HUDChip } from "@/components/ui/hud-chip";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { fadeIn, glowPulse } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Check, Heart, PauseCircle, Sparkles, Timer } from "lucide-react";
import { useRouter } from "next/navigation";

type RoutineCard = {
  id: string;
  title: string;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
};

const routineCards: RoutineCard[] = [
  {
    id: "streets",
    title: "Same streets, same pace",
    caption: "The city moves, but my heart waits.",
    icon: Timer,
  },
  {
    id: "days",
    title: "Days passing quietly",
    caption: "Time goes on… gently.",
    icon: PauseCircle,
  },
  {
    id: "smiles",
    title: "Smiles waiting to happen",
    caption: "Like a laugh paused mid-air.",
    icon: Heart,
  },
  {
    id: "pause",
    title: "Magic still on pause",
    caption: "But not for long.",
    icon: Sparkles,
  },
];

export default function ChapterOnePage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [jyotiState, setJyotiState] = useState<
    "idle" | "sigh" | "blush" | "hug"
  >("idle");
  const [joyMeter, setJoyMeter] = useState(12);
  const [progressValue, setProgressValue] = useState(0);
  const [clickedCards, setClickedCards] = useState<Set<string>>(
    () => new Set(),
  );
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(
    () => new Set(),
  );
  const [pauseMotion, setPauseMotion] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const reboundRef = useRef<number | null>(null);

  const unlocked = clickedCards.size === routineCards.length;

  const handleCardClick = useCallback(
    (cardId: string) => {
      setClickedCards((prev) => {
        const next = new Set(prev);
        next.add(cardId);
        if (next.size === routineCards.length) {
          setPauseMotion(true);
        }
        const nextProgress = Math.min(100, Math.round((next.size / routineCards.length) * 100));
        setProgressValue(nextProgress);
        return next;
      });
      setDismissedCards((prev) => new Set(prev).add(cardId));
      setJyotiState("sigh");
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setJyotiState("idle");
      }, 1200);

      setJoyMeter((prev) => Math.max(0, prev - 2));
      if (reboundRef.current) {
        window.clearTimeout(reboundRef.current);
      }
      reboundRef.current = window.setTimeout(() => {
        setJoyMeter((prev) => Math.min(100, prev + 1));
      }, 500);

      // Ambient sound hook (optional stub).
      if (typeof window !== "undefined") {
        void Promise.resolve();
      }
    },
    [],
  );

  const containerVariants = useMemo(
    () => ({
      initial: {},
      animate: {
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : 0.4,
          delayChildren: prefersReducedMotion ? 0 : 0.2,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const thoughtVariants = {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  useEffect(() => {
    if (!unlocked) return;
    const timeout = window.setTimeout(() => setPauseMotion(false), 600);
    return () => window.clearTimeout(timeout);
  }, [unlocked]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (reboundRef.current) window.clearTimeout(reboundRef.current);
    };
  }, []);

  return (
    <SceneFrame mood="muted" particles="bokeh">
      <JumpToBottom />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute left-0 top-0 h-64 w-64 bg-gradient-to-br from-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 text-ink/90">
        <motion.div
          className="flex flex-wrap items-start justify-between gap-6"
          initial={prefersReducedMotion ? false : fadeIn.initial}
          animate={prefersReducedMotion ? { opacity: 1 } : fadeIn.animate}
        >
          <div className="max-w-xl rounded-3xl bg-white/55 px-6 py-5 shadow-soft backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.45em] text-ink/50">
              Chapter 1
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-[0.1em] text-ink sm:text-5xl">
              The Quiet Days
            </h1>
            <p className="mt-3 max-w-md font-serif text-base italic text-ink/70 sm:text-lg">
              Some days are calm… but something feels missing.
            </p>
          </div>
          <HUDChip className="bg-white/50 text-ink/70">
            Joy Meter: {joyMeter}%
          </HUDChip>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            className="order-2 flex flex-col gap-6 lg:order-1"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : "initial"}
            whileInView={prefersReducedMotion ? undefined : "animate"}
            viewport={{ once: true, margin: "-60px" }}
          >
            {routineCards.map((card) => {
              const Icon = card.icon;
              const isDismissed = dismissedCards.has(card.id);
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(card.id)}
                  variants={prefersReducedMotion ? undefined : thoughtVariants}
                  whileTap={{ scale: 0.98 }}
                  className="text-left"
                  aria-pressed={clickedCards.has(card.id)}
                >
                <Card
                  className={cn(
                    "mx-auto w-full max-w-[420px] bg-white/55 p-5 shadow-soft transition",
                    "ring-1 ring-accentPink/50 shadow-[0_0_26px_rgba(255,126,182,0.3)] hover:ring-accentPink/80 hover:shadow-[0_0_40px_rgba(255,126,182,0.45)]",
                    "text-ink/70",
                    isDismissed && "opacity-30",
                  )}
                >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink/70 shadow-soft">
                        <Icon className="h-5 w-5" />
                      </span>
                      <motion.div
                        animate={
                          isDismissed
                            ? { opacity: 0, y: 6 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="text-base font-semibold text-ink/80">
                          {card.title}
                        </p>
                        <p className="mt-2 font-serif text-sm italic text-ink/60">
                          {card.caption}
                        </p>
                      </motion.div>
                      {clickedCards.has(card.id) && (
                        <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-white text-accentPink shadow-soft">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="order-1 flex flex-col items-center gap-6 lg:order-2">
            <div className="relative flex min-h-[360px] w-full items-end justify-center">
              <div className="absolute bottom-6 h-12 w-56 rounded-full bg-black/10 blur-xl" />
              <motion.div
                className="relative"
                animate={pauseMotion ? { opacity: 0.9 } : { opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
              <ChibiCozy
                state={jyotiState === "sigh" ? "idle" : jyotiState}
                size={230}
              />
              </motion.div>
              {unlocked && !pauseMotion && (
                <motion.button
                  type="button"
                  onClick={() => router.push("/chapter-2")}
                  className="absolute right-6 bottom-12 flex max-w-[240px] items-center gap-2 rounded-pill bg-white/80 px-3 py-2 text-left shadow-soft"
                  animate={prefersReducedMotion ? { opacity: 1 } : glowPulse.animate}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-accentPink shadow-glow">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-ink/70">
                    Something is coming… click here
                  </span>
                </motion.button>
              )}
            </div>
            <div className="w-full max-w-sm">
              <ProgressBar value={progressValue} />
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink/50">
                {progressValue}% complete
              </p>
              <p className="mt-3 font-serif text-sm italic text-ink/60">
                Magic still hasn’t arrived.
              </p>
            </div>
          </div>
        </div>

        <div className="h-2" />
      </div>
    </SceneFrame>
  );
}
