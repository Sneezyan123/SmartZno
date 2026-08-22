/**
 * Тижнева модель кабінету.
 *
 * Філософія: план видається тижнем і розбитий по уроках, а не по днях.
 * Учень сам вирішує, коли закривати кроки; журнал роботи показує,
 * як він насправді розподілив тиждень.
 */

import type { DayActivity } from "@/lib/activity/log";
import { COURSE_CATALOG } from "@/lib/course/catalog";
import type { CourseSlug } from "@/lib/course/types";
import { MOCK_ACCENT } from "@/lib/schedule/config";
import { WEEKDAY_SHORT, addDays, diffDays, getDay } from "@/lib/schedule/dates";
import type {
  PlanCourse,
  PlannedLesson,
  PlannedMock,
  PlannedStream,
  StudyPlan,
  StudyWeek,
} from "@/lib/schedule/types";
import { accentMap, lessonState, type AllProgress, type LessonState } from "./agenda";

/** Крок уроку — мінімальна одиниця плану. */
export type StepKind = "theory" | "cards" | "homework";

export type LessonStep = {
  kind: StepKind;
  label: string;
  href: string;
  done: boolean;
  /** Незакритий прогрес усередині кроку, напр. «8 / 14». */
  note: string | null;
};

export type WeekLessonItem = {
  lesson: PlannedLesson;
  state: LessonState;
  steps: LessonStep[];
  done: number;
  total: number;
};

export type WeekCourseGroup = {
  course: PlanCourse;
  stream: PlannedStream | null;
  lessons: WeekLessonItem[];
  mocks: PlannedMock[];
  done: number;
  total: number;
};

export type WeekDay = {
  iso: string;
  short: string;
  day: number;
  worked: boolean;
  closed: number;
  courses: CourseSlug[];
  isToday: boolean;
  isFuture: boolean;
  inYear: boolean;
};

export type WeekPhase = "past" | "current" | "future";

export type WeekOverview = {
  week: StudyWeek;
  phase: WeekPhase;
  groups: WeekCourseGroup[];
  lessonsTotal: number;
  lessonsDone: number;
  /** Кроки: скільки закрито / скільки всього видано на тиждень. */
  done: number;
  total: number;
  left: number;
  ratio: number;
  days: WeekDay[];
  daysWorked: number;
  /** Днів до кінця тижня включно з сьогодні (0 — тиждень уже минув). */
  daysLeft: number;
  /** Скільки кроків на день, щоб закрити тиждень вчасно. */
  perDay: number;
};

export function stepLabel(course: CourseSlug, kind: StepKind): string {
  const nav = COURSE_CATALOG[course].nav;
  if (kind === "theory") return nav.theory;
  if (kind === "cards") return nav.cards;
  return nav.homework;
}

export function lessonHref(course: CourseSlug, lessonId: string): string {
  return `/cabinet/courses/${course}/${lessonId}`;
}

function buildSteps(lesson: PlannedLesson, state: LessonState): LessonStep[] {
  const base = lessonHref(lesson.course, lesson.id);
  const steps: LessonStep[] = [
    {
      kind: "theory",
      label: stepLabel(lesson.course, "theory"),
      href: base,
      done: state.theoryDone,
      note: null,
    },
  ];

  if (lesson.cards > 0) {
    const seen = Math.min(state.cardsSeen, lesson.cards);
    steps.push({
      kind: "cards",
      label: stepLabel(lesson.course, "cards"),
      href: `${base}/cards`,
      done: state.cardsDone,
      note: !state.cardsDone && seen > 0 ? `${seen} / ${lesson.cards}` : null,
    });
  }

  if (lesson.tasks > 0) {
    steps.push({
      kind: "homework",
      label: stepLabel(lesson.course, "homework"),
      href: `${base}/homework`,
      done: state.homeworkDone,
      note: null,
    });
  }

  return steps;
}

export function weekLessonItem(lesson: PlannedLesson, progress: AllProgress): WeekLessonItem {
  const state = lessonState(lesson, progress[lesson.course][lesson.id]);
  const steps = buildSteps(lesson, state);
  return {
    lesson,
    state,
    steps,
    done: steps.filter((s) => s.done).length,
    total: steps.length,
  };
}

export function weekOf(plan: StudyPlan, date: string): StudyWeek | null {
  return plan.weeks.find((w) => date >= w.start && date <= w.end) ?? null;
}

/** Тиждень, на якому відкривається кабінет: поточний, або перший/останній у році. */
export function anchorWeek(plan: StudyPlan, today: string): StudyWeek {
  const exact = weekOf(plan, today);
  if (exact) return exact;
  return today < plan.startISO ? plan.weeks[0] : plan.weeks[plan.weeks.length - 1];
}

export function weekPhase(week: StudyWeek, today: string): WeekPhase {
  if (today > week.end) return "past";
  if (today < week.start) return "future";
  return "current";
}

