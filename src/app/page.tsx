"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChibiCozy } from "@/components/characters/chibi-cozy";
import { FilmGrainOverlay } from "@/components/effects/film-grain-overlay";
import { VignetteOverlay } from "@/components/effects/vignette-overlay";
import { Button } from "@/components/ui/button";
import { useSound } from "@/components/effects/sound-provider";
import { withBasePath } from "@/lib/asset";

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  useSound();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [ctaHover, setCtaHover] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, idx) => {
      const seed = idx * 17;
      const pseudo = (value: number) => (Math.sin(value) + 1) / 2;
      const toPct = (value: number) => `${value.toFixed(3)}%`;
      return {
        id: `p-${idx}`,
        x: toPct(pseudo(seed) * 100),
        y: toPct(pseudo(seed + 3.3) * 100),
        size: Number((6 + pseudo(seed + 9.1) * 8).toFixed(2)),
        duration: Number((6 + pseudo(seed + 12.7) * 8).toFixed(2)),
        delay: Number((pseudo(seed + 6.5) * 3).toFixed(2)),
        glyph: idx % 3 === 0 ? "♥" : idx % 3 === 1 ? "✦" : "✧",
      };
    });
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      window.setTimeout(() => {
        setProgress(100);
        setLoading(false);
      }, 0);
      return;
    }
    let current = 0;
    const start = Date.now();
    const totalMs = 4000;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min(100, (elapsed / totalMs) * 100);
      current = next;
      setProgress(current);
      if (elapsed >= totalMs) {
        window.clearInterval(interval);
        setProgress(100);
        window.setTimeout(() => setLoading(false), 200);
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleEnter = () => {
    if (fadeOut) return;
    setFadeOut(true);
    window.setTimeout(() => router.push("/chapter-1"), 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          backgroundImage: `url(${withBasePath("/J1.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          x: prefersReducedMotion ? 0 : mouse.x * 12,
          y: prefersReducedMotion ? 0 : mouse.y * 12,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,126,182,0.25),transparent_55%)]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute text-white/60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: particle.size,
            }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.6 }
                : { y: [0, -14, 0], opacity: [0.3, 0.7, 0.3] }
            }
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {particle.glyph}
          </motion.span>
        ))}
      </div>

      <VignetteOverlay />
      <FilmGrainOverlay />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_55%,rgba(255,255,255,0.5),transparent_55%)]"
        animate={{ opacity: ctaHover ? 0.8 : 0.45 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10 grid min-h-screen grid-rows-[auto,1fr,auto] gap-5 items-center px-3 py-4 text-white">
        <div className="rounded-2xl bg-white/25 px-4 py-2 text-center shadow-soft backdrop-blur-md">
          <p className="font-title text-xl font-bold tracking-[0.28em] text-ink drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)] sm:text-2xl">
            HARDIK & JYOTI SARASWAT
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-20 text-center">
          <motion.div
            className="rounded-2xl bg-white/20 px-4 py-3 shadow-soft backdrop-blur-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          > 
            <h1 className="font-hero text-4xl tracking-[0.06em] text-ink drop-shadow-[0_3px_12px_rgba(255,255,255,0.35)] sm:text-5xl">
              A Story Where Two Hearts Found Home
            </h1>
          </motion.div>
          <motion.div
            className="space-y-2 rounded-3xl bg-white/30 px-3 py-2 font-serif text-base italic text-ink shadow-soft backdrop-blur-md sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p>This isn’t just a website.</p>
            <p>It’s every moment that quietly became forever.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button
              variant="secondary"
              onClick={handleEnter}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              className="shadow-glow"
            >
              Enter Our Story
            </Button>
          </motion.div>
        </div>

 

        <div className="pointer-events-none absolute bottom-24 right-5 z-20 h-24 w-24 md:bottom-28 md:right-10 md:h-36 md:w-36">
          <div className="absolute inset-0 rounded-full border border-white/50 bg-white/10 shadow-soft backdrop-blur-md" />
          <div className="absolute inset-2 rounded-full border border-white/30 bg-white/5" />
          <Image
            src={withBasePath("/K1.png")}
            alt=""
            aria-hidden="true"
            width={600}
            height={600}
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            priority
          />
        </div>
      </div>

      {fadeOut && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-md">
          <div className="w-full max-w-md px-6">
            <div className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-ink/70">
              Loading our story…
            </div>
            <div className="relative h-3 w-full rounded-pill bg-white/80 shadow-soft">
              <motion.div
                className="absolute left-0 top-0 h-3 rounded-pill bg-sky-300/80"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute -top-3 h-8 w-8"
                animate={{ left: `calc(${progress}% - 16px)` }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={withBasePath("/M.png")}
                  alt=""
                  aria-hidden="true"
                  width={408}
                  height={612}
                  className="h-12 w-12 object-contain drop-shadow-md"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
