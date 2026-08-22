import type { CourseSlug } from "@/lib/course/types";
import type { CourseProgress, LessonProgress } from "@/lib/course/progress";
import type {
  PlanCourse,
  PlannedLesson,
  PlannedMock,
  PlannedStream,
  StudyPlan,
} from "@/lib/schedule/types";

export type AllProgress = Record<CourseSlug, CourseProgress>;

export type DayAgenda = {
  streams: PlannedStream[];
  lessons: PlannedLesson[];
  mocks: PlannedMock[];
  total: number;
};

export function agendaFor(plan: StudyPlan, date: string): DayAgenda {
  const streams = plan.streams.filter((s) => s.date === date);
  const lessons = plan.lessons.filter((l) => l.date === date);
  const mocks = plan.mocks.filter((m) => m.date === date);
  return { streams, lessons, mocks, total: streams.length + lessons.length + mocks.length };
}

export function accentMap(courses: PlanCourse[]): Record<CourseSlug, string> {
  return courses.reduce(
    (acc, c) => {
      acc[c.slug] = c.accent;
      return acc;
    },
    { math: "#2563eb", history: "#c026d3" } as Record<CourseSlug, string>,
  );
}

export function courseMap(courses: PlanCourse[]): Record<CourseSlug, PlanCourse> {
  return courses.reduce(
    (acc, c) => {
      acc[c.slug] = c;
      return acc;
    },
    {} as Record<CourseSlug, PlanCourse>,
  );
}

export type LessonState = {
  theoryDone: boolean;
  cardsSeen: number;
  cardsDone: boolean;
  homeworkDone: boolean;
  ratio: number;
};

export function lessonState(lesson: PlannedLesson, p: LessonProgress | undefined): LessonState {
  const theoryDone = Boolean(p?.theoryDone);
  const cardsSeen = p?.cardsSeen?.length ?? 0;
  const homeworkDone = Boolean(p?.homeworkChecked);
  const cardsDone = lesson.cards === 0 || cardsSeen >= Math.ceil(lesson.cards * 0.7);
  const parts = [theoryDone, cardsDone, homeworkDone].filter(Boolean).length;
  return { theoryDone, cardsSeen, cardsDone, homeworkDone, ratio: parts / 3 };
}

/** Найближчі події після вказаної дати — для блоку «Далі за планом». */
export function upcomingAfter(plan: StudyPlan, date: string, limit = 5) {
  type Upcoming = {
    key: string;
    date: string;
    course: CourseSlug;
    kind: "stream" | "lesson" | "mock";
    title: string;
    time: string | null;
  };

  const items: Upcoming[] = [
    ...plan.streams.map((s) => ({
      key: s.id,
      date: s.date,
      course: s.course,
      kind: "stream" as const,
      title: s.title,
      time: s.time,
    })),
    ...plan.lessons.map((l) => ({
      key: `lesson-${l.course}-${l.id}`,
      date: l.date,
      course: l.course,
      kind: "lesson" as const,
      title: l.title,
      time: null,
    })),
    ...plan.mocks.map((m) => ({
      key: m.id,
      date: m.date,
      course: m.course,
      kind: "mock" as const,
      title: m.title,
      time: null,
    })),
  ];

  return items
    .filter((i) => i.date > date)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""))
    .slice(0, limit);
}
