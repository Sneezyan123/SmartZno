"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ActivityEntry } from "@/lib/activity/log";
import { uk } from "@/lib/plural";
import { MOCK_ACCENT } from "@/lib/schedule/config";
import {
  formatDayMonth,
  formatDayRange,
  formatFullDate,
  monthKey,
  relativeDayLabel,
} from "@/lib/schedule/dates";
import type { StudyPlan } from "@/lib/schedule/types";
import { accentMap, agendaFor, courseMap, upcomingAfter } from "./agenda";
import { Calendar } from "./Calendar";
import { CourseChip } from "./cards";
import { useActivity, useProgress, useToday } from "./hooks";
import { IconArrow, IconCheck, IconFlame } from "./icons";
import {
  anchorWeek,
  buildDayMarks,
  buildWeekOverview,
  lessonIndex,
  stepLabel,
  weekLessonItem,
} from "./week";

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-forest/45">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-forest/45">{hint}</p>}
    </div>
  );
}

function entryDetail(entry: ActivityEntry): string | null {
  if (entry.kind === "cards" && entry.cards) return `${uk.cards(entry.cards)} переглянуто`;
  if (entry.kind === "homework" && entry.score) {
    return `${entry.score.correct} з ${entry.score.total} правильно`;
  }
  if (entry.kind === "homework") return "у процесі";
  return null;
}

