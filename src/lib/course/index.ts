import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import type { Curriculum, Lesson } from "./types";

export type { Curriculum, Lesson, QuizCard, HomeworkItem, TheoryBlock } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "math-nmt");

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export function getCurriculum(): Curriculum {
  return readJson<Curriculum>(path.join(CONTENT_DIR, "curriculum.json"));
}

export function getLesson(lessonId: string): Lesson | null {
  const filePath = path.join(CONTENT_DIR, "lessons", `${lessonId}.json`);
  if (!existsSync(filePath)) return null;
  return readJson<Lesson>(filePath);
}

export function getAllLessons(): Lesson[] {
  const dir = path.join(CONTENT_DIR, "lessons");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson<Lesson>(path.join(dir, f)))
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.order - b.order);
}

export function getModuleLessons(moduleId: string): Lesson[] {
  const cur = getCurriculum();
  const mod = cur.modules.find((m) => m.id === moduleId);
  if (!mod) return [];
  return mod.lessonIds
    .map((id) => getLesson(id))
    .filter((l): l is Lesson => l !== null);
}

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
