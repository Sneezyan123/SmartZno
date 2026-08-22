/**
 * Журнал роботи учня: коли і що він реально робив.
 *
 * План кабінету відповідає на питання «що вчити цього тижня», журнал —
 * на питання «коли я працював». Звідси беруться крапки в календарі
 * та статистика тижня.
 *
 * Поки прогрес живе в localStorage — журнал теж локальний. Формат записів
 * навмисно плоский, щоб його легко було відправити на сервер пізніше.
 */

import type { CourseSlug } from "@/lib/course/types";
import { getToday } from "@/lib/dev/today";
import { addDays } from "@/lib/schedule/dates";

/** Крок уроку, до якого учень доторкнувся. */
export type ActivityKind = "theory" | "cards" | "homework";

export type ActivityEntry = {
  /** День у київському часі, "YYYY-MM-DD". */
  date: string;
  /** Останній дотик до цього кроку в межах дня. */
  at: string;
  course: CourseSlug;
  lessonId: string;
  kind: ActivityKind;
  /** Крок закрито саме цього дня (теорія прочитана, домашка перевірена). */
  done?: boolean;
  /** Скільки карток уроку переглянуто станом на цей день. */
  cards?: number;
  score?: { correct: number; total: number };
};

const KEY = "smartzno-activity-log";
const LIMIT = 5000;

/** Щоб віджети кабінету оновились одразу після дії учня в іншій вкладці/сторінці. */
export const ACTIVITY_EVENT = "smartzno:activity";

type EntryId = Pick<ActivityEntry, "date" | "course" | "lessonId" | "kind">;

export function entryId(e: EntryId): string {
  return `${e.date}|${e.course}|${e.lessonId}|${e.kind}`;
}

export function loadActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ActivityEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveActivity(entries: ActivityEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(-LIMIT)));
  } catch {
    // Історія не критична: якщо сховище переповнене, просто не пишемо.
  }
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
}

export type ActivityInput = Omit<ActivityEntry, "date" | "at"> & { date?: string };

/**
 * Один запис на (день + урок + крок): повторний захід у ту саму теорію
 * не роздуває історію, але оновлює деталі всередині дня.
 */
export function logActivity(input: ActivityInput) {
  if (typeof window === "undefined") return;

  const date = input.date ?? getToday();
  const entry: ActivityEntry = { ...input, date, at: new Date().toISOString() };
  const all = loadActivity();
  const i = all.findIndex((e) => entryId(e) === entryId(entry));

  if (i === -1) {
    all.push(entry);
  } else {
    const prev = all[i];
    all[i] = {
      ...prev,
      ...entry,
      done: prev.done || entry.done,
      cards: Math.max(prev.cards ?? 0, entry.cards ?? 0) || undefined,
      score: entry.score ?? prev.score,
    };
  }

  saveActivity(all);
}

export type DayActivity = {
  date: string;
  entries: ActivityEntry[];
  /** Курси, у які учень заходив цього дня. */
  courses: CourseSlug[];
  /** Скільки кроків закрито саме цього дня. */
  closed: number;
};

export function groupActivityByDay(entries: ActivityEntry[]): Record<string, DayActivity> {
  const days: Record<string, DayActivity> = {};

  for (const entry of entries) {
    const day = (days[entry.date] ??= {
      date: entry.date,
      entries: [],
      courses: [],
      closed: 0,
    });
    day.entries.push(entry);
    if (!day.courses.includes(entry.course)) day.courses.push(entry.course);
    if (entry.done) day.closed += 1;
  }

  for (const day of Object.values(days)) {
    day.entries.sort((a, b) => a.at.localeCompare(b.at));
  }

  return days;
}

/**
 * Серія днів підряд. Якщо сьогодні учень ще не заходив — серію не обнуляємо,
 * рахуємо від вчора: день ще не закінчився.
 */
export function streakLength(days: Record<string, DayActivity>, today: string): number {
  let cursor = days[today] ? today : addDays(today, -1);
  let length = 0;

  while (days[cursor]) {
    length += 1;
    cursor = addDays(cursor, -1);
  }

  return length;
}

export function activityDates(days: Record<string, DayActivity>): string[] {
  return Object.keys(days).sort();
}
