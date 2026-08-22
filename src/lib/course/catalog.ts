import type { CourseMeta, CourseSlug } from "./types";

export const COURSE_CATALOG: Record<CourseSlug, CourseMeta> = {
  math: {
    slug: "math",
    contentDir: "math-nmt",
    headline: "Підготовка до НМТ з математики",
    nav: {
      theory: "Теорія",
      cards: "Квізкарти",
      homework: "Завдання",
    },
  },
  history: {
    slug: "history",
    contentDir: "history-nmt",
    headline: "Підготовка до НМТ з історії України",
    nav: {
      theory: "Лекція",
      notes: "Конспект",
      cards: "Квізкарти",
      homework: "Квіз",
    },
  },
};

export function isCourseSlug(value: string): value is CourseSlug {
  return value === "math" || value === "history";
}

export function getCourseMeta(slug: CourseSlug): CourseMeta {
  return COURSE_CATALOG[slug];
}
