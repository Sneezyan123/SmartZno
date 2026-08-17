import { cache } from "react";
import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import type {
  Curriculum,
  Lesson,
  CourseTracksFile,
  CourseOpsFile,
  PlacementFile,
} from "./types";

export type { Curriculum, Lesson, QuizCard, HomeworkItem, TheoryBlock } from "./types";
export type { CourseTracksFile, CourseOpsFile, PlacementFile, CourseTrack } from "./types";

export type LessonSummary = {
  id: string;
  title: string;
  status: Lesson["status"];
  order: number;
  moduleId: string;
  cardsCount: number;
  hwCount: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "math-nmt");

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export const getCurriculum = cache((): Curriculum => {
  return readJson<Curriculum>(path.join(CONTENT_DIR, "curriculum.json"));
});

export const getLesson = cache((lessonId: string): Lesson | null => {
  const filePath = path.join(CONTENT_DIR, "lessons", `${lessonId}.json`);
  if (!existsSync(filePath)) return null;
  return readJson<Lesson>(filePath);
});

export const getAllLessons = cache((): Lesson[] => {
  const dir = path.join(CONTENT_DIR, "lessons");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson<Lesson>(path.join(dir, f)))
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.order - b.order);
});

/** Lightweight metadata for hub / nav — avoids shipping full quiz/homework payloads. */
export const getLessonSummaries = cache((): LessonSummary[] => {
  return getAllLessons().map((l) => ({
    id: l.id,
    title: l.title,
    status: l.status,
    order: l.order,
    moduleId: l.moduleId,
    cardsCount: l.quizCards.length,
    hwCount: l.homework.length,
  }));
});

export const getLessonTitles = cache((): Record<string, string> => {
  return Object.fromEntries(getLessonSummaries().map((l) => [l.id, l.title]));
});

export function getAdjacentLessonIds(lessonId: string): { prev: string | null; next: string | null } {
  const cur = getCurriculum();
  const flat = cur.modules.flatMap((m) => m.lessonIds);
  const idx = flat.indexOf(lessonId);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export const getTracksFile = cache((): CourseTracksFile => {
  return readJson<CourseTracksFile>(path.join(CONTENT_DIR, "tracks.json"));
});

export const getOpsFile = cache((): CourseOpsFile => {
  return readJson<CourseOpsFile>(path.join(CONTENT_DIR, "ops.json"));
});

export const getPlacementFile = cache((): PlacementFile => {
  return readJson<PlacementFile>(path.join(CONTENT_DIR, "placement.json"));
});

export const getCardCounts = cache((): Record<string, number> => {
  return Object.fromEntries(getLessonSummaries().map((l) => [l.id, l.cardsCount]));
});
