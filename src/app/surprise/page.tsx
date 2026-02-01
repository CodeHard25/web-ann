"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SceneFrame } from "@/components/effects/scene-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { stampPop, transitions } from "@/lib/motion";
import { Gift } from "lucide-react";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { useRouter } from "next/navigation";

export default function SurprisePage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const holdTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
    };
  }, []);


  const handleHoldStart = () => {
    if (unlocked) return;
    if (prefersReducedMotion) {
      setProgress(1);
      setUnlocked(true);
      return;
    }

    let elapsed = 0;
    const tick = () => {
      elapsed += 60;
      const nextProgress = Math.min(1, elapsed / 3000);
      setProgress(nextProgress);
      if (nextProgress >= 1) {
        setUnlocked(true);
        return;
      }
      holdTimer.current = window.setTimeout(tick, 60);
    };

    holdTimer.current = window.setTimeout(tick, 60);
  };

  const handleHoldEnd = () => {
    if (unlocked) return;
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    setProgress(0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    handleHoldStart();
  };

  return (
    <SceneFrame mood="dusk" particles="stars" particleDensity={12}>
      <JumpToBottom />
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 py-16">
        <Card className="relative w-full max-w-xl overflow-hidden bg-white/80 p-10 text-center shadow-soft">
          <div className="flex flex-col items-center gap-4">
            <motion.button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerUp={handleHoldEnd}
              onPointerCancel={handleHoldEnd}
              onPointerLeave={handleHoldEnd}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              onTouchCancel={handleHoldEnd}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-soft"
              animate={unlocked ? { y: -18, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Gift className="h-10 w-10 text-accentPink" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="rgba(255,126,182,0.6)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={276}
                  strokeDashoffset={276 - progress * 276}
                  style={{ transition: "stroke-dashoffset 0.06s linear" }}
                />
              </svg>
            </motion.button>
            <div className="rounded-3xl bg-white/60 px-6 py-4 shadow-soft backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.4em] text-ink/60">
                Surprise
              </p>
              <h1 className="mt-2 font-display text-3xl tracking-[0.08em] text-ink">
              Our Next Date Quest
              </h1>
              <p className="mt-2 font-serif text-sm italic text-ink/70">
              Hold gift icon to unlock the surprise plan.
              </p>
            </div>
            {!unlocked && (
              <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
                
              </span>
            )}
          </div>

          {unlocked && (
            <motion.div
              className="mt-8 space-y-4 text-left"
              initial={stampPop.initial}
              animate={stampPop.animate}
              transition={transitions.micro}
            >
              <h2 className="font-display text-2xl text-ink">
                Next Date Quest: Jaipur Edition
              </h2>
              <ul className="space-y-2 font-serif text-base italic text-ink-soft">
                <li>1) A Royal Dine in with Candle Lights </li>
                <li>2) A Super Duper Fun Bowling date </li>
                <li>3) A Long Walk at Kishan Bagh while letting our hearts talk</li>
              </ul>
              <p className="font-serif text-sm italic text-ink/70">
                We don’t need a plan. We need a moment.
              </p>
            </motion.div>
          )}
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => router.push("/finale")}
          >
            Back to finale
          </Button>
          <Button variant="secondary" onClick={() => router.push("/")}
          >
            Replay
          </Button>
        </div>
      </div>
    </SceneFrame>
  );
}
