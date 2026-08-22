import { RELEASE } from "./config";

/**
 * Чи відкритий матеріал станом на певний день.
 * Поки RELEASE.lessons === "open" — відкрито все, але планова дата
 * все одно показується учневі, щоб було видно ритм року.
 */
export function isLessonOpen(dateISO: string, todayISO: string): boolean {
  return RELEASE.lessons === "open" || dateISO <= todayISO;
}

export function isMockOpen(dateISO: string, todayISO: string): boolean {
  return RELEASE.mocks === "open" || dateISO <= todayISO;
}

export function releaseIsScheduled(): boolean {
  return RELEASE.lessons === "scheduled" || RELEASE.mocks === "scheduled";
}
