"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { SceneFrame } from "@/components/effects/scene-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HUDChip } from "@/components/ui/hud-chip";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { blurToSharp, fadeIn, glowPulse, stampPop, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";
import scenes from "@/content/scenes.json";
import { CupSoda, Heart, Motorbike, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type SceneItem = {
  id: string;
  title: string;
  subtitle: string;
  accent: "pink" | "mint" | "lilac" | "sky";
  interactionType: "tap-mug" | "tap-bell" | "drag-scooty" | "hold-heart";
  unlockStampText: string;
  narration: string;
};

type EffectState = {
  steam: boolean;
  glow: boolean;
  petals: boolean;
  bounce: boolean;
  hearts: boolean;
};

const accentMap: Record<SceneItem["accent"], string> = {
  pink: "from-baby-pink/60 via-white/50 to-accentPink/30",
  mint: "from-mint/60 via-white/50 to-accentMint/30",
  lilac: "from-lavender/60 via-white/50 to-accentLilac/30",
  sky: "from-sky/60 via-white/50 to-accentSky/30",
};

const iconMap = {
  "tap-mug": CupSoda,
  "drag-scooty": Motorbike,
  "hold-heart": Heart,
};

const sceneData = scenes as SceneItem[];

export default function ChapterThreePage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set());
  const [effects, setEffects] = useState<Record<string, EffectState>>(() => ({}));
  const [holdProgress, setHoldProgress] = useState<Record<string, number>>(() => ({}));
  const [mugUnlocked, setMugUnlocked] = useState(false);
  const [mugSlide, setMugSlide] = useState<"M1" | "M2" | "M7">("M1");
  const [candleLit, setCandleLit] = useState<Record<string, boolean[]>>(() => ({}));
  const [candleReveal, setCandleReveal] = useState<Record<string, boolean>>(() => ({}));
  const holdTimers = useRef<Record<string, number>>({});
  const holdElapsed = useRef<Record<string, number>>({});
  const scootyLineRef = useRef<HTMLDivElement | null>(null);
  const scootyX = useMotionValue(0);
  const [scootyTrack, setScootyTrack] = useState({ start: 0, end: 0, range: 0 });

  const unlockedCount = unlocked.size;
  const allUnlocked = unlockedCount === sceneData.length;

  useEffect(() => {
    const timers = holdTimers.current;
    return () => {
      Object.values(timers).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const unlockScene = (sceneId: string) => {
    setUnlocked((prev) => new Set(prev).add(sceneId));
  };

  const triggerEffect = (sceneId: string, effect: keyof EffectState, duration: number) => {
    setEffects((prev) => ({
      ...prev,
      [sceneId]: {
        ...(prev[sceneId] ?? {
          steam: false,
          glow: false,
          petals: false,
          bounce: false,
          hearts: false,
        }),
        [effect]: true,
      },
    }));
    window.setTimeout(() => {
      setEffects((prev) => ({
        ...prev,
        [sceneId]: { ...prev[sceneId], [effect]: false },
      }));
    }, duration);
  };

  const handleCandleClick = (sceneId: string, index: number) => {
    if (unlocked.has(sceneId)) return;
    setCandleLit((prev) => {
      const current = prev[sceneId] ?? Array.from({ length: 4 }, () => false);
      if (current[index]) return prev;
      const next = [...current];
      next[index] = true;
      if (next.every(Boolean)) {
        triggerEffect(sceneId, "glow", 1400);
        triggerEffect(sceneId, "petals", 1400);
        setCandleReveal((prev) => ({ ...prev, [sceneId]: true }));
        unlockScene(sceneId);
      }
      return { ...prev, [sceneId]: next };
    });
  };

  useLayoutEffect(() => {
    const measure = () => {
      const track = scootyLineRef.current;
      if (!track) return;
      const width = track.getBoundingClientRect().width;
      const iconSize = 48;
      const scootySize = 48;
      const padding = 6;
      const start = iconSize + padding;
      const end = Math.max(start, width - iconSize - scootySize - padding);
      const range = Math.max(0, end - start);
      setScootyTrack({ start, end, range });
      scootyX.set(0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [scootyX]);

  const handleScootyDrop = (sceneId: string) => {
    if (unlocked.has(sceneId)) return;
    const current = scootyTrack.start + scootyX.get();
    if (current >= scootyTrack.end - 4) {
      scootyX.set(scootyTrack.range);
      triggerEffect(sceneId, "bounce", 700);
      unlockScene(sceneId);
    }
  };

  const handleHoldStart = (sceneId: string) => {
    if (unlocked.has(sceneId)) return;
    setHoldProgress((prev) => ({ ...prev, [sceneId]: 0 }));
    const tick = () => {
      const elapsed = (holdElapsed.current[sceneId] ?? 0) + 60;
      holdElapsed.current[sceneId] = elapsed;
      const progress = Math.min(1, elapsed / 2000);
      setHoldProgress((prev) => ({ ...prev, [sceneId]: progress }));
      if (progress < 1) {
        holdTimers.current[sceneId] = window.setTimeout(tick, 60);
      } else {
        triggerEffect(sceneId, "hearts", 900);
        unlockScene(sceneId);
      }
    };
    holdElapsed.current[sceneId] = 0;
    holdTimers.current[sceneId] = window.setTimeout(tick, 60);
  };

  const handleHoldEnd = (sceneId: string) => {
    if (unlocked.has(sceneId)) return;
    if (holdTimers.current[sceneId]) {
      window.clearTimeout(holdTimers.current[sceneId]);
    }
    holdElapsed.current[sceneId] = 0;
    setHoldProgress((prev) => ({ ...prev, [sceneId]: 0 }));
  };

  const panelVariants = prefersReducedMotion ? fadeIn : blurToSharp;

  return (
    <SceneFrame mood="vibrant" particles="bokeh">
      <JumpToBottom />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
              Chapter 3
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              The Montage of Us
            </h1>
            <p className="mt-3 max-w-xl text-base text-ink-soft sm:text-lg">
              Tap each scene to unlock it.
            </p>
          </div>
          <HUDChip>Memories unlocked {unlockedCount}/4</HUDChip>
        </div>

        <div className="grid gap-6">
          {sceneData.map((scene) => {
            const Icon = iconMap[scene.interactionType as keyof typeof iconMap];
            const isUnlocked = unlocked.has(scene.id);
            const sceneEffects = effects[scene.id] ?? {
              steam: false,
              glow: false,
              petals: false,
              bounce: false,
              hearts: false,
            };

            const isScooty = scene.interactionType === "drag-scooty";
            const isHoldHeart = scene.interactionType === "hold-heart";

            return (
              <motion.div
                key={scene.id}
                variants={panelVariants}
                initial={prefersReducedMotion ? false : panelVariants.initial}
                animate={prefersReducedMotion ? { opacity: 1 } : panelVariants.animate}
                exit={prefersReducedMotion ? undefined : panelVariants.exit}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
                transition={transitions.micro}
              >
                <Card
                  className={cn(
                    "relative grid gap-6 overflow-hidden border border-white/40 p-6 md:grid-cols-[1.2fr_0.8fr]",
                    "bg-gradient-to-br",
                    accentMap[scene.accent],
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ink/60">
                      <Star className="h-4 w-4" />
                      Montage Scene
                    </div>
                    <h2 className="font-display text-2xl text-ink">{scene.title}</h2>
                    <p className="text-sm text-ink-soft">{scene.subtitle}</p>
                    <p className="text-sm text-ink-soft whitespace-pre-line">
                      {scene.narration}
                    </p>
                  </div>

                  <div className="relative flex flex-col items-center justify-center gap-4 rounded-card bg-white/60 p-5 shadow-soft">
                    {!isHoldHeart &&
                      !isScooty &&
                      scene.interactionType !== "tap-mug" &&
                      scene.interactionType !== "tap-bell" && (
                      <motion.div
                        className={cn(
                          "relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-soft",
                          sceneEffects.bounce && "animate-bounce",
                        )}
                        animate={sceneEffects.glow ? glowPulse.animate : undefined}
                      >
                        <Icon className="h-7 w-7 text-ink" />
                        {sceneEffects.glow && (
                          <motion.span
                            className="absolute inset-0 rounded-full border border-accentPink/40"
                            initial={{ opacity: 0.6, scale: 0.8 }}
                            animate={{ opacity: [0.6, 0], scale: [0.8, 1.6] }}
                            transition={{ duration: 1.4 }}
                          />
                        )}
                      </motion.div>
                    )}

                    {scene.interactionType === "tap-mug" && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (!mugUnlocked) {
                            setMugUnlocked(true);
                            setMugSlide("M2");
                            triggerEffect(scene.id, "steam", 1200);
                            unlockScene(scene.id);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            if (!mugUnlocked) {
                              setMugUnlocked(true);
                              setMugSlide("M2");
                              triggerEffect(scene.id, "steam", 1200);
                              unlockScene(scene.id);
                            }
                          }
                        }}
                        className="group relative h-48 w-full overflow-hidden rounded-card shadow-soft"
                        aria-label="Tap to unlock memory"
                      >
                        <Image
                          src="/M1.png"
                          alt=""
                          aria-hidden="true"
                          width={1536}
                          height={1024}
                          className={cn(
                            "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
                            mugSlide === "M1" ? "opacity-100" : "opacity-0",
                          )}
                          draggable={false}
                          priority
                        />
                        <Image
                          src="/M2.png"
                          alt=""
                          aria-hidden="true"
                          width={1536}
                          height={1024}
                          className={cn(
                            "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
                            mugSlide === "M2" ? "opacity-100" : "opacity-0",
                          )}
                          draggable={false}
                        />
                        <Image
                          src="/M7.png"
                          alt=""
                          aria-hidden="true"
                          width={1536}
                          height={1024}
                          className={cn(
                            "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
                            mugSlide === "M7" ? "opacity-100" : "opacity-0",
                          )}
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20" />
                        <span className="pointer-events-none absolute right-3 top-3 rounded-pill bg-white/80 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-ink/70 opacity-0 transition-opacity group-hover:opacity-100">
                          Tap to unlock memory
                        </span>
                        {mugUnlocked && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setMugSlide((prev) => (prev === "M2" ? "M7" : "M2"));
                            }}
                            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink shadow-soft transition hover:scale-105"
                            aria-label="Next memory"
                          >
                            <span className="text-lg leading-none">→</span>
                          </button>
                        )}
                      </div>
                    )}

                    {scene.interactionType === "tap-bell" && (
                      <div className="relative w-full max-w-xs">
                        <motion.div
                          className="relative h-36 w-full overflow-hidden rounded-card bg-gradient-to-b from-black/70 via-black/80 to-black/90 shadow-soft"
                          animate={{ opacity: candleReveal[scene.id] ? 0 : 1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
                          <div className="absolute inset-x-8 bottom-0 h-7 rounded-t-[18px] bg-gradient-to-b from-[#6c4a2b] to-[#3d2a1a]" />
                          <div className="absolute inset-x-12 bottom-7 h-2 rounded-full bg-white/10" />
                          <div className="absolute inset-x-0 bottom-10 flex items-end justify-center gap-4">
                            {[0, 1, 2, 3].map((idx) => {
                              const lit = (candleLit[scene.id] ?? [])[idx] ?? false;
                              return (
                                <button
                                  key={`candle-${scene.id}-${idx}`}
                                  type="button"
                                  onClick={() => handleCandleClick(scene.id, idx)}
                                  className="relative flex h-7 w-6 items-end justify-center"
                                  aria-label="Light candle"
                                >
                                  <span className="absolute bottom-0 h-4 w-5 rounded-sm bg-[#f3e7d7]" />
                                  <span className="absolute bottom-4 h-2 w-[2px] bg-[#c7b29b]" />
                                  <span
                                    className={cn(
                                      "absolute -top-1 h-3 w-3 rounded-full blur-[1px]",
                                      lit ? "bg-amber-300/90" : "bg-transparent",
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "absolute -top-1 h-2 w-2 rounded-full",
                                      lit ? "bg-amber-200" : "bg-transparent",
                                    )}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                        <motion.div
                          className="pointer-events-none absolute inset-0 rounded-card"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: candleReveal[scene.id] ? 1 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Image
                            src="/M6.png"
                            alt=""
                            aria-hidden="true"
                            width={1536}
                            height={1024}
                            className="h-full w-full object-contain"
                            draggable={false}
                          />
                        </motion.div>
                        {!isUnlocked && !candleReveal[scene.id] && (
                          <span className="mt-3 block text-center text-xs uppercase tracking-[0.3em] text-ink/60">
                            Light each candle
                          </span>
                        )}
                      </div>
                    )}

                    {scene.interactionType === "drag-scooty" && (
                      <div ref={scootyLineRef} className="relative -mx-5 h-12 w-[calc(100%+2.5rem)]">
                        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-ink/20" />
                        <div className="group absolute left-0 top-1/2 flex h-25 w-25 -translate-y-1/2 items-center justify-center">
                          <Image
                            src="/M3.png"
                            alt=""
                            aria-hidden="true"
                            width={408}
                            height={612}
                            className="h-full w-full object-contain drop-shadow-md"
                            draggable={false}
                          />
                          <span className="pointer-events-none absolute -bottom-6 whitespace-nowrap rounded-pill bg-white/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/60 opacity-0 transition group-hover:opacity-100">
                            police station
                          </span>
                        </div>
                        <div className="group absolute right-0 top-1/2 flex h-25 w-25 -translate-y-1/2 items-center justify-center overflow-hidden">
                          <Image
                            src="/M4.png"
                            alt=""
                            aria-hidden="true"
                            width={408}
                            height={612}
                            className="h-full w-full object-contain drop-shadow-md "
                            draggable={false}
                          />
                          <span className="pointer-events-none absolute -bottom-6 whitespace-nowrap rounded-pill bg-white/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/60 opacity-0 transition group-hover:opacity-100">
                            house
                          </span>
                        </div>
                        <motion.div
                          className="group absolute top-1/2 flex h-25 w-25 -translate-y-1/2 items-center justify-center"
                          style={{ left: scootyTrack.start, x: scootyX }}
                          drag="x"
                          dragMomentum={false}
                          dragElastic={0}
                          dragConstraints={{ left: 0, right: scootyTrack.range }}
                          dragSnapToOrigin={false}
                          onDragEnd={() => handleScootyDrop(scene.id)}
                          title="Drag along the path"
                        >
                          <Image
                            src="/M.png"
                            alt=""
                            aria-hidden="true"
                            width={408}
                            height={612}
                            className="h-full w-full object-contain drop-shadow-md"
                            draggable={false}
                          />
                          <span className="pointer-events-none absolute -bottom-6 whitespace-nowrap rounded-pill bg-white/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/60 opacity-0 transition group-hover:opacity-100">
                            drag scooty
                          </span>
                        </motion.div>
                      </div>
                    )}

                    {scene.interactionType === "hold-heart" && (
                      <div className="flex w-full flex-col items-center gap-3">
                        {!isUnlocked ? (
                          <>
                            <motion.button
                              type="button"
                              onPointerDown={() => handleHoldStart(scene.id)}
                              onPointerUp={() => handleHoldEnd(scene.id)}
                              onPointerLeave={() => handleHoldEnd(scene.id)}
                              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-soft"
                            >
                              <Heart className="h-7 w-7 text-accentPink" />
                              <svg
                                className="absolute inset-0 h-full w-full"
                                viewBox="0 0 100 100"
                              >
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="44"
                                  stroke="rgba(255,126,182,0.6)"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={276}
                                  strokeDashoffset={276 - (holdProgress[scene.id] ?? 0) * 276}
                                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                                />
                              </svg>
                            </motion.button>
                            <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
                              Hold to unlock
                            </span>
                          </>
                        ) : (
                          <motion.div
                            className="relative -m-1 h-44 w-[calc(100%+0.5rem)] overflow-hidden rounded-card shadow-soft"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Image
                              src="/M5.png"
                              alt=""
                              aria-hidden="true"
                              width={1024}
                              height={1024}
                              className="h-full w-full object-contain"
                              draggable={false}
                            />
                          </motion.div>
                        )}
                      </div>
                    )}

                    {sceneEffects.steam && (
                      <div className="absolute -top-4 flex gap-2">
                        {[0, 1, 2].map((idx) => (
                          <motion.span
                            key={idx}
                            className="h-3 w-3 rounded-full bg-white/70"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], y: [-4, -16, -28] }}
                            transition={{ duration: 1.2, delay: idx * 0.1 }}
                          />
                        ))}
                      </div>
                    )}

                    {sceneEffects.petals && (
                      <div className="absolute -right-2 top-4 flex flex-col gap-2">
                        {[0, 1, 2].map((idx) => (
                          <motion.span
                            key={idx}
                            className="h-3 w-3 rounded-full bg-accentPink/40"
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], x: [0, 10, 18], y: [0, 12, 24] }}
                            transition={{ duration: 1.4, delay: idx * 0.1 }}
                          />
                        ))}
                      </div>
                    )}

                    {sceneEffects.hearts && (
                      <div className="absolute -top-2 right-0 flex gap-2">
                        {[0, 1, 2].map((idx) => (
                          <motion.span
                            key={idx}
                            className="h-3 w-3 rounded-full bg-accentPink/60"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], y: [-6, -18, -30] }}
                            transition={{ duration: 0.9, delay: idx * 0.1 }}
                          />
                        ))}
                      </div>
                    )}

                    {isUnlocked && (
                      <motion.div
                        className="absolute right-4 top-4 rounded-pill bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink shadow-soft"
                        initial={stampPop.initial}
                        animate={stampPop.animate}
                      >
                        {scene.unlockStampText}
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button
            variant="secondary"
            disabled={!allUnlocked}
            onClick={() => router.push("/chapter-4")}
          >
            Next: Our Real Moments
          </Button>
        </div>
      </div>
    </SceneFrame>
  );
}
