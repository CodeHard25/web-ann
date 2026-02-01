"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SceneFrame } from "@/components/effects/scene-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JumpToBottom } from "@/components/ui/jump-to-bottom";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/asset";
import cardsData from "@/content/chapter4.json";
import { useRouter } from "next/navigation";

type MediaItem = {
  type: "image" | "video";
  src: string;
};

type MemoryCard = {
  id: string;
  title: string;
  lines: string[];
  media: MediaItem[];
};

const cards = cardsData as MemoryCard[];

export default function ChapterFourPage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playedVideos, setPlayedVideos] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [winToast, setWinToast] = useState(false);
  const [allowNext, setAllowNext] = useState(false);

  const orderedCards = useMemo(() => cards, []);
  const totalVideos = useMemo(
    () => cards.flatMap((card) => card.media.filter((m) => m.type === "video")).length,
    [],
  );

  const showToast = (message: string, duration = 2600) => {
    setToast(message);
    window.setTimeout(() => setToast(null), duration);
  };

  const handleVideoPlay = (src: string) => {
    setPlayedVideos((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      if (next.size === totalVideos) {
        setWinToast(true);
        showToast("Very Well done my Love!!!!, You're the best. You Won a surprise Gift", 5200);
        setAllowNext(true);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (allowNext) {
      router.push("/chapter-5");
      return;
    }
    const remaining = Math.max(0, totalVideos - playedVideos.size);
    if (remaining > 0) {
      const noun = remaining === 1 ? "video is" : "videos are";
      showToast(`${remaining} ${noun} still waiting to be played`);
      setAllowNext(true);
      return;
    }
    router.push("/chapter-5");
  };

  return (
    <SceneFrame mood="sunrise" particles="petals">
      <JumpToBottom />
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35), transparent 45%), linear-gradient(120deg, rgba(182,155,120,0.18), rgba(255,255,255,0))",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.2),transparent_55%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-xl rounded-3xl bg-white/55 px-6 py-5 shadow-soft backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.45em] text-ink/60">
              Chapter 4
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-[0.08em] text-ink sm:text-5xl">
              Everything You Gave Me Without Trying
            </h1>
            <p className="mt-3 max-w-md font-serif text-base italic text-ink/70 sm:text-lg">
              Not memories. Feelings that stayed.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {orderedCards.map((card) => {
            const isActive = activeId === card.id;
            const mediaCount = card.media.length;
            return (
              <motion.div
                key={card.id}
                className={cn(
                  "cursor-pointer",
                  isActive && "md:col-span-2",
                )}
                initial={prefersReducedMotion ? false : fadeIn.initial}
                animate={prefersReducedMotion ? { opacity: 1 } : fadeIn.animate}
                exit={prefersReducedMotion ? undefined : fadeIn.exit}
                onClick={() => setActiveId(isActive ? null : card.id)}
              >
                <Card
                  className={cn(
                    "relative overflow-hidden bg-white/80 p-6 shadow-soft transition",
                    "hover:-translate-y-1 hover:shadow-glow",
                  )}
                >
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl text-ink">
                      {card.title}
                    </h2>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="space-y-2 font-serif text-base italic text-ink/70"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.6 }}
                        >
                          {card.lines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    className={cn(
                      "mt-5 grid gap-3",
                      mediaCount === 1 && "grid-cols-1",
                      mediaCount === 2 && "grid-cols-2",
                      mediaCount >= 3 && "grid-cols-2",
                    )}
                  >
                    {card.media.map((item, index) => {
                      if (item.type === "video") {
                        return (
                          <div
                            key={`${card.id}-video-${index}`}
                            className="relative overflow-hidden rounded-card border-2 border-white bg-white/90 shadow-[0_24px_45px_rgba(31,35,48,0.24)]"
                          >
                            <div className="pointer-events-none absolute left-5 top-2 h-3 w-14 -rotate-6 rounded-sm bg-white/80 shadow-soft" />
                            <div className="pointer-events-none absolute right-5 top-2 h-3 w-14 rotate-6 rounded-sm bg-white/80 shadow-soft" />
                            <video
                              src={withBasePath(item.src)}
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full"
                              onMouseEnter={(event) => {
                                if (!prefersReducedMotion) {
                                  void event.currentTarget.play();
                                }
                              }}
                              onMouseLeave={(event) => {
                                event.currentTarget.pause();
                                event.currentTarget.currentTime = 0;
                              }}
                              onClick={(event) => {
                                if (event.currentTarget.paused) {
                                  void event.currentTarget.play();
                                } else {
                                  event.currentTarget.pause();
                                }
                              }}
                              onPlay={(event) => handleVideoPlay(event.currentTarget.currentSrc)}
                            />
                          </div>
                        );
                      }
                      return (
                        <div
                          key={`${card.id}-img-${index}`}
                          className="relative overflow-hidden rounded-card border-2 border-white bg-white/90 shadow-[0_24px_45px_rgba(31,35,48,0.24)]"
                        >
                          <div className="absolute left-5 top-2 h-3 w-14 -rotate-6 rounded-sm bg-white/80 shadow-soft" />
                          <div className="absolute right-5 top-2 h-3 w-14 rotate-6 rounded-sm bg-white/80 shadow-soft" />
                          <Image
                            src={withBasePath(item.src)}
                            alt=""
                            aria-hidden="true"
                            width={1400}
                            height={900}
                            loading="lazy"
                            className="h-auto w-full object-contain"
                          />
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col items-end gap-3">
          <p className="max-w-xl text-right text-xs uppercase tracking-[0.3em] text-ink/60">
            Let’s See how is your memory working these days. in the image collages 12 videos are distributed
            if you can play all 12 videos by clicking them then you will win a surprise gift
          </p>
          <Button variant="secondary" onClick={handleNext}>
            Next: The Letter I Owe You
          </Button>
        </div>
      </div>

      {toast && !winToast && (
        <motion.div
          className="fixed bottom-20 right-6 z-50 rounded-pill bg-white/90 px-4 py-3 text-xs uppercase tracking-[0.3em] text-ink/80 shadow-soft"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
        >
          {toast}
        </motion.div>
      )}

      {winToast && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[90vw] max-w-4xl rounded-3xl bg-white/95 px-10 py-10 text-center shadow-glow"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              type="button"
              onClick={() => setWinToast(false)}
              className="absolute right-3 top-3 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink/70 shadow-soft transition hover:text-ink"
              aria-label="Close celebration"
            >
              Close
            </button>
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, idx) => {
                const icons = ["🎉", "✨", "💖", "🎈", "💫", "🎊", "💗", "🌟"];
                const icon = icons[idx % icons.length];
                const left = 5 + (idx * 7) % 90;
                const delay = (idx % 6) * 0.2;
                return (
                  <motion.span
                    key={`celebrate-${idx}`}
                    className="absolute text-2xl"
                    style={{ left: `${left}%`, top: "-10%" }}
                    animate={{ y: ["0%", "120%"], rotate: [0, 10, -10, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3.6, repeat: Infinity, delay }}
                  >
                    {icon}
                  </motion.span>
                );
              })}
            </div>
            <div className="mx-auto mb-5 h-56 w-56 rounded-3xl bg-white/70 shadow-soft sm:h-72 sm:w-72">
              <Image
                src={withBasePath("/S1.jpeg")}
                alt=""
                aria-hidden="true"
                width={512}
                height={512}
                className="h-full w-full rounded-3xl object-contain"
              />
            </div>
            <h3 className="font-display text-2xl text-ink">
              Very Well done my Love!!!!
            </h3>
            <p className="mt-2 font-serif text-base italic text-ink/70">
              You’re the best. You won a surprise gift.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {["💗", "💞", "💝"].map((icon) => (
                <span key={icon} className="text-3xl">{icon}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </SceneFrame>
  );
}
