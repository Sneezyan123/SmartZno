/**
 * Демо-записи для перегляду кабінету адміном / на презентації.
 * Увімкнення: ?demo=1 у URL або localStorage smartzno-admin-demo=1
 */

import type { StudyPlan } from "@/lib/schedule/types";
import { addDays } from "@/lib/schedule/dates";
import type { ActivityEntry } from "./log";
import { loadActivity, saveActivity } from "./log";

const FLAG = "smartzno-admin-demo";

export function isAdminDemo(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(FLAG) === "1") return true;
  return new URLSearchParams(window.location.search).get("demo") === "1";
}

export function setAdminDemo(on: boolean) {
  if (on) localStorage.setItem(FLAG, "1");
  else localStorage.removeItem(FLAG);
}

/** Заповнює журнал типовим тижнем для демо-перегляду. */
export function seedDemoActivity(
  today: string,
  weekStart: string,
  plan: StudyPlan,
  weekIndex: number,
): ActivityEntry[] {
  if (!isAdminDemo()) return loadActivity();

  const mathLesson = plan.lessons.find((l) => l.course === "math" && l.weekIndex === weekIndex);
  const historyLesson = plan.lessons.find(
    (l) => l.course === "history" && l.weekIndex === weekIndex,
  );
  const mathId = mathLesson?.id ?? "m1";
  const historyId = historyLesson?.id ?? "h1";

  const at = (date: string, h: number, m: number) =>
    `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00.000Z`;

  const demo: ActivityEntry[] = [
    {
      date: addDays(weekStart, 0),
      at: at(addDays(weekStart, 0), 17, 10),
      course: "math",
      lessonId: mathId,
      kind: "theory",
      done: true,
    },
    {
      date: addDays(weekStart, 0),
      at: at(addDays(weekStart, 0), 17, 45),
      course: "math",
      lessonId: mathId,
      kind: "cards",
      cards: 8,
    },
    {
      date: addDays(weekStart, 1),
      at: at(addDays(weekStart, 1), 18, 30),
      course: "history",
      lessonId: historyId,
      kind: "theory",
      done: true,
    },
    {
      date: addDays(weekStart, 1),
      at: at(addDays(weekStart, 1), 19, 5),
      course: "history",
      lessonId: historyId,
      kind: "cards",
      cards: 14,
      done: true,
    },
    {
      date: addDays(weekStart, 2),
      at: at(addDays(weekStart, 2), 16, 20),
      course: "math",
      lessonId: mathId,
      kind: "homework",
      done: true,
      score: { correct: 7, total: 9 },
    },
    {
      date: addDays(weekStart, 4),
      at: at(addDays(weekStart, 4), 19, 0),
      course: "history",
      lessonId: historyId,
      kind: "homework",
    },
  ];

  if (today >= weekStart && today <= addDays(weekStart, 6)) {
    demo.push({
      date: today,
      at: at(today, 10, 15),
      course: "math",
      lessonId: mathId,
      kind: "theory",
      done: true,
    });
  }

  saveActivity(demo);
  return demo;
}