export function CalendarClient({ plan }: { plan: StudyPlan }) {
  const today = useToday();
  const progress = useProgress();
  const activity = useActivity();

  const [selected, setSelected] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);

  const courses = useMemo(() => courseMap(plan.courses), [plan.courses]);
  const accents = useMemo(() => accentMap(plan.courses), [plan.courses]);
  const lessons = useMemo(() => lessonIndex(plan), [plan]);
  const marks = useMemo(
    () => (today ? buildDayMarks(plan, activity.days, today) : {}),
    [plan, activity.days, today],
  );

  const history = useMemo(() => {
    if (!today) return [];
    return plan.weeks
      .filter((w) => w.start <= today)
      .map((w) => buildWeekOverview(plan, w, progress, activity.days, today))
      .reverse();
  }, [plan, progress, activity.days, today]);

  const totals = useMemo(() => {
    const items = plan.lessons.map((lesson) => weekLessonItem(lesson, progress));
    return {
      done: items.reduce((sum, i) => sum + i.done, 0),
      total: items.reduce((sum, i) => sum + i.total, 0),
    };
  }, [plan.lessons, progress]);

  if (!today) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/70" />;
  }

  const day = selected ?? today;
  const dayInfo = activity.days[day];
  const planned = agendaFor(plan, day);
  const next = upcomingAfter(plan, day, 3);
  const week = anchorWeek(plan, day);

  const workedDays = Object.keys(activity.days).length;
  const activeWeeks = new Set(
    Object.keys(activity.days)
      .map((iso) => plan.weeks.find((w) => iso >= w.start && iso <= w.end)?.index)
      .filter((i): i is number => Boolean(i)),
  ).size;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold tracking-[0.16em] text-teal uppercase">Історія роботи</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink md:text-3xl">
          Календар
        </h1>
        <p className="mt-2 max-w-2xl text-forest/65">
          Кожна заповнена крапка — день, коли ти щось закрив. Порожня — те, що було за планом.
          Дивись, у які дні ти реально працюєш, і підлаштовуй тиждень під себе.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Днів з роботою"
          value={String(workedDays)}
          hint={`за весь час у кабінеті`}
        />
        <StatCard
          label="Серія"
          value={activity.streak > 0 ? uk.days(activity.streak) : "—"}
          hint="днів підряд"
          icon={<IconFlame className="h-3.5 w-3.5 text-teal" />}
        />
        <StatCard
          label="Кроків закрито"
          value={`${totals.done} / ${totals.total}`}
          hint="теорія, картки, завдання"
          icon={<IconCheck className="h-3.5 w-3.5 text-[#16a34a]" />}
        />
        <StatCard
          label="Активних тижнів"
          value={String(activeWeeks)}
          hint={`з ${plan.weeks.length} у році`}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Calendar
          month={month ?? monthKey(day)}
          onMonthChange={setMonth}
          selected={day}
          onSelect={(iso) => {
            setSelected(iso);
            setMonth(monthKey(iso));
          }}
          today={today}
          marks={marks}
          minISO={plan.startISO}
          maxISO={plan.endISO}
          weekRange={week}
          size="lg"
        />

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-forest/45 first-letter:uppercase">
            {relativeDayLabel(day, today) ?? "День"}
          </p>
          <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-semibold text-ink first-letter:uppercase">
            {formatFullDate(day)}
          </h2>
          <Link
            href={`/cabinet?week=${week.index}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-teal"
          >
            Тиждень {week.index} · {formatDayRange(week.start, week.end)}
            <IconArrow className="h-3.5 w-3.5" />
          </Link>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-ink">Що ти зробив</h3>
            {dayInfo ? (
              <ul className="mt-2 space-y-2.5">
                {dayInfo.entries.map((entry, i) => {
                  const ref = lessons[`${entry.course}:${entry.lessonId}`];
                  const detail = entryDetail(entry);
                  return (
                    <li key={`${entry.lessonId}-${entry.kind}-${i}`} className="flex gap-2.5">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: accents[entry.course] }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm leading-snug font-medium text-forest/80">
                          {ref ? (
                            <Link href={ref.href} className="underline-offset-2 hover:underline">
                              {ref.title}
                            </Link>
                          ) : (
                            entry.lessonId
                          )}
                        </p>
                        <p className="text-xs text-forest/45">
                          {stepLabel(entry.course, entry.kind)}
                          {detail ? ` · ${detail}` : ""}
                          {entry.done ? " · закрито" : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-forest/45">
                {day > today ? "День ще не настав." : "Цього дня записів немає."}
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-line/70 pt-4">
            <h3 className="text-sm font-semibold text-ink">За планом на цей день</h3>
            {planned.total === 0 ? (
              <div className="mt-2 space-y-1 text-xs text-forest/45">
                <p>Нічого не заплановано.</p>
                {next.map((item) => (
                  <p key={item.key}>
                    Найближче — {formatDayMonth(item.date)}: {item.title}
                  </p>
                ))}
              </div>
            ) : (
              <ul className="mt-2 space-y-2">
                {planned.streams.map((stream) => (
                  <li key={stream.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <CourseChip course={courses[stream.course]} />
                    <span className="text-forest/70">Ефір, {stream.time}</span>
                  </li>
                ))}
                {planned.lessons.map((lesson) => (
                  <li key={`${lesson.course}-${lesson.id}`} className="flex flex-wrap items-center gap-2">
                    <CourseChip course={courses[lesson.course]} />
                    <Link
                      href={`/cabinet/courses/${lesson.course}/${lesson.id}`}
                      className="min-w-0 truncate text-sm text-forest/70 underline-offset-2 hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
                {planned.mocks.map((mock) => (
                  <li key={mock.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold" style={{ color: MOCK_ACCENT }}>
                      {mock.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
          Історія по тижнях
        </h2>
        <p className="mt-1 text-sm text-forest/55">
          Скільки кроків закрито і в які дні ти працював. Тиждень можна відкрити й догнати.
        </p>

        {history.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-sm text-forest/50">
            Навчальний рік ще не почався — історія зʼявиться з першого тижня.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {history.map((overview) => (
              <li
                key={overview.week.index}
                className="rounded-2xl border border-line bg-white px-4 py-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      Тиждень {overview.week.index}
                      {overview.phase === "current" && (
                        <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold text-white">
                          ЗАРАЗ
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-forest/45">
                      {formatDayRange(overview.week.start, overview.week.end)} ·{" "}
                      {overview.daysWorked} з 7 днів роботи
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {overview.days.map((d) => (
                      <span
                        key={d.iso}
                        title={`${d.short} ${formatDayMonth(d.iso)}`}
                        className={`h-2.5 w-2.5 rounded-full ${
                          d.worked
                            ? "bg-teal"
                            : d.isFuture
                              ? "border border-dashed border-forest/25"
                              : "border border-forest/20"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-forest/55">
                      {overview.total > 0 ? `${overview.done} / ${overview.total}` : "—"}
                    </span>
                    <span className="h-1.5 w-20 overflow-hidden rounded-full bg-mist">
                      <span
                        className="block h-full rounded-full bg-teal"
                        style={{ width: `${Math.round(overview.ratio * 100)}%` }}
                      />
                    </span>
                    <Link
                      href={`/cabinet?week=${overview.week.index}`}
                      className="text-xs font-bold text-teal"
                    >
                      Відкрити
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
