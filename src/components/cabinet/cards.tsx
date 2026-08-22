"use client";

import Link from "next/link";
import { COURSE_CATALOG } from "@/lib/course/catalog";
import { uk } from "@/lib/plural";
import { MOCK_ACCENT, MOCK_ACCENT_SOFT } from "@/lib/schedule/config";
import { formatDayMonth, relativeDayLabel } from "@/lib/schedule/dates";
import type { PlanCourse, PlannedLesson, PlannedMock, PlannedStream } from "@/lib/schedule/types";
import type { LessonState } from "./agenda";
import { IconCheck, IconLock, IconStream } from "./icons";

export function CourseChip({ course }: { course: PlanCourse }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ background: course.accentSoft, color: course.accent }}
    >
      {course.short}
    </span>
  );
}

export function PlannedBadge({ date, today }: { date: string; today: string }) {
  const rel = relativeDayLabel(date, today);
  const future = date > today;
  return (
    <span
      className={`text-[11px] font-semibold ${future ? "text-forest/40" : "text-forest/35"}`}
      title={`За планом: ${formatDayMonth(date)}`}
    >
      {future ? "за планом " : ""}
      {rel ?? formatDayMonth(date)}
    </span>
  );
}

export function ProgressRing({ ratio }: { ratio: number }) {
  const size = 34;
  const r = 14;
  const c = 2 * Math.PI * r;
  const done = ratio >= 1;

  return (
    <span className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? "#16a34a" : "var(--teal)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, ratio))}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-forest/60">
        {done ? (
          <IconCheck className="h-3 w-3 text-[#16a34a]" />
        ) : ratio > 0 ? (
          `${Math.round(ratio * 100)}`
        ) : null}
      </span>
    </span>
  );
}

function ActionLink({
  href,
  label,
  muted,
}: {
  href: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        muted
          ? "border-line text-forest/60 hover:border-forest/30 hover:text-forest"
          : "border-transparent bg-forest text-white hover:bg-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export function LessonCard({
  lesson,
  course,
  state,
  open,
  today,
}: {
  lesson: PlannedLesson;
  course: PlanCourse;
  state: LessonState;
  open: boolean;
  today: string;
}) {
  const nav = COURSE_CATALOG[lesson.course].nav;
  const base = `/cabinet/courses/${lesson.course}/${lesson.id}`;

  return (
    <li
      className={`rounded-2xl border bg-white p-4 transition ${
        open ? "border-line hover:border-teal/35" : "border-dashed border-line/70"
      }`}
    >
      <div className="flex items-start gap-3">
        {open ? <ProgressRing ratio={state.ratio} /> : <IconLock className="mt-1 h-5 w-5 text-forest/25" />}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CourseChip course={course} />
            <span className="truncate text-[11px] font-medium text-forest/45">
              {lesson.moduleTitle}
            </span>
            <PlannedBadge date={lesson.date} today={today} />
          </div>

          <h3 className="mt-1.5 leading-snug font-semibold text-ink">{lesson.title}</h3>

          {lesson.objective && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-forest/60">
              {lesson.objective}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-forest/45">
            {lesson.cards > 0 && (
              <span>
                {uk.cards(lesson.cards)}
                {state.cardsSeen > 0 ? ` · переглянуто ${Math.min(state.cardsSeen, lesson.cards)}` : ""}
              </span>
            )}
            {lesson.tasks > 0 && <span>{uk.tasks(lesson.tasks)}</span>}
            {lesson.isSkeleton && <span className="text-amber">матеріал доповнюється</span>}
          </div>

          {open ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <ActionLink href={base} label={nav.theory} />
              {nav.notes && lesson.hasNotes && (
                <ActionLink href={`${base}/notes`} label={nav.notes} muted />
              )}
              {lesson.cards > 0 && <ActionLink href={`${base}/cards`} label={nav.cards} muted />}
              {lesson.tasks > 0 && (
                <ActionLink href={`${base}/homework`} label={nav.homework} muted />
              )}
            </div>
          ) : (
            <p className="mt-3 text-xs font-medium text-forest/40">
              Відкриється {formatDayMonth(lesson.date)}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export function StreamCard({
  stream,
  course,
  today,
}: {
  stream: PlannedStream;
  course: PlanCourse;
  today: string;
}) {
  const isToday = stream.date === today;
  const isPast = stream.date < today;
  const materialsHref = stream.lessonIds[0]
    ? `/cabinet/courses/${stream.course}/${stream.lessonIds[0]}`
    : null;

  return (
    <li
      className={`rounded-2xl border bg-white p-4 ${
        isToday ? "border-teal/45 shadow-[0_10px_30px_rgba(192,38,211,0.1)]" : "border-line"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: course.accentSoft, color: course.accent }}
        >
          <IconStream />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CourseChip course={course} />
            <span className="text-[11px] font-semibold text-forest/45">
              {formatDayMonth(stream.date)}, {stream.time}
            </span>
            {isToday && (
              <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold text-white">
                СЬОГОДНІ
              </span>
            )}
          </div>

          <h3 className="mt-1.5 leading-snug font-semibold text-ink">{stream.title}</h3>
          <p className="mt-1 text-sm text-forest/60">
            {stream.teacher} · {stream.durationMin} хв · тиждень {stream.weekIndex}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {stream.joinUrl ? (
              <a
                href={stream.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-white"
              >
                {isPast ? "Дивитись запис" : "Приєднатися"}
              </a>
            ) : (
              <span className="rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-medium text-forest/45">
                {isPast ? "Запис буде додано" : "Посилання зʼявиться перед ефіром"}
              </span>
            )}
            {materialsHref && <ActionLink href={materialsHref} label="Матеріали теми" muted />}
          </div>
        </div>
      </div>
    </li>
  );
}

export function MockCard({
  mock,
  course,
  open,
  today,
}: {
  mock: PlannedMock;
  course: PlanCourse;
  open: boolean;
  today: string;
}) {
  const href = mock.lessonId ? `/cabinet/courses/${mock.course}/${mock.lessonId}/homework` : null;
  const isToday = mock.date === today;

  return (
    <li
      className={`rounded-2xl border bg-white p-4 ${
        open ? "border-line" : "border-dashed border-line/70"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
          style={{
            background: open ? MOCK_ACCENT_SOFT : "var(--mist)",
            color: open ? MOCK_ACCENT : "rgba(42,32,56,0.35)",
          }}
        >
          {mock.index}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CourseChip course={course} />
            <span className="text-[11px] font-semibold text-forest/45 capitalize">
              {mock.monthLabel}
            </span>
            {isToday && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ background: MOCK_ACCENT }}
              >
                ВІДКРИВАЄТЬСЯ СЬОГОДНІ
              </span>
            )}
          </div>

          <h3 className="mt-1.5 font-semibold text-ink">{mock.title}</h3>
          <p className="mt-1 text-sm text-forest/60">
            {uk.tasks(mock.tasks)} · {mock.minutes} хв · до {mock.maxScore} балів
          </p>

          <div className="mt-3">
            {!open ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-forest/45">
                <IconLock className="h-3.5 w-3.5" />
                Відкриється {formatDayMonth(mock.date)}
              </span>
            ) : href ? (
              <ActionLink href={href} label="Пройти пробний" />
            ) : (
              <span className="rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-medium text-forest/45">
                Варіант буде додано
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 px-5 py-10 text-center">
      <p className="font-semibold text-forest/70">{title}</p>
      {hint && <p className="mt-1.5 text-sm text-forest/50">{hint}</p>}
    </div>
  );
}
