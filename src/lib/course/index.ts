import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import type { CourseSlug, Curriculum, Lesson } from "./types";
import { getCourseMeta } from "./catalog";

export type {
  Curriculum,
  Lesson,
  QuizCard,
  HomeworkItem,
  TheoryBlock,
  CourseSlug,
} from "./types";
export { COURSE_CATALOG, getCourseMeta, isCourseSlug } from "./catalog";

function contentDir(course: CourseSlug) {
  return path.join(process.cwd(), "content", getCourseMeta(course).contentDir);
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export function getCurriculum(course: CourseSlug = "math"): Curriculum {
  return readJson<Curriculum>(path.join(contentDir(course), "curriculum.json"));
}

export function getLesson(lessonId: string, course: CourseSlug = "math"): Lesson | null {
  const filePath = path.join(contentDir(course), "lessons", `${lessonId}.json`);
  if (!existsSync(filePath)) return null;
  return readJson<Lesson>(filePath);
}

export function getAllLessons(course: CourseSlug = "math"): Lesson[] {
  const dir = path.join(contentDir(course), "lessons");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson<Lesson>(path.join(dir, f)))
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.order - b.order);
}

export function getModuleLessons(moduleId: string, course: CourseSlug = "math"): Lesson[] {
  const cur = getCurriculum(course);
  const mod = cur.modules.find((m) => m.id === moduleId);
  if (!mod) return [];
  return mod.lessonIds
    .map((id) => getLesson(id, course))
    .filter((l): l is Lesson => l !== null);
}

export function getAdjacentLessonIds(
  lessonId: string,
  course: CourseSlug = "math",
): { prev: string | null; next: string | null } {
  const cur = getCurriculum(course);
  const flat = cur.modules.flatMap((m) => m.lessonIds);
  const idx = flat.indexOf(lessonId);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

/** Ведмедик з’являється приблизно раз на 2–3 уроки, щоб не набридати. */
export function shouldShowLessonBear(lessonId: string, course: CourseSlug): boolean {
  const cur = getCurriculum(course);
  const idx = cur.modules.flatMap((m) => m.lessonIds).indexOf(lessonId);
  return idx >= 0 && (idx + 1) % 3 === 0;
}
