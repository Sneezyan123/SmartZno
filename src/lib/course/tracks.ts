import type { CourseTrack, HomeworkItem, HomeworkLevel } from "./types";

export function currentWeekIndex(startDateIso: string, now = new Date()): number {
  const start = new Date(startDateIso);
  const diff = now.getTime() - start.getTime();
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, week);
}

export function weekDeadlineIso(startDateIso: string, week: number, weekday: number): string {
  const start = new Date(startDateIso);
  const day = start.getDay();
  const mondayOffset = (day + 6) % 7;
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() - mondayOffset + (week - 1) * 7);
  const due = new Date(weekStart);
  due.setDate(weekStart.getDate() + (weekday - 1));
  due.setHours(21, 0, 0, 0);
  return due.toISOString();
}

export function getWeekPlan(track: CourseTrack, startDateIso: string, now = new Date()) {
  const week = Math.min(currentWeekIndex(startDateIso, now), track.weeks.length || 1);
  const current = track.weeks.find((w) => w.week === week) ?? track.weeks[track.weeks.length - 1];
  const next = track.weeks.find((w) => w.week === week + 1) ?? null;
  return {
    week,
    current,
    next,
    hwDeadline: weekDeadlineIso(startDateIso, week, 5),
    liveDays: [1, 4] as const,
  };
}

export function filterHomeworkByLevel(items: HomeworkItem[], level: HomeworkLevel): HomeworkItem[] {
  return items.filter((item) => {
    const lv = item.level ?? "B";
    return lv === "B" || lv === level;
  });
}

export function recommendFromPlacement(correct: number, wrongLessons: string[], total = 13) {
  let level: HomeworkLevel = "B";
  let trackId = "g11-9";
  let startLessonId = "m1-01";
  // ~40% / ~70% thresholds scale with question count
  const weak = Math.floor(total * 0.4);
  const strong = Math.ceil(total * 0.7);
  if (correct <= weak) {
    level = "C";
    trackId = "g11-9";
    startLessonId = "m1-01";
  } else if (correct < strong) {
    level = "B";
    startLessonId = wrongLessons[0] ?? "m1-04";
  } else {
    level = "A";
    trackId = "g11-6";
    startLessonId = wrongLessons[0] ?? "m2-01";
  }
  return { level, trackId, startLessonId, correct };
}
