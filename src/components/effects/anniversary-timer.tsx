"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Countdown = {
  minutes: number;
  seconds: number;
  label: string;
};

const getNextTarget = () => {
  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, 1, 2, 0, 0, 0);
  if (now.getTime() > target.getTime()) {
    target = new Date(year + 1, 1, 2, 0, 0, 0);
  }
  return target;
};

export function AnniversaryTimer({ className }: { className?: string }) {
  const [countdown, setCountdown] = useState<Countdown>({
    minutes: 0,
    seconds: 0,
    label: "to 2 Feb",
  });

  useEffect(() => {
    const target = getNextTarget();
    const tick = () => {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setCountdown({
        minutes,
        seconds,
        label: "to 2 Feb",
      });
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-pill bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-ink/70 shadow-soft backdrop-blur-md",
        className,
      )}
    >
      <span>{countdown.minutes}m</span>{" "}
      <span>{countdown.seconds}s</span>{" "}
      <span className="text-ink/50">{countdown.label}</span>
    </div>
  );
}
