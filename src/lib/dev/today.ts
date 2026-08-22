/**
 * Заглушка «сьогодні = 1 вересня» для тестування кабінету.
 *
 * У dev увімкнена за замовчуванням. Вимкнути: ?devToday=0 або кнопка в кабінеті.
 * У prod — лише через ?devToday=1 або NEXT_PUBLIC_DEV_TODAY=1.
 *
 * Повністю прибрати: видалити цей файл і імпорти getToday / DevTodayBar.
 */

import { getMonth, makeISO, todayInKyiv } from "@/lib/schedule/dates";

export const DEV_TODAY_EVENT = "smartzno-dev-today-change";
const FLAG = "smartzno-dev-today";

/** 1 вересня поточного навчального року (липень+ → цей календарний рік). */
export function stubSeptemberFirst(from?: string): string {
  const real = from ?? todayInKyiv();
  const year = Number(real.slice(0, 4));
  const startYear = getMonth(real) >= 7 ? year : year - 1;
  return makeISO(startYear, 9, 1);
}

function envForced(): boolean {
  return process.env.NEXT_PUBLIC_DEV_TODAY === "1";
}

function devDefaultOn(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isDevToday(): boolean {
  if (envForced()) return true;

  if (typeof window === "undefined") {
    return devDefaultOn();
  }

  const q = new URLSearchParams(window.location.search).get("devToday");
  if (q === "0") return false;
  if (q === "1") return true;

  const stored = localStorage.getItem(FLAG);
  if (stored === "0") return false;
  if (stored === "1") return true;

  return devDefaultOn();
}

/** Зчитує ?devToday=1|0 з URL і зберігає в localStorage. */
export function initDevTodayFromUrl() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search).get("devToday");
  if (q === "1") localStorage.setItem(FLAG, "1");
  if (q === "0") localStorage.setItem(FLAG, "0");
}

export function setDevToday(on: boolean) {
  if (typeof window === "undefined" || envForced()) return;
  localStorage.setItem(FLAG, on ? "1" : "0");
  window.dispatchEvent(new Event(DEV_TODAY_EVENT));
}

/** Поточна дата з урахуванням заглушки. */
export function getToday(): string {
  if (isDevToday()) return stubSeptemberFirst();
  return todayInKyiv();
}
