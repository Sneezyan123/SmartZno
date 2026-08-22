/**
 * Робота з датами навчального року.
 *
 * Усі дати — це рядки "YYYY-MM-DD" (без часу). Внутрішні обчислення йдуть
 * у UTC, щоб перехід на літній час не зсував день. Час доби зберігається
 * окремо рядком "HH:MM" і стосується Europe/Kyiv.
 */

export const WEEKDAY_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"] as const;

const MONTHS_NOMINATIVE = [
  "січень",
  "лютий",
  "березень",
  "квітень",
  "травень",
  "червень",
  "липень",
  "серпень",
  "вересень",
  "жовтень",
  "листопад",
  "грудень",
] as const;

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function makeISO(year: number, month1: number, day: number): string {
  return toISO(new Date(Date.UTC(year, month1 - 1, day)));
}

export function addDays(iso: string, days: number): string {
  const d = fromISO(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

export function diffDays(from: string, to: string): number {
  return Math.round((fromISO(to).getTime() - fromISO(from).getTime()) / 86_400_000);
}

/** 1 — понеділок, 7 — неділя. */
export function isoWeekday(iso: string): number {
  return fromISO(iso).getUTCDay() || 7;
}

export function startOfWeek(iso: string): string {
  return addDays(iso, -(isoWeekday(iso) - 1));
}

export function getYear(iso: string): number {
  return Number(iso.slice(0, 4));
}

/** 1..12 */
export function getMonth(iso: string): number {
  return Number(iso.slice(5, 7));
}

export function getDay(iso: string): number {
  return Number(iso.slice(8, 10));
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function monthTitle(year: number, month1: number): string {
  return `${MONTHS_NOMINATIVE[month1 - 1]} ${year}`;
}

/** Поточна дата в київському часі як "YYYY-MM-DD". */
export function todayInKyiv(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function formatDayMonth(iso: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(fromISO(iso));
}

export function formatFullDate(iso: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(fromISO(iso));
}

/** «8–14 вересня» або «29 вересня – 5 жовтня». */
export function formatDayRange(fromISO: string, toISO: string): string {
  const sameMonth = monthKey(fromISO) === monthKey(toISO);
  return sameMonth
    ? `${getDay(fromISO)}–${formatDayMonth(toISO)}`
    : `${formatDayMonth(fromISO)} – ${formatDayMonth(toISO)}`;
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(fromISO(iso));
}

/**
 * Сітка місяця 6×7, від понеділка. Повертає ISO-дати, включно з «хвостами»
 * сусідніх місяців, щоб таблиця завжди мала однакову висоту.
 */
export function monthGrid(year: number, month1: number): string[] {
  const first = makeISO(year, month1, 1);
  const gridStart = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function relativeDayLabel(iso: string, today: string): string | null {
  const delta = diffDays(today, iso);
  if (delta === 0) return "сьогодні";
  if (delta === 1) return "завтра";
  if (delta === 2) return "післязавтра";
  if (delta === -1) return "вчора";
  return null;
}
