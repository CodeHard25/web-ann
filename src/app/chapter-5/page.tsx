"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SceneFrame } from "@/components/effects/scene-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChibiHero } from "@/components/characters/chibi-hero";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { fadeIn, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const segments = [
  "Jyoti Saraswat,",
  "You didn’t just become part of my life.\nYou became the center of it.",
  "I think about you in ways I don’t explain out loud.\nIn small decisions.\nIn quiet moments.\nIn everything I do without even trying.",
  "I want to make you feel loved on special days — and even more on ordinary ones.\nNot just with big plans, but with consistency.\nWith showing up.\nWith remembering the little things that matter to you.",
  "I want to be the person you feel safe with.\nThe one you turn to when you’re tired, happy, confused, or silent.\nThe one who notices when your mood changes.\nThe one who adjusts his world so you don’t have to.",
  "I care about you deeply — not in a loud way, but in a way that stays.\nIn checking on you.\nIn protecting your peace.\nIn making sure you never feel alone, even when we’re apart.",
  "I choose you every day.\nNot because it’s easy — but because it’s you.\nYou are my priority in ways I don’t need to prove, only live.",
  "I want to celebrate you, support you, spoil you with attention, and remind you — again and again — that you matter to me more than anything else.\nNot just today.\nNot just on special occasions.\nBut always.",
  "You are not just someone I love.\nYou are someone I commit to — with effort, care, and intention.",
  "And I’m not going anywhere.",
];

const promises = [
  "I’ll protect your peace.",
  "I’ll show up, especially on hard days.",
  "I’ll keep choosing you — with effort, not just words.",
  "I’ll celebrate you — your wins, your growth, your being.",
  "I’ll love you — in all the ways you need to be loved.",
  "I'll keep showing how obssessed I am with you with all of me and my efforts.",
];

export default function ChapterFivePage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const isLast = currentIndex === segments.length - 1;

  const handleContinue = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const revealedSegments = useMemo(() => {
    return segments.slice(0, currentIndex);
  }, [currentIndex]);

  return (
    <SceneFrame mood="dusk" particles="stars" particleDensity={10}>
      <JumpToBottom />
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="rounded-3xl bg-white/55 px-6 py-5 shadow-soft backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.45em] text-ink/60">
              Chapter 5
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-[0.08em] text-ink sm:text-5xl">
              The Letter I Owe You
            </h1>
          </div>
          <motion.div initial={fadeIn.initial} animate={fadeIn.animate}>
            <ChibiHero size={90} state="hero" />
          </motion.div>
        </div>

        <Card className="relative overflow-hidden bg-white/80 p-8 shadow-soft">
          <div className="space-y-5 font-serif text-lg italic leading-relaxed text-ink">
            {revealedSegments.map((segment, index) => (
              <p key={segments[index]}>{segment}</p>
            ))}
            <p
              key={`segment-${currentIndex}`}
              className={cn(!prefersReducedMotion && "typewriter")}
            >
              {segments[currentIndex]}
            </p>
          </div>

          {!isLast && (
            <div className="mt-8 flex justify-end">
              <Button variant="secondary" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          )}

          {isLast && (
            <motion.div
              className="mt-8 space-y-4"
              initial={prefersReducedMotion ? false : fadeIn.initial}
              animate={prefersReducedMotion ? { opacity: 1 } : fadeIn.animate}
              transition={transitions.micro}
            >
              <h2 className="font-display text-2xl text-ink">Promises I will keep</h2>
              <ul className="space-y-2 font-serif text-base italic text-ink-soft">
                {promises.map((promise) => (
                  <li key={promise}>• {promise}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setShowSecret((prev) => !prev)}
                className="flex items-center gap-3 text-left"
              >
                <ChibiHero size={70} state="idle" />
                <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  writer - Your Cheenu
                </span>
              </button>
              {showSecret && (
                <p className="font-serif text-sm italic text-ink-soft">
                  And yes — your smile is still my favorite place.
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => router.push("/")}
                >
                  Replay story
                </Button>
                <Button variant="secondary" onClick={() => router.push("/surprise")}
                >
                  Open surprise
                </Button>
                <Button variant="secondary" onClick={() => router.push("/finale")}
                >
                  One last scene
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
        <style jsx>{`\n          .typewriter {\n            display: inline-block;\n            overflow: hidden;\n            animation: type-reveal 1.6s steps(40) both;\n          }\n          @keyframes type-reveal {\n            from {\n              clip-path: inset(0 100% 0 0);\n            }\n            to {\n              clip-path: inset(0 0 0 0);\n            }\n          }\n        `}</style>
      </div>
    </SceneFrame>
  );
}