export function buildWeekOverview(
  plan: StudyPlan,
  week: StudyWeek,
  progress: AllProgress,
  days: Record<string, DayActivity>,
  today: string,
): WeekOverview {
  const phase = weekPhase(week, today);

  const groups: WeekCourseGroup[] = plan.courses
    .map((course) => {
      const lessons = plan.lessons
        .filter((l) => l.course === course.slug && l.weekIndex === week.index)
        .map((lesson) => weekLessonItem(lesson, progress));

      const group: WeekCourseGroup = {
        course,
        stream:
          plan.streams.find((s) => s.course === course.slug && s.weekIndex === week.index) ?? null,
        lessons,
        mocks: plan.mocks.filter(
          (m) => m.course === course.slug && m.date >= week.start && m.date <= week.end,
        ),
        done: lessons.reduce((sum, l) => sum + l.done, 0),
        total: lessons.reduce((sum, l) => sum + l.total, 0),
      };
      return group;
    })
    .filter((g) => g.lessons.length > 0 || g.stream !== null || g.mocks.length > 0);

  const weekDays: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const iso = addDays(week.start, i);
    const activity = days[iso];
    return {
      iso,
      short: WEEKDAY_SHORT[i],
      day: getDay(iso),
      worked: Boolean(activity),
      closed: activity?.closed ?? 0,
      courses: activity?.courses ?? [],
      isToday: iso === today,
      isFuture: iso > today,
      inYear: iso >= plan.startISO && iso <= plan.endISO,
    };
  });

  const done = groups.reduce((sum, g) => sum + g.done, 0);
  const total = groups.reduce((sum, g) => sum + g.total, 0);
  const left = Math.max(0, total - done);
  const daysLeft = phase === "current" ? diffDays(today, week.end) + 1 : phase === "future" ? 7 : 0;

  return {
    week,
    phase,
    groups,
    lessonsTotal: groups.reduce((sum, g) => sum + g.lessons.length, 0),
    lessonsDone: groups.reduce(
      (sum, g) => sum + g.lessons.filter((l) => l.done === l.total).length,
      0,
    ),
    done,
    total,
    left,
    ratio: total > 0 ? done / total : 1,
    days: weekDays,
    daysWorked: weekDays.filter((d) => d.worked).length,
    daysLeft,
    perDay: left > 0 && daysLeft > 0 ? Math.ceil(left / daysLeft) : 0,
  };
}

export type WeekDebt = {
  /** Незакриті кроки з попередніх тижнів. */
  steps: number;
  weeks: number;
  lessons: WeekLessonItem[];
};

/** «Хвіст» з минулих тижнів — щоб учень бачив, що треба догнати. */
export function pastDebt(
  plan: StudyPlan,
  week: StudyWeek,
  progress: AllProgress,
  limit = 4,
): WeekDebt {
  const behind = plan.lessons
    .filter((l) => l.weekIndex < week.index)
    .map((lesson) => weekLessonItem(lesson, progress))
    .filter((item) => item.done < item.total);

  return {
    steps: behind.reduce((sum, item) => sum + (item.total - item.done), 0),
    weeks: new Set(behind.map((item) => item.lesson.weekIndex)).size,
    lessons: behind.slice(-limit).reverse(),
  };
}

/**
 * Крапки в календарі. Заповнені — дні, коли учень працював (колір курсу).
 * Порожні — те, що заплановано, але ще не закрито.
 */
export type DayMark = {
  activity: string[];
  planned: string[];
  /** Минулий день без жодної роботи. */
  idle: boolean;
};

export function buildDayMarks(
  plan: StudyPlan,
  days: Record<string, DayActivity>,
  today: string,
): Record<string, DayMark> {
  const accents = accentMap(plan.courses);
  const marks: Record<string, DayMark> = {};

  const mark = (date: string) => (marks[date] ??= { activity: [], planned: [], idle: false });

  const pushPlanned = (date: string, color: string) => {
    const entry = mark(date);
    if (!entry.planned.includes(color)) entry.planned.push(color);
  };

  for (const lesson of plan.lessons) pushPlanned(lesson.date, accents[lesson.course]);
  for (const stream of plan.streams) pushPlanned(stream.date, accents[stream.course]);
  for (const mock of plan.mocks) pushPlanned(mock.date, MOCK_ACCENT);

  for (const day of Object.values(days)) {
    const entry = mark(day.date);
    for (const course of day.courses) {
      const color = accents[course];
      if (!entry.activity.includes(color)) entry.activity.push(color);
    }
  }

  for (const [date, entry] of Object.entries(marks)) {
    entry.idle = entry.activity.length === 0 && date < today;
  }

  return marks;
}

/** Довідник уроків для історії: журнал зберігає лише id. */
export type LessonRef = {
  title: string;
  moduleTitle: string;
  href: string;
  course: CourseSlug;
};

export function lessonIndex(plan: StudyPlan): Record<string, LessonRef> {
  const index: Record<string, LessonRef> = {};

  for (const lesson of plan.lessons) {
    index[`${lesson.course}:${lesson.id}`] = {
      title: lesson.title,
      moduleTitle: lesson.moduleTitle,
      href: lessonHref(lesson.course, lesson.id),
      course: lesson.course,
    };
  }

  for (const mock of plan.mocks) {
    if (!mock.lessonId) continue;
    index[`${mock.course}:${mock.lessonId}`] = {
      title: mock.title,
      moduleTitle: "Пробний НМТ",
      href: `${lessonHref(mock.course, mock.lessonId)}/homework`,
      course: mock.course,
    };
  }

  return index;
}
