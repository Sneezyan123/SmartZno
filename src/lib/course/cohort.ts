import type { CourseProgress, LessonProgress } from "./progress";

export const DEMO_LESSON_IDS = ["m1-01", "m1-02"];

export function isDemoOnly(mathStatus?: string | null) {
  return !mathStatus || mathStatus === "trialing";
}

export function cardsEnough(p: LessonProgress, cardsTotal: number) {
  if (cardsTotal <= 0) return true;
  return p.cardsSeen.length >= Math.min(cardsTotal, Math.ceil(cardsTotal * 0.7));
}

export function lessonPacketDone(p: LessonProgress, cardsTotal: number) {
  return Boolean(p.theoryDone) && cardsEnough(p, cardsTotal) && Boolean(p.homeworkChecked);
}

export function moduleClosed(
  lessonIds: string[],
  progress: CourseProgress,
  cardCounts: Record<string, number>,
) {
  return lessonIds.every((id) => lessonPacketDone(progress[id] ?? { cardsSeen: [], homeworkAnswers: {}, updatedAt: "" }, cardCounts[id] ?? 0));
}

export type AccessResult = { ok: true } | { ok: false; reason: string };

export function lessonAccess(opts: {
  lessonId: string;
  sequence: string[];
  startLessonId: string;
  progress: CourseProgress;
  cardCounts: Record<string, number>;
  cohortMode: boolean;
  demoOnly: boolean;
  demoLessons?: string[];
}): AccessResult {
  const demo = opts.demoLessons ?? DEMO_LESSON_IDS;
  if (opts.demoOnly && !demo.includes(opts.lessonId) && !opts.lessonId.startsWith("m0-")) {
    return {
      ok: false,
      reason: "Демо 5–7 днів: відкриті уроки 1–2 і вступ. Повний трек — після оплати.",
    };
  }
  if (!opts.cohortMode) return { ok: true };

  if (opts.lessonId.startsWith("m7-")) {
    const mocks = opts.sequence.filter((id) => id.startsWith("m7-"));
    const ordered = mocks.length ? mocks : Array.from({ length: 12 }, (_, i) => `m7-${String(i + 1).padStart(2, "0")}`);
    const idx = ordered.indexOf(opts.lessonId);
    if (idx <= 0) return { ok: true };
    const prev = ordered[idx - 1];
    const prevP = opts.progress[prev];
    if (prevP?.homeworkChecked) return { ok: true };
    return { ok: false, reason: `Спочатку закрий пробний ${prev} (або дочекайся його в плані тижня).` };
  }

  const seq = opts.sequence.filter((id) => !id.startsWith("m7-"));
  const startIdx = Math.max(0, seq.indexOf(opts.startLessonId));
  const idx = seq.indexOf(opts.lessonId);
  if (idx < 0 || idx <= startIdx) return { ok: true };
  for (let i = startIdx; i < idx; i++) {
    const id = seq[i];
    const p = opts.progress[id] ?? { cardsSeen: [], homeworkAnswers: {}, updatedAt: "" };
    if (!lessonPacketDone(p, opts.cardCounts[id] ?? 0)) {
      return {
        ok: false,
        reason: "Режим когорти: спочатку теорія (кнопка «прочитав»), ≥70% карток і ДЗ попереднього уроку.",
      };
    }
  }
  return { ok: true };
}

export function successfulMock(progress: CourseProgress) {
  for (const [id, p] of Object.entries(progress)) {
    if (!id.startsWith("m7-") || !p.homeworkChecked || !p.homeworkScore) continue;
    const max = p.homeworkScore.nmtMax ?? 0;
    const got = p.homeworkScore.nmtGot ?? 0;
    if (max > 0 && got / max >= 0.5) return { id, got, max };
  }
  return null;
}
