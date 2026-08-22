import type { CourseSlug } from "@/lib/course/types";

/**
 * Налаштування навчального року та видачі матеріалів.
 * Це єдине місце, де треба щось міняти, щоб перебудувати весь розклад кабінету.
 */

/** Навчальний рік: 1 вересня → 31 травня. */
export const YEAR_START = { month: 9, day: 1 } as const;
export const YEAR_END = { month: 5, day: 31 } as const;

export type ReleaseMode = "open" | "scheduled";

/**
 * Поки що весь матеріал відкритий одразу — учень бачить план,
 * але нічого не заблоковано.
 *
 * Щоб увімкнути справжню щотижневу видачу з 1 вересня,
 * поставте "scheduled" — і уроки/пробні відкриватимуться за датами нижче.
 */
export const RELEASE: { lessons: ReleaseMode; mocks: ReleaseMode } = {
  lessons: "open",
  mocks: "open",
};

export type CourseSchedule = {
  label: string;
  short: string;
  accent: string;
  accentSoft: string;
  /** Дні тижня для нових уроків: 1 — понеділок … 7 — неділя. */
  lessonWeekdays: number[];
  stream: {
    weekday: number;
    time: string;
    durationMin: number;
    teacher: string;
  };
};

export const COURSE_SCHEDULE: Record<CourseSlug, CourseSchedule> = {
  math: {
    label: "Математика",
    short: "Матем.",
    accent: "#2563eb",
    accentSoft: "#e8effd",
    lessonWeekdays: [1, 4],
    stream: { weekday: 1, time: "18:00", durationMin: 75, teacher: "Анна" },
  },
  history: {
    label: "Історія України",
    short: "Історія",
    accent: "#c026d3",
    accentSoft: "#fbeafd",
    lessonWeekdays: [2, 5],
    stream: { weekday: 2, time: "18:30", durationMin: 75, teacher: "Ілля" },
  },
};

export const MOCK_ACCENT = "#ea580c";
export const MOCK_ACCENT_SOFT = "#fff0e6";

/** Пробні НМТ відкриваються першого числа кожного місяця вересень → травень. */
export const MOCK_MONTHS = [9, 10, 11, 12, 1, 2, 3, 4, 5] as const;
