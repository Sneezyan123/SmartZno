/**
 * Перенесення старого прогресу в журнал роботи.
 *
 * Учні, які вчились до появи історії, мають закриті уроки без дат кроків —
 * лише `updatedAt` на весь урок. Один раз розкладаємо його в журнал, щоб
 * календар не був порожнім там, де прогрес уже є.
 */

import { loadProgress } from "@/lib/course/progress";
import type { CourseSlug } from "@/lib/course/types";
import { entryId, loadActivity, saveActivity, type ActivityEntry } from "./log";

const FLAG = "smartzno-activity-seeded";
const COURSES: CourseSlug[] = ["math", "history"];

export function seedActivityFromProgress(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(FLAG)) return false;

  const existing = loadActivity();
  const taken = new Set(existing.map(entryId));
  const seeded: ActivityEntry[] = [];

  const add = (entry: ActivityEntry) => {
    const id = entryId(entry);
    if (taken.has(id)) return;
    taken.add(id);
    seeded.push(entry);
  };

  for (const course of COURSES) {
    for (const [lessonId, p] of Object.entries(loadProgress(course))) {
      const at = p.updatedAt ?? "";
      const date = at.slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

      if (p.theoryDone) add({ date, at, course, lessonId, kind: "theory", done: true });
      if (p.cardsSeen?.length) {
        add({ date, at, course, lessonId, kind: "cards", cards: p.cardsSeen.length });
      }
      if (p.homeworkChecked) {
        add({
          date,
          at,
          course,
          lessonId,
          kind: "homework",
          done: true,
          score: p.homeworkScore
            ? { correct: p.homeworkScore.correct, total: p.homeworkScore.total }
            : undefined,
        });
      }
    }
  }

  localStorage.setItem(FLAG, "1");
  if (seeded.length === 0) return false;

  saveActivity([...existing, ...seeded].sort((a, b) => a.at.localeCompare(b.at)));
  return true;
}
