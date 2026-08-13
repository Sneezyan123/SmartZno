export type LessonProgress = {
  theoryDone?: boolean;
  cardsSeen: string[];
  homeworkAnswers: Record<string, unknown>;
  homeworkChecked?: boolean;
  homeworkScore?: { correct: number; total: number };
  updatedAt: string;
};

export type CourseProgress = Record<string, LessonProgress>;

const STORAGE_KEY = "smartzno-math-nmt-progress";

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

export function saveProgress(progress: CourseProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

export function updateLessonProgress(lessonId: string, patch: Partial<LessonProgress>) {
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
  saveProgress(all);
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
