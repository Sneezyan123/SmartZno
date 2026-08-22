import type { CourseSlug } from "@/lib/course/types";

export type PlanCourse = {
  slug: CourseSlug;
  label: string;
  short: string;
  accent: string;
  accentSoft: string;
  title: string;
  nmtFormat: { tasks: number; minutes: number; maxScore: number };
  lessonsTotal: number;
};

export type StudyWeek = {
  index: number;
  start: string;
  end: string;
};

export type PlannedLesson = {
  id: string;
  course: CourseSlug;
  title: string;
  moduleId: string;
  moduleTitle: string;
  nmtSection: string;
  isSkeleton: boolean;
  cards: number;
  tasks: number;
  objective: string | null;
  weekIndex: number;
  date: string;
  hasNotes: boolean;
};

export type PlannedStream = {
  id: string;
  course: CourseSlug;
  title: string;
  moduleTitle: string;
  date: string;
  time: string;
  durationMin: number;
  teacher: string;
  weekIndex: number;
  lessonIds: string[];
  joinUrl: string | null;
};

export type PlannedMock = {
  id: string;
  course: CourseSlug;
  index: number;
  title: string;
  monthLabel: string;
  date: string;
  lessonId: string | null;
  tasks: number;
  minutes: number;
  maxScore: number;
};

export type StudyPlan = {
  startISO: string;
  endISO: string;
  label: string;
  weeks: StudyWeek[];
  courses: PlanCourse[];
  lessons: PlannedLesson[];
  streams: PlannedStream[];
  mocks: PlannedMock[];
};
