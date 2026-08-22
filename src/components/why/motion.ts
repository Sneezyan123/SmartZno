"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold,
      rootMargin: "0px 0px -8% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function useStepper(count: number, playing: boolean, stepMs = 1900, lastMs = 3600) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const isLast = step === count - 1;
    const id = setTimeout(() => setStep((s) => (s + 1) % count), isLast ? lastMs : stepMs);
    return () => clearTimeout(id);
  }, [playing, step, count, stepMs, lastMs]);

  return [step, setStep] as const;
}
