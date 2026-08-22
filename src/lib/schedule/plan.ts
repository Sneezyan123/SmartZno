import { getCurriculum, getLesson } from "@/lib/course";
import { COURSE_CATALOG } from "@/lib/course/catalog";
import type { CourseSlug, Curriculum, Lesson } from "@/lib/course/types";
import { COURSE_SCHEDULE, MOCK_MONTHS, YEAR_END, YEAR_START } from "./config";
import { getToday } from "@/lib/dev/today";
import {
  addDays,
  diffDays,
  getMonth,
  makeISO,
  monthTitle,
  startOfWeek,
} from "./dates";
import type {
  PlanCourse,
  PlannedLesson,
  PlannedMock,
  PlannedStream,
  StudyPlan,
  StudyWeek,
} from "./types";

const COURSES: CourseSlug[] = ["math", "history"];

function isMockModule(title: string, nmtSection: string): boolean {
  const probe = `${title} ${nmtSection}`.toLowerCase();
  return probe.includes("mock") || probe.includes("пробн");
}

/** Навчальний рік, у якому ми зараз: з липня вважаємо, що почався новий. */
function resolveYearStart(): number {
  const today = getToday();
  const year = Number(today.slice(0, 4));
  return getMonth(today) >= 7 ? year : year - 1;
}

function buildWeeks(startISO: string, endISO: string): StudyWeek[] {
  const first = startOfWeek(startISO);
  const last = startOfWeek(endISO);
  const count = Math.floor(diffDays(first, last) / 7) + 1;

  return Array.from({ length: count }, (_, i) => {
    const start = addDays(first, i * 7);
    return { index: i + 1, start, end: addDays(start, 6) };
  });
}

/** Дати, у які цей курс може видавати новий урок. */
function lessonSlots(weeks: StudyWeek[], weekdays: number[], startISO: string, endISO: string) {
  const slots: { date: string; weekIndex: number }[] = [];
  for (const week of weeks) {
    for (const weekday of weekdays) {
      const date = addDays(week.start, weekday - 1);
      if (date < startISO || date > endISO) continue;
      slots.push({ date, weekIndex: week.index });
    }
  }
  return slots;
}

type CourseContent = {
  curriculum: Curriculum;
  regular: { lesson: Lesson; moduleTitle: string; nmtSection: string }[];
  mockLessonIds: string[];
};

function readCourse(course: CourseSlug): CourseContent {
  const curriculum = getCurriculum(course);
  const regular: CourseContent["regular"] = [];
  const mockLessonIds: string[] = [];

  for (const mod of curriculum.modules) {
    const mock = isMockModule(mod.title, mod.nmtSection);
    for (const id of mod.lessonIds) {
      if (mock) {
        mockLessonIds.push(id);
        continue;
      }
      const lesson = getLesson(id, course);
      if (!lesson) continue;
      regular.push({ lesson, moduleTitle: mod.title, nmtSection: mod.nmtSection });
    }
  }

  return { curriculum, regular, mockLessonIds };
}

function buildPlan(): StudyPlan {
  const startYear = resolveYearStart();
  const startISO = makeISO(startYear, YEAR_START.month, YEAR_START.day);
  const endISO = makeISO(startYear + 1, YEAR_END.month, YEAR_END.day);
  const weeks = buildWeeks(startISO, endISO);

  const courses: PlanCourse[] = [];
  const lessons: PlannedLesson[] = [];
  const streams: PlannedStream[] = [];
  const mocks: PlannedMock[] = [];

  for (const course of COURSES) {
    const schedule = COURSE_SCHEDULE[course];
    const { curriculum, regular, mockLessonIds } = readCourse(course);

    courses.push({
      slug: course,
      label: schedule.label,
      short: schedule.short,
      accent: schedule.accent,
      accentSoft: schedule.accentSoft,
      title: curriculum.title,
      nmtFormat: {
        tasks: curriculum.nmtFormat.tasks,
        minutes: curriculum.nmtFormat.minutes,
        maxScore: curriculum.nmtFormat.maxScore,
      },
      lessonsTotal: regular.length,
    });

    // Уроки рівномірно розкладаємо по всьому році, а не «в стовпчик» з вересня.
    const slots = lessonSlots(weeks, schedule.lessonWeekdays, startISO, endISO);
    const planned: PlannedLesson[] = regular.map((entry, i) => {
      const slot = slots[Math.min(slots.length - 1, Math.floor((i * slots.length) / regular.length))];
      return {
        id: entry.lesson.id,
        course,
        title: entry.lesson.title,
        moduleId: entry.lesson.moduleId,
        moduleTitle: entry.moduleTitle,
        nmtSection: entry.nmtSection,
        isSkeleton: entry.lesson.status === "skeleton",
        cards: entry.lesson.quizCards?.length ?? 0,
        tasks: entry.lesson.homework?.length ?? 0,
        objective: entry.lesson.objectives?.[0] ?? null,
        weekIndex: slot.weekIndex,
        date: slot.date,
        hasNotes: (entry.lesson.notes?.length ?? 0) > 0,
      };
    });
    lessons.push(...planned);

    // Ефір раз на тиждень — тільки в тижні, де реально є нові теми.
    for (const week of weeks) {
      const weekLessons = planned.filter((l) => l.weekIndex === week.index);
      if (weekLessons.length === 0) continue;

      const date = addDays(week.start, schedule.stream.weekday - 1);
      if (date < startISO || date > endISO) continue;

      const moduleTitle = weekLessons[0].moduleTitle;
      streams.push({
        id: `${course}-stream-w${week.index}`,
        course,
        title: weekLessons.length === 1 ? weekLessons[0].title : moduleTitle,
        moduleTitle,
        date,
        time: schedule.stream.time,
        durationMin: schedule.stream.durationMin,
        teacher: schedule.stream.teacher,
        weekIndex: week.index,
        lessonIds: weekLessons.map((l) => l.id),
        joinUrl: null,
      });
    }

    // Пробні НМТ — першого числа кожного місяця, з вересня по травень.
    MOCK_MONTHS.forEach((month, i) => {
      const year = month >= YEAR_START.month ? startYear : startYear + 1;
      const date = makeISO(year, month, 1);
      mocks.push({
        id: `${course}-mock-${i + 1}`,
        course,
        index: i + 1,
        title: `Пробний НМТ №${i + 1}`,
        monthLabel: monthTitle(year, month),
        date,
        lessonId: mockLessonIds[i] ?? null,
        tasks: curriculum.nmtFormat.tasks,
        minutes: curriculum.nmtFormat.minutes,
        maxScore: curriculum.nmtFormat.maxScore,
      });
    });
  }

  lessons.sort((a, b) => a.date.localeCompare(b.date) || a.course.localeCompare(b.course));
  streams.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  mocks.sort((a, b) => a.date.localeCompare(b.date) || a.course.localeCompare(b.course));

  return {
    startISO,
    endISO,
    label: `${startYear}/${startYear + 1}`,
    weeks,
    courses,
    lessons,
    streams,
    mocks,
  };
}

let cached: StudyPlan | null = null;

/** Читає контент з диска один раз на процес — план однаковий для всіх учнів. */
export function getStudyPlan(): StudyPlan {
  if (!cached) cached = buildPlan();
  return cached;
}

export function lessonHref(course: CourseSlug, lessonId: string) {
  return `/cabinet/courses/${course}/${lessonId}`;
}

export function courseNav(course: CourseSlug) {
  return COURSE_CATALOG[course].nav;
}
