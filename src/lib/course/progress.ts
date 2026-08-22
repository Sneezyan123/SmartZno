import { logActivity } from "@/lib/activity/log";
import type { CourseSlug } from "./types";

export type LessonProgress = {
  theoryDone?: boolean;
  cardsSeen: string[];
  homeworkAnswers: Record<string, unknown>;
  homeworkChecked?: boolean;
  homeworkScore?: { correct: number; total: number; nmtGot?: number; nmtMax?: number };
  updatedAt: string;
};

export type CourseProgress = Record<string, LessonProgress>;

function storageKey(course: CourseSlug) {
  return course === "math" ? "smartzno-math-nmt-progress" : `smartzno-${course}-nmt-progress`;
}

export function loadProgress(course: CourseSlug = "math"): CourseProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(course));
    if (!raw) return {};
    return JSON.parse(raw) as CourseProgress;
  } catch {
    return {};
  }
}

export function saveProgress(progress: CourseProgress, course: CourseSlug = "math") {
  localStorage.setItem(storageKey(course), JSON.stringify(progress));
}

export function getLessonProgress(lessonId: string, course: CourseSlug = "math"): LessonProgress {
  const all = loadProgress(course);
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
  course: CourseSlug = "math",
) {
  const all = loadProgress(course);
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
  saveProgress(all, course);
  recordActivity(lessonId, course, prev, all[lessonId], patch);
  return all[lessonId];
}

/**
 * Кожен запис прогресу лишає слід у журналі — так календар знає,
 * у які дні учень працював, навіть якщо крок ще не закритий.
 */
function recordActivity(
  lessonId: string,
  course: CourseSlug,
  prev: LessonProgress,
  next: LessonProgress,
  patch: Partial<LessonProgress>,
) {
  if (patch.theoryDone) {
    logActivity({ course, lessonId, kind: "theory", done: true });
  }

  if (next.cardsSeen.length > (prev.cardsSeen?.length ?? 0)) {
    logActivity({ course, lessonId, kind: "cards", cards: next.cardsSeen.length });
  }

  if (patch.homeworkChecked) {
    logActivity({
      course,
      lessonId,
      kind: "homework",
      done: true,
      score: next.homeworkScore
        ? { correct: next.homeworkScore.correct, total: next.homeworkScore.total }
        : undefined,
    });
  } else if (patch.homeworkAnswers) {
    logActivity({ course, lessonId, kind: "homework" });
  }
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
