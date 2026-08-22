"use client";

import Link from "next/link";
import { uk } from "@/lib/plural";
import { isLessonOpen, isMockOpen } from "@/lib/schedule/access";
import { MOCK_ACCENT, MOCK_ACCENT_SOFT } from "@/lib/schedule/config";
import { formatDayMonth, formatDayRange } from "@/lib/schedule/dates";
import { CourseChip } from "./cards";
import { IconArrow, IconCheck, IconLock, IconMock, IconStream } from "./icons";
import type { LessonStep, WeekCourseGroup, WeekDay, WeekLessonItem, WeekOverview } from "./week";

/* ────────────────────────  Заголовок і навігація по тижнях  ──────────────────────── */

export function WeekSwitcher({
  overview,
  weeksTotal,
  onShift,
  onCurrent,
  canPrev,
  canNext,
}: {
  overview: WeekOverview;
  weeksTotal: number;
  onShift: (delta: number) => void;
  onCurrent: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  const { week, phase } = overview;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
            Тиждень {week.index}
          </h2>
          <span className="text-sm text-forest/40">з {weeksTotal}</span>
          {phase === "current" && (
            <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold text-white">
              ЗАРАЗ
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-forest/55">{formatDayRange(week.start, week.end)}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {phase !== "current" && (
          <button
            type="button"
            onClick={onCurrent}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-forest/70 transition hover:border-forest/30 hover:text-forest"
          >
            Цей тиждень
          </button>
        )}
        <button
          type="button"
          onClick={() => onShift(-1)}
          disabled={!canPrev}
          aria-label="Попередній тиждень"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-forest/55 transition hover:border-forest/30 hover:text-forest disabled:pointer-events-none disabled:opacity-30"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => onShift(1)}
          disabled={!canNext}
          aria-label="Наступний тиждень"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-forest/55 transition hover:border-forest/30 hover:text-forest disabled:pointer-events-none disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────  Пульс тижня  ──────────────────────── */

export function WeekPulse({
  overview,
  onSelectDay,
  selectedDay,
}: {
  overview: WeekOverview;
  onSelectDay: (iso: string) => void;
  selectedDay: string | null;
}) {
  const { done, total, ratio } = overview;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-ink">
          {total > 0 ? `${done} з ${total} кроків` : "Без нових тем"}
        </p>
        {total > 0 && (
          <p className="text-xs font-semibold text-forest/50">{Math.round(ratio * 100)}%</p>
        )}
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-teal transition-[width] duration-700"
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>

      <RhythmStrip days={overview.days} onSelect={onSelectDay} selected={selectedDay} />

      <p className="mt-2 text-center text-xs text-forest/45">
        Натисни на день — побачиш, коли почав і що встиг
      </p>
    </div>
  );
}

/** Сім днів тижня — великі кольорові клітинки, клік відкриває деталі дня. */
const DAY_COLORS = [
  { bg: "#2563eb", soft: "#e8effd", text: "#1d4ed8" },
  { bg: "#c026d3", soft: "#fbeafd", text: "#a21caf" },
  { bg: "#ea580c", soft: "#fff0e6", text: "#c2410c" },
  { bg: "#16a34a", soft: "#ecfdf3", text: "#15803d" },
  { bg: "#d97706", soft: "#fffbeb", text: "#b45309" },
  { bg: "#ec4899", soft: "#fdf2f8", text: "#db2777" },
  { bg: "#64748b", soft: "#f1f5f9", text: "#475569" },
] as const;

export function RhythmStrip({
  days,
  onSelect,
  selected,
}: {
  days: WeekDay[];
  onSelect: (iso: string) => void;
  selected: string | null;
}) {
  return (
    <div className="mt-4 grid grid-cols-7 gap-2 sm:gap-2.5">
      {days.map((day, i) => {
        const color = DAY_COLORS[i];
        const isSelected = day.iso === selected;
        const worked = day.worked;

        return (
          <button
            key={day.iso}
            type="button"
            onClick={() => onSelect(day.iso)}
            title={formatDayMonth(day.iso)}
            className={`flex flex-col items-center justify-center rounded-2xl py-3 sm:py-4 transition ${
              isSelected
                ? "ring-2 ring-offset-2 shadow-md"
                : "hover:scale-[1.03] hover:shadow-sm"
            } ${day.isToday && !isSelected ? "ring-1 ring-teal/40" : ""}`}
            style={{
              background: worked ? color.bg : color.soft,
              color: worked ? "#fff" : color.text,
              ...(isSelected ? { ringColor: color.bg } : {}),
            }}
          >
            <span className="text-[11px] font-bold uppercase opacity-80">{day.short}</span>
            <span className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold sm:text-2xl">
              {day.day}
            </span>
            {worked && (
              <span className="mt-1 text-[10px] font-semibold opacity-90">
                {day.closed > 0 ? `${day.closed} ✓` : "•"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────  План тижня по уроках  ──────────────────────── */

function StepChip({ step, accent }: { step: LessonStep; accent: string }) {
  return (
    <Link
      href={step.href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        step.done
          ? "border-transparent bg-[#f0fdf4] text-[#15803d]"
          : "border-line text-forest/65 hover:border-forest/35 hover:text-forest"
      }`}
    >
      {step.done ? (
        <IconCheck className="h-3 w-3" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      )}
      {step.label}
      {step.note && <span className="font-medium text-forest/40">{step.note}</span>}
    </Link>
  );
}

function LessonRow({
  item,
  accent,
  open,
}: {
  item: WeekLessonItem;
  accent: string;
  open: boolean;
}) {
  const { lesson, done, total } = item;
  const complete = done === total;

  return (
    <li className="border-t border-line/70 px-4 py-3.5 first:border-t-0">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
            complete ? "bg-[#dcfce7] text-[#15803d]" : "bg-mist text-forest/55"
          }`}
        >
          {complete ? <IconCheck className="h-3.5 w-3.5" /> : `${done}/${total}`}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="leading-snug font-semibold text-ink">{lesson.title}</h4>
          </div>

          {open ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {item.steps.map((step) => (
                <StepChip key={step.kind} step={step} accent={accent} />
              ))}
            </div>
          ) : (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-forest/40">
              <IconLock className="h-3.5 w-3.5" />
              Відкриється {formatDayMonth(lesson.date)}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export function WeekCourseBlock({
  group,
  today,
}: {
  group: WeekCourseGroup;
  today: string;
}) {
  const { course, stream, lessons, mocks, done, total } = group;

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line/70 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <CourseChip course={course} />
          <h3 className="font-semibold text-ink">{course.label}</h3>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-forest/50">
            {total > 0 ? `${done} / ${total} кроків` : "повторення"}
          </span>
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-mist">
            <span
              className="block h-full rounded-full transition-[width] duration-700"
              style={{
                width: `${total > 0 ? (done / total) * 100 : 0}%`,
                background: course.accent,
              }}
            />
          </span>
        </div>
      </header>

      {stream && (
        <div className="border-b border-line/70 bg-mist/40 px-4 py-2 text-xs font-semibold" style={{ color: course.accent }}>
          <IconStream className="mr-1.5 inline h-3.5 w-3.5" />
          Ефір {formatDayMonth(stream.date)}, {stream.time}
        </div>
      )}

      {lessons.length === 0 ? (
        <p className="px-4 py-4 text-sm text-forest/50">
          Нових тем немає — тиждень на повторення та пробні.
        </p>
      ) : (
        <ul>
          {lessons.map((item) => (
            <LessonRow
              key={item.lesson.id}
              item={item}
              accent={course.accent}
              open={isLessonOpen(item.lesson.date, today)}
            />
          ))}
        </ul>
      )}

      {mocks.map((mock) => {
        const open = isMockOpen(mock.date, today);
        const href = mock.lessonId
          ? `/cabinet/courses/${mock.course}/${mock.lessonId}/homework`
          : "/cabinet/mocks";
        return (
          <div
            key={mock.id}
            className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 px-4 py-3"
            style={{ background: MOCK_ACCENT_SOFT }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <span style={{ color: MOCK_ACCENT }}>
                <IconMock className="h-4 w-4" />
              </span>
              {mock.title}
            </span>
            {open ? (
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-xs font-bold"
                style={{ color: MOCK_ACCENT }}
              >
                Пройти
                <IconArrow className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="text-xs font-medium text-forest/45">
                Відкриється {formatDayMonth(mock.date)}
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}

/* ────────────────────────  Борг з минулих тижнів  ──────────────────────── */

export function WeekDebtBlock({
  steps,
  weeks,
  lessons,
}: {
  steps: number;
  weeks: number;
  lessons: WeekLessonItem[];
}) {
  return (
    <section className="rounded-2xl border border-amber/45 bg-amber-soft/45 p-4">
      <h3 className="text-sm font-semibold text-ink">
        Хвіст з попередніх тижнів: {uk.steps(steps)}
      </h3>
      <p className="mt-1 text-xs text-forest/55">
        Незакрите з {uk.weeks(weeks)}. Це не дедлайн — просто те, що варто підтягнути.
      </p>
      <ul className="mt-3 space-y-2">
        {lessons.map((item) => (
          <li key={`${item.lesson.course}-${item.lesson.id}`} className="flex flex-wrap items-center gap-2">
            <Link
              href={`/cabinet/courses/${item.lesson.course}/${item.lesson.id}`}
              className="truncate text-sm font-medium text-forest/80 underline-offset-2 hover:underline"
            >
              {item.lesson.title}
            </Link>
            <span className="text-xs text-forest/45">
              тиждень {item.lesson.weekIndex} · {item.total - item.done} з {item.total} кроків
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
