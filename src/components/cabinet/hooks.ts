"use client";

import { useEffect, useState } from "react";
import {
  ACTIVITY_EVENT,
  groupActivityByDay,
  loadActivity,
  streakLength,
  type ActivityEntry,
  type DayActivity,
} from "@/lib/activity/log";
import { seedActivityFromProgress } from "@/lib/activity/seed";
import { DEV_TODAY_EVENT, getToday, initDevTodayFromUrl } from "@/lib/dev/today";
import { loadProgress } from "@/lib/course/progress";
import type { AllProgress } from "./agenda";

const EMPTY_PROGRESS: AllProgress = { math: {}, history: {} };

/**
 * Сьогоднішня дата за київським часом. Поки компонент не змонтований —
 * null, щоб серверний і клієнтський рендер збігались.
 */
export function useToday(): string | null {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    initDevTodayFromUrl();
    const read = () => setToday(getToday());
    read();
    window.addEventListener(DEV_TODAY_EVENT, read);
    window.addEventListener("focus", read);
    const id = setInterval(read, 60_000);
    return () => {
      clearInterval(id);
      window.removeEventListener(DEV_TODAY_EVENT, read);
      window.removeEventListener("focus", read);
    };
  }, []);

  return today;
}

/** Підписка на локальні зміни: своя вкладка (подія) + повернення у вкладку + інші вкладки. */
function useLocalSync(read: () => void) {
  useEffect(() => {
    read();
    window.addEventListener(ACTIVITY_EVENT, read);
    window.addEventListener("focus", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, read);
      window.removeEventListener("focus", read);
      window.removeEventListener("storage", read);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Прогрес обох курсів із localStorage. */
export function useProgress(): AllProgress {
  const [progress, setProgress] = useState<AllProgress>(EMPTY_PROGRESS);

  useLocalSync(() =>
    setProgress({ math: loadProgress("math"), history: loadProgress("history") }),
  );

  return progress;
}

export type ActivityState = {
  /** Журнал прочитано з браузера — можна показувати статистику. */
  ready: boolean;
  entries: ActivityEntry[];
  days: Record<string, DayActivity>;
  streak: number;
};

const EMPTY_ACTIVITY: ActivityState = { ready: false, entries: [], days: {}, streak: 0 };

/** Історія роботи учня: коли він що робив. */
export function useActivity(): ActivityState {
  const [state, setState] = useState<ActivityState>(EMPTY_ACTIVITY);

  useEffect(() => {
    seedActivityFromProgress();
  }, []);

  useLocalSync(() => {
    const entries = loadActivity();
    const days = groupActivityByDay(entries);
    setState({ ready: true, entries, days, streak: streakLength(days, getToday()) });
  });

  useEffect(() => {
    const onDevToday = () => {
      const entries = loadActivity();
      const days = groupActivityByDay(entries);
      setState((prev) => ({ ...prev, streak: streakLength(days, getToday()) }));
    };
    window.addEventListener(DEV_TODAY_EVENT, onDevToday);
    return () => window.removeEventListener(DEV_TODAY_EVENT, onDevToday);
  }, []);

  return state;
}
