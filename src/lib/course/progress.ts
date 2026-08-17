import { getStudentToken } from "@/lib/crm";
import { loadProfile, type CourseProfile } from "./profile";

export type LessonProgress = {
  theoryDone?: boolean;
  cardsSeen: string[];
  homeworkAnswers: Record<string, unknown>;
  homeworkChecked?: boolean;
  homeworkScore?: { correct: number; total: number; nmtGot?: number; nmtMax?: number };
  mockStartedAt?: string;
  mockTimedOut?: boolean;
  curatorChecked?: boolean;
  updatedAt: string;
};

export type CourseProgress = Record<string, LessonProgress>;

const STORAGE_KEY = "smartzno-math-nmt-progress";

const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL || process.env.CRM_API_URL || "http://localhost:8000";

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSync: CourseProgress | null = null;

export function loadProgress(): CourseProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CourseProgress;
  } catch {
    return {};
  }
}

export function saveProgress(progress: CourseProgress, opts?: { syncDebounceMs?: number }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  const debounceMs = opts?.syncDebounceMs ?? 0;
  if (debounceMs <= 0) {
    if (syncTimer) {
      clearTimeout(syncTimer);
      syncTimer = null;
    }
    pendingSync = null;
    void syncProgressToMongo(progress);
    return;
  }
  pendingSync = progress;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const payload = pendingSync;
    pendingSync = null;
    syncTimer = null;
    if (payload) void syncProgressToMongo(payload);
  }, debounceMs);
}

export function getLessonProgress(lessonId: string): LessonProgress {
  const all = loadProgress();
  return (
    all[lessonId] ?? {
      cardsSeen: [],
      homeworkAnswers: {},
      updatedAt: new Date().toISOString(),
    }
  );
}

export function updateLessonProgress(
  lessonId: string,
  patch: Partial<LessonProgress>,
  opts?: { syncDebounceMs?: number },
) {
  const all = loadProgress();
  const prev = all[lessonId] ?? {
    cardsSeen: [],
    homeworkAnswers: {},
    updatedAt: new Date().toISOString(),
  };
  all[lessonId] = {
    ...prev,
    ...patch,
    cardsSeen: patch.cardsSeen ?? prev.cardsSeen,
    homeworkAnswers: patch.homeworkAnswers
      ? { ...prev.homeworkAnswers, ...patch.homeworkAnswers }
      : prev.homeworkAnswers,
    updatedAt: new Date().toISOString(),
  };
  saveProgress(all, opts);
  return all[lessonId];
}

export function lessonCompletionRatio(p: LessonProgress, cardsTotal: number, _hwTotal = 0): number {
  let parts = 0;
  let done = 0;
  parts += 1;
  if (p.theoryDone) done += 1;
  parts += 1;
  if (cardsTotal > 0 && p.cardsSeen.length >= Math.min(cardsTotal, Math.ceil(cardsTotal * 0.7))) done += 1;
  parts += 1;
  if (p.homeworkChecked) done += 1;
  return done / parts;
}

export function lastActivityAt(progress: CourseProgress): string | null {
  let latest: string | null = null;
  for (const p of Object.values(progress)) {
    if (p.homeworkChecked && p.updatedAt && (!latest || p.updatedAt > latest)) latest = p.updatedAt;
  }
  return latest;
}

export async function syncProgressToMongo(progress: CourseProgress, profile?: CourseProfile) {
  if (typeof window === "undefined") return;
  const token = getStudentToken();
  if (!token) return;
  try {
    await fetch(`${CRM_API_URL}/lms/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lessons: progress, profile: profile ?? loadProfile() }),
    });
  } catch {
    /* offline: localStorage лишається джерелом правди */
  }
}

export async function hydrateProgressFromMongo(): Promise<CourseProgress | null> {
  if (typeof window === "undefined") return null;
  const token = getStudentToken();
  if (!token) return null;
  try {
    const res = await fetch(`${CRM_API_URL}/lms/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lessons?: CourseProgress; profile?: CourseProfile };
    if (data.lessons && Object.keys(data.lessons).length > 0) {
      const local = loadProgress();
      const merged = { ...data.lessons, ...local };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch {
    return null;
  }
  return null;
}
