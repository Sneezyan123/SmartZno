"use client";

import { useEffect, useState } from "react";
import {
  DEV_TODAY_EVENT,
  getToday,
  initDevTodayFromUrl,
  isDevToday,
  setDevToday,
  stubSeptemberFirst,
} from "@/lib/dev/today";
import { formatDayMonth } from "@/lib/schedule/dates";

/** Тонка смужка в кабінеті — лише в dev або коли заглушка вже увімкнена. */
export function DevTodayBar() {
  const [on, setOn] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    initDevTodayFromUrl();
    const read = () => {
      setOn(isDevToday());
      setShow(
        process.env.NODE_ENV === "development" ||
          isDevToday() ||
          new URLSearchParams(window.location.search).get("devToday") === "1",
      );
    };
    read();
    window.addEventListener(DEV_TODAY_EVENT, read);
    return () => window.removeEventListener(DEV_TODAY_EVENT, read);
  }, []);

  if (!show) return null;

  const stub = stubSeptemberFirst();
  const envLocked = process.env.NEXT_PUBLIC_DEV_TODAY === "1";

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-amber/45 bg-amber-soft/50 px-4 py-2.5 text-sm">
        <span className="text-forest/75">
          <span className="font-semibold text-ink">Тест-дата</span>
          {" — "}
          {on ? `ніби сьогодні ${formatDayMonth(stub)}` : "реальна дата системи"}
          {envLocked && on && (
            <span className="ml-1 text-xs text-forest/45">(NEXT_PUBLIC_DEV_TODAY)</span>
          )}
        </span>
        <button
          type="button"
          disabled={envLocked}
          onClick={() => setDevToday(!on)}
          className={`rounded-full px-3.5 py-1 text-xs font-bold transition disabled:cursor-default disabled:opacity-60 ${
            on ? "bg-amber text-ink" : "border border-amber/60 text-forest/70"
          }`}
        >
          {on ? "1 вересня ✓" : "Начебто 1 вересня"}
        </button>
      </div>
    </div>
  );
}
