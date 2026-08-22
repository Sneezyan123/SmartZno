import type { HomeworkLevel } from "./types";

export type CourseProfile = {
  trackId: string;
  level: HomeworkLevel;
  startDate: string;
  startLessonId: string;
  lastHwAt?: string;
  lastTheoryAt?: string;
  curatorChecked: Record<string, boolean>;
  mistakes: { lessonId: string; itemId: string; reviewLessonId?: string; at: string }[];
  mockStartedAt?: Record<string, string>;
  coins: number;
  streak: number;
  cohortMode: boolean;
  crossSellDismissed?: boolean;
};

const PROFILE_KEY = "smartzno-math-nmt-profile";

export const defaultProfile = (): CourseProfile => ({
  trackId: "g11-9",
  level: "B",
  startDate: new Date().toISOString(),
  startLessonId: "m1-01",
  curatorChecked: {},
  mistakes: [],
  mockStartedAt: {},
  coins: 0,
  streak: 0,
  cohortMode: true,
});

export function loadProfile(): CourseProfile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile();
    return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: CourseProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateProfile(patch: Partial<CourseProfile>): CourseProfile {
  const next = { ...loadProfile(), ...patch };
  saveProfile(next);
  void import("./progress").then((m) => m.syncProgressToMongo(m.loadProgress(), next));
  return next;
}

export function addMistake(lessonId: string, itemId: string, reviewLessonId?: string) {
  const p = loadProfile();
  const mistakes = p.mistakes.filter((m) => !(m.lessonId === lessonId && m.itemId === itemId));
  mistakes.unshift({
    lessonId,
    itemId,
    reviewLessonId,
    at: new Date().toISOString(),
  });
  return updateProfile({ mistakes: mistakes.slice(0, 80) });
}
