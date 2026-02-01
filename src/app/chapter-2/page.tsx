"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SceneFrame } from "@/components/effects/scene-frame";
import { FilmGrainOverlay } from "@/components/effects/film-grain-overlay";
import { VignetteOverlay } from "@/components/effects/vignette-overlay";
import { ChibiCozy } from "@/components/characters/chibi-cozy";
import { ChibiHero } from "@/components/characters/chibi-hero";
import { Button } from "@/components/ui/button";
import { HUDChip } from "@/components/ui/hud-chip";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { glowPulse, pageEnter, pageExit, transitions } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/lib/asset";

export default function ChapterTwoPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [spotlight, setSpotlight] = useState(prefersReducedMotion);
  const [wave, setWave] = useState(false);
  const [sparkles, setSparkles] = useState(false);
  const [desaturated, setDesaturated] = useState(!prefersReducedMotion);
  const [jyotiReact, setJyotiReact] = useState(prefersReducedMotion);
  const [heroState, setHeroState] = useState<"arrival" | "pose">(
    prefersReducedMotion ? "pose" : "arrival",
  );
  const [heroEnter, setHeroEnter] = useState(prefersReducedMotion);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noAnchored, setNoAnchored] = useState(true);
  const [textHidden, setTextHidden] = useState(false);
  const [mergePhase, setMergePhase] = useState<"idle" | "approach" | "merge">("idle");
  const [mergeGlow, setMergeGlow] = useState(false);
  const [showP1, setShowP1] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [joyBoost, setJoyBoost] = useState(false);
  const [joyValue, setJoyValue] = useState(prefersReducedMotion ? 60 : 12);
  const [soothe, setSoothe] = useState(false);
  const arrivalTimersRef = useRef<number[]>([]);

  const relocateNo = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const padding = 24;
    const maxX = Math.max(padding, rect.width - 160);
    const maxY = Math.max(padding, rect.height - 120);
    const nextX = Math.random() * (maxX - padding) + padding;
    const nextY = Math.random() * (maxY - padding) + padding;
    setNoPos({ x: nextX, y: nextY });
    setNoAnchored(false);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => setStep(1), 400),
      window.setTimeout(() => setStep(2), 1000),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [prefersReducedMotion]);

  useEffect(() => {
    const timersRef = arrivalTimersRef;
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);


  const reduced = prefersReducedMotion;
  const effectiveStep = reduced ? 2 : step;
  const effectiveSpotlight = reduced ? true : spotlight;
  const effectiveDesaturated = reduced ? false : desaturated;
  const effectiveHeroEnter = reduced ? true : heroEnter;
  const effectiveHeroState = reduced ? "pose" : heroState;
  const effectiveJyotiReact = reduced ? true : jyotiReact;
  const effectiveCtaVisible = reduced ? ctaVisible : ctaVisible;
  const effectiveJoyValue = reduced ? 60 : joyValue;
  const effectiveSoothe = reduced ? true : soothe;
  const effectiveTextHidden = reduced ? false : textHidden;

  const line1Visible = effectiveStep >= 1;
  const line2Visible = effectiveStep >= 2;

  const sceneStyle = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, #B9B3FF 0%, #FFB7D5 45%, #A7D8FF 100%)",
    }),
    [],
  );

  const shakeMotion = shake
    ? { x: [0, -4, 4, -2, 2, 0], y: [0, 2, -2, 2, 0] }
    : { x: 0, y: 0 };

  const triggerArrivalSequence = () => {
    if (heroEnter) return;
    setSoothe(true);
    if (prefersReducedMotion) {
      setHeroEnter(true);
      setHeroState("pose");
      setSpotlight(true);
      setWave(false);
      setSparkles(false);
      setDesaturated(false);
      setCtaVisible(true);
      relocateNo();
      setNoAnchored(true);
      setShowChoices(true);
      setJyotiReact(true);
      return;
    }
    setFlash(true);
    setShake(true);
    setHeroEnter(true);
    setHeroState("arrival");
    setSpotlight(true);
    setWave(true);
    setSparkles(true);
    setJyotiReact(true);
    const timers: number[] = [
      window.setTimeout(() => setFlash(false), 120),
      window.setTimeout(() => setShake(false), 180),
      window.setTimeout(() => setWave(false), 900),
      window.setTimeout(() => setSparkles(false), 900),
      window.setTimeout(() => setDesaturated(false), 800),
      window.setTimeout(() => setCtaVisible(true), 1200),
      window.setTimeout(() => {
        relocateNo();
        setNoAnchored(true);
        setShowChoices(true);
      }, 4200),
      window.setTimeout(() => setHeroState("pose"), 1400),
    ];
    arrivalTimersRef.current.push(...timers);
  };

  const handleCta = () => {
    setTextHidden(true);
    setShowChoices(false);
    setJyotiReact(true);
    setJoyBoost(true);
    setJoyValue(60);
    setMergePhase("approach");
    window.setTimeout(() => {
      setMergePhase("merge");
      setMergeGlow(true);
      window.setTimeout(() => setMergeGlow(false), 900);
      window.setTimeout(() => setShowP1(true), 500);
      window.setTimeout(() => router.push("/chapter-3"), 2400);
    }, 1200);
  };

  return (
    <SceneFrame mood="muted" particles="stars" className="text-ink">
      <JumpToBottom />
      <motion.div className="relative" initial={pageExit} animate={pageEnter} exit={pageExit}>
        <motion.div
          ref={containerRef}
          className="relative min-h-screen overflow-hidden"
          animate={shakeMotion}
          transition={{ duration: 0.2 }}
          style={sceneStyle}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              filter: effectiveDesaturated ? "saturate(0.2) contrast(0.9)" : "saturate(1) contrast(1)",
            }}
            transition={{ duration: 1.2 }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity: effectiveSpotlight ? 1 : 0,
              scale: effectiveSpotlight ? 1.1 : 0.6,
            }}
            transition={{ duration: 1.1 }}
            style={{
              background:
                "radial-gradient(circle at 78% 60%, rgba(255,255,255,0.55), transparent 60%)",
              filter: "blur(10px)",
            }}
          />

          {wave && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0.8, 0], scale: 1.6 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background:
                  "radial-gradient(circle at 78% 60%, rgba(255,183,213,0.6), transparent 60%)",
                filter: "blur(16px)",
              }}
            />
          )}

          {flash && (
            <div className="pointer-events-none absolute inset-0 bg-white/25" />
          )}

          {sparkles && (
            <div className="pointer-events-none absolute right-24 top-1/2 flex gap-2">
              {[0, 1, 2].map((idx) => (
                <motion.span
                  key={`sparkle-${idx}`}
                  className="h-2 w-2 rounded-full bg-white/80 shadow-glow"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [-6, -18, -30] }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
              ))}
            </div>
          )}

          {mergeGlow && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.9),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,126,182,0.5),transparent_60%)]" />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-3">
                {["♥", "✦", "❤", "✧", "★"].map((symbol, index) => (
                  <motion.span
                    key={`merge-symbol-${index}`}
                    className="text-2xl text-accentPink/80"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: [-10, -40, -70] }}
                    transition={{ duration: 1.2, delay: index * 0.1 }}
                  >
                    {symbol}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          <VignetteOverlay />
          <FilmGrainOverlay />

          <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-16">
            {!effectiveTextHidden && (
              <div className="max-w-[560px] space-y-4 rounded-3xl bg-white/55 px-6 py-5 shadow-soft backdrop-blur-md">
              <motion.p
                className="text-xs uppercase tracking-[0.45em] text-ink/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transitions.micro}
              >
                Chapter 2
              </motion.p>
              <motion.h1
                className="font-display text-4xl tracking-[0.08em] text-ink sm:text-5xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transitions.major}
              >
                A Shift in the Air
              </motion.h1>
              <motion.p
                className="max-w-[520px] font-serif text-base italic text-ink/70 sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: line1Visible ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              >
                I didn’t come to change your world.
              </motion.p>
              <motion.p
                className="max-w-[520px] font-serif text-base italic text-ink/70 sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: line2Visible ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              >
                I came to share it — and fill it with joy.
              </motion.p>
              </div>
            )}

          <div className="relative flex min-h-[320px] w-full items-end justify-between gap-4 pt-10 sm:min-h-[380px] md:min-h-[460px] md:block">
            <motion.div
              className="relative flex flex-1 items-end justify-start md:absolute md:bottom-0 md:left-0 md:justify-start"
              animate={{
                x:
                  !isMobile
                    ? mergePhase === "approach"
                      ? 140
                      : mergePhase === "merge"
                        ? 220
                        : joyBoost
                          ? 10
                          : 0
                    : 0,
                y:
                  isMobile && mergePhase === "approach"
                    ? 70
                    : isMobile && mergePhase === "merge"
                      ? 120
                      : 0,
                scale: mergePhase === "approach" ? 1.08 : mergePhase === "merge" ? 1.22 : 1,
                rotate: effectiveJyotiReact ? -4 : 0,
                opacity: showP1 ? 0 : 1,
              }}
              transition={{ duration: mergePhase === "idle" ? 0.4 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -bottom-4 left-6 h-10 w-40 rounded-full bg-black/15 blur-xl" />
              <ChibiCozy
                state={effectiveJyotiReact ? "blush" : "idle"}
                size={isMobile ? 150 : 210}
                imageSrc={
                  mergePhase === "approach" || mergePhase === "merge"
                    ? "/G3.png"
                    : effectiveSoothe
                      ? "/G2.png"
                      : "/G1.png"
                }
                className="scale-90 md:scale-100"
              />
            </motion.div>

            <motion.div
              className="relative flex flex-1 flex-col items-end gap-4 md:absolute md:bottom-0 md:right-0 md:items-end"
              animate={{
                x:
                  !isMobile
                    ? mergePhase === "approach"
                      ? -140
                      : mergePhase === "merge"
                        ? -220
                        : joyBoost
                          ? -10
                          : 0
                    : 0,
                y:
                  isMobile && mergePhase === "approach"
                    ? -70
                    : isMobile && mergePhase === "merge"
                      ? -120
                      : 0,
                scale: mergePhase === "approach" ? 1.08 : mergePhase === "merge" ? 1.22 : 1,
                opacity: showP1 ? 0 : 1,
              }}
              transition={{ duration: mergePhase === "idle" ? 0.4 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ x: 40, y: -60, opacity: 0 }}
                animate={
                  effectiveHeroEnter
                    ? { x: 0, y: 0, opacity: 1 }
                    : { x: 40, y: -60, opacity: 0 }
                }
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <div className="absolute -bottom-4 right-8 h-10 w-40 rounded-full bg-black/15 blur-xl" />
                  <ChibiHero
                    state={effectiveHeroState === "pose" ? "hero" : "idle"}
                    size={isMobile ? 160 : 220}
                    className="scale-90 md:scale-100"
                  />
                </div>
              </motion.div>
              {!effectiveTextHidden && (
                <motion.div
                  className="self-end"
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    joyBoost
                      ? { opacity: 1, y: -6 }
                      : { opacity: 0, y: 8 }
                  }
                  transition={transitions.micro}
                >
                  <HUDChip>Joy Meter: {effectiveJoyValue}%</HUDChip>
                </motion.div>
              )}
            </motion.div>

            {showP1 && (
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
              <Image
                src={withBasePath("/P1.png")}
                alt=""
                aria-hidden="true"
                  width={408}
                  height={612}
                  className="w-[240px] select-none md:w-[300px]"
                  priority
                />
              </motion.div>
            )}
          </div>

          {!effectiveTextHidden && (
            <div className="flex flex-wrap justify-center gap-3">
              {line2Visible && !effectiveSoothe && (
                <Button
                  variant="secondary"
                  onClick={triggerArrivalSequence}
                  className="border-white/70 bg-white/60 text-ink"
                >
                  Make her worries go away
                </Button>
              )}
            </div>
          )}

          {!effectiveTextHidden && effectiveCtaVisible && (
            <motion.div
              className="pointer-events-none absolute bottom-56 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-[28px] bg-white/85 px-5 py-3 text-center text-[11px] uppercase tracking-[0.35em] text-ink/70 shadow-soft md:bottom-44 md:left-auto md:right-6 md:translate-x-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitions.micro}
            >
              <span className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 rounded-sm bg-white/85" />
              <span className="absolute -right-3 bottom-4 h-3 w-3 rounded-full bg-white/70" />
              <span className="absolute -right-6 bottom-2 h-2.5 w-2.5 rounded-full bg-white/60" />
              Take my hand
            </motion.div>
          )}

          {!effectiveTextHidden && effectiveCtaVisible && showChoices && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 md:bottom-28 md:left-6 md:translate-x-0">
                <div className="pointer-events-auto flex flex-col items-center gap-3 md:items-start">
                  <Button
                    variant="secondary"
                    onClick={handleCta}
                    className="shadow-glow ring-1 ring-white/70"
                  >
                    Yes
                  </Button>
                  {noAnchored && (
                    <motion.button
                      type="button"
                      onMouseEnter={relocateNo}
                      onMouseMove={relocateNo}
                      onPointerEnter={relocateNo}
                      onFocus={relocateNo}
                      className="rounded-pill border border-white/60 bg-white/60 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink shadow-soft"
                    >
                      No
                    </motion.button>
                  )}
                </div>
              </div>
              {!noAnchored && (
                <motion.button
                  type="button"
                  onMouseEnter={relocateNo}
                  onMouseMove={relocateNo}
                  onPointerEnter={relocateNo}
                  onFocus={relocateNo}
                  className="pointer-events-auto absolute rounded-pill border border-white/60 bg-white/60 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink shadow-soft"
                  style={{ left: noPos.x, top: noPos.y }}
                >
                  No
                </motion.button>
              )}
            </div>
          )}

          {effectiveSpotlight && (
            <motion.div
              className="pointer-events-none absolute right-8 top-10 flex items-center gap-2 rounded-pill bg-white/70 px-3 py-2 shadow-soft"
              animate={prefersReducedMotion ? { opacity: 1 } : glowPulse.animate}
            >
              <span className="h-2 w-2 rounded-full bg-white shadow-glow" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink/70">
                Something is shifting
              </span>
            </motion.div>
          )}
          </div>
        </motion.div>
      </motion.div>
    </SceneFrame>
  );
}
