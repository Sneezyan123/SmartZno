"use client";

import Link from "next/link";
import type { DayActivity } from "@/lib/activity/log";
import type { CourseSlug } from "@/lib/course/types";
import { formatDayMonth, formatFullDate, relativeDayLabel } from "@/lib/schedule/dates";
import type { PlanCourse } from "@/lib/schedule/types";
import { stepLabel, type LessonRef } from "./week";

function formatTimeKyiv(iso: string): string {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      timeZone: "Europe/Kyiv",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(11, 16);
  }
}

function entryProgress(
  course: CourseSlug,
  kind: "theory" | "cards" | "homework",
  entry: DayActivity["entries"][0],
): string {
  if (kind === "theory") return entry.done ? "прочитано" : "почав читати";
  if (kind === "cards") {
    if (entry.done) return "картки закриті";
    if (entry.cards) return `${entry.cards} карток переглянуто`;
    return "почав картки";
  }
  if (entry.score) return `${entry.score.correct} з ${entry.score.total} правильно`;
  if (entry.done) return "завдання здано";
  return "почав завдання";
}

export function DayDetailPanel({
  date,
  today,
  dayInfo,
  courses,
  lessons,
  onClose,
}: {
  date: string;
  today: string;
  dayInfo: DayActivity | undefined;
  courses: Record<CourseSlug, PlanCourse>;
  lessons: Record<string, LessonRef>;
  onClose: () => void;
}) {
  const rel = relativeDayLabel(date, today);
  const future = date > today;
  const firstAt = dayInfo?.entries[0]?.at;

  return (
    <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_30px_rgba(11,6,20,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-teal uppercase">
            {rel ?? formatDayMonth(date)}
          </p>
          <h3 className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-semibold text-ink first-letter:uppercase">
            {formatFullDate(date)}
          </h3>
          {firstAt && (
            <p className="mt-1 text-sm text-forest/55">
              Почав о <span className="font-semibold text-ink">{formatTimeKyiv(firstAt)}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-forest/40 transition hover:bg-mist hover:text-forest"
        >
          ×
        </button>
      </div>

      {dayInfo ? (
        <ul className="mt-4 space-y-3">
          {dayInfo.entries.map((entry, i) => {
            const ref = lessons[`${entry.course}:${entry.lessonId}`];
            const kindLabel = stepLabel(entry.course, entry.kind);
            const progress = entryProgress(entry.course, entry.kind, entry);
            return (
              <li
                key={`${entry.lessonId}-${entry.kind}-${i}`}
                className="flex gap-3 rounded-xl bg-mist/50 px-3 py-2.5"
              >
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: courses[entry.course]?.accent ?? "#888" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">
                    {ref ? (
                      <Link href={ref.href} className="underline-offset-2 hover:underline">
                        {ref.title}
                      </Link>
                    ) : (
                      entry.lessonId
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-forest/55">
                    {courses[entry.course]?.short} · {kindLabel} · {formatTimeKyiv(entry.at)}
                  </p>
                  <p className="mt-1 text-sm text-forest/70">{progress}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-forest/50">
          {future ? "Цей день ще попереду." : "Цього дня ти не працював."}
        </p>
      )}
    </div>
  );
}

export function AdminDemoBanner({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (on: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-teal/40 bg-teal/5 px-4 py-3 text-sm">
      <span className="text-forest/70">
        <span className="font-semibold text-ink">Демо для адміна</span> — показати приклад
        заповненого тижня
      </span>
      <button
        type="button"
        onClick={() => onToggle(!active)}
        className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
          active ? "bg-teal text-white" : "border border-teal/50 text-teal"
        }`}
      >
        {active ? "Демо увімкнено" : "Увімкнути демо"}
      </button>
    </div>
  );
}
