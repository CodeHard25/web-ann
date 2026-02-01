"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SceneFrame } from "@/components/effects/scene-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { glowPulse, stampPop, transitions } from "@/lib/motion";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

const heading = "Happy Anniversary, Jyoti Saraswat Tyagi!";
const sub = "From your hero of joy — always on your side.";
const message =
  "Thank you for choosing me since the very first day.\nI’ll keep bringing love, care, and fun — one moment at a time.";

export default function FinalePage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [sealed, setSealed] = useState(false);
  const [burst, setBurst] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const heroVideoSrc = useMemo(() => "/Mp4.mp4", []);

  const burstPieces = useMemo(
    () => [
      { x: -70, y: -60, rotate: -12 },
      { x: -40, y: -80, rotate: 18 },
      { x: 0, y: -90, rotate: 6 },
      { x: 40, y: -80, rotate: -10 },
      { x: 70, y: -60, rotate: 12 },
      { x: -60, y: -20, rotate: -22 },
      { x: 60, y: -20, rotate: 22 },
      { x: 0, y: -40, rotate: 0 },
    ],
    [],
  );

  const handleSeal = () => {
    if (sealed) return;
    setSealed(true);
    if (!prefersReducedMotion) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 900);
      window.setTimeout(() => setShowModal(true), 450);
    } else {
      setShowModal(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${heading}\n${sub}\n\n${message}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <SceneFrame mood="sunrise" particles="petals" particleDensity={12}>
      <JumpToBottom />
      <div className="relative min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-20">
          <div className="relative z-0 -mb-12 h-60 w-60 rounded-full border border-white/70 bg-white/35 shadow-soft backdrop-blur-md sm:-mb-16 sm:h-72 sm:w-72 lg:-mb-20 lg:h-80 lg:w-80">
            <div className="absolute inset-2 rounded-full border border-white/40 bg-white/15" />
            <video
              className="absolute inset-0 h-full w-full rounded-full object-contain"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
          </div>

          <Card className="relative z-10 w-full overflow-hidden bg-white/80 p-10 text-center shadow-soft">
            {burst && (
              <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2">
                {burstPieces.map((piece, index) => (
                  <motion.span
                    key={`burst-${index}`}
                    className="absolute h-3 w-3 rounded-full bg-accentPink/70"
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: piece.x,
                      y: piece.y,
                      scale: [0.8, 1.1, 0.7],
                      rotate: piece.rotate,
                    }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
            )}

            <motion.h1
              className="mx-auto max-w-2xl font-display text-4xl tracking-[0.08em] text-ink sm:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitions.major}
            >
              {heading}
            </motion.h1>
            <p className="mt-3 font-serif text-base italic text-ink/70 sm:text-lg">
              {sub}
            </p>
            <p className="mt-6 whitespace-pre-line font-serif text-base italic text-ink/75">
              {message}
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Button variant="primary" onClick={handleSeal}>
                Seal this moment
              </Button>
              {sealed && (
                <motion.div
                  className="flex items-center gap-2 rounded-pill bg-white/70 px-3 py-1 shadow-soft"
                  initial={stampPop.initial}
                  animate={stampPop.animate}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-glow">
                    <Heart className="h-5 w-5 text-accentPink" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ink/70">
                    Sealed
                  </span>
                </motion.div>
              )}
            </div>

            {!sealed && (
              <motion.div
                className="absolute right-6 top-6 h-2 w-2 rounded-full bg-white shadow-glow"
                animate={prefersReducedMotion ? { opacity: 1 } : glowPulse.animate}
              />
            )}
          </Card>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-4 text-center">
          <h2 className="font-display text-2xl text-ink">{heading}</h2>
          <p className="font-serif text-sm italic text-ink/70">{sub}</p>
          <p className="whitespace-pre-line font-serif text-base italic text-ink/75">
            {message}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? "Copied" : "Copy to clipboard"}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/")}
            >
              Replay
            </Button>
          </div>
        </div>
      </Modal>
    </SceneFrame>
  );
}
