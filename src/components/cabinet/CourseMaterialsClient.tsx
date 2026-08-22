"use client";

import { useMemo, useState } from "react";
import type { CourseSlug } from "@/lib/course/types";
import { uk } from "@/lib/plural";
import { isLessonOpen } from "@/lib/schedule/access";
import { COURSE_SCHEDULE, RELEASE } from "@/lib/schedule/config";
import { formatDayMonth } from "@/lib/schedule/dates";
import type { PlannedLesson, StudyPlan } from "@/lib/schedule/types";
import { courseMap, lessonState, type AllProgress } from "./agenda";
import { CourseChip, EmptyState, LessonCard, StreamCard } from "./cards";
import { useProgress, useToday } from "./hooks";
import { IconCards, IconLecture, IconStream } from "./icons";

type TabId = "all" | "streams" | "cards";

const TABS: { id: TabId; label: string; Icon: typeof IconStream }[] = [
  { id: "all", label: "Усі теми", Icon: IconLecture },
  { id: "streams", label: "Ефіри", Icon: IconStream },
  { id: "cards", label: "Квізкарти", Icon: IconCards },
];

export function CourseMaterialsClient({
  plan,
  course,
  initialTab = "all",
}: {
  plan: StudyPlan;
  course: CourseSlug;
  initialTab?: TabId;
}) {
  const today = useToday();
  const progress = useProgress();
  const [tab, setTab] = useState<TabId>(initialTab);
  const [query, setQuery] = useState("");
  const [showFuture, setShowFuture] = useState(RELEASE.lessons === "open");

  const courses = useMemo(() => courseMap(plan.courses), [plan.courses]);
  const meta = courses[course];
  const schedule = COURSE_SCHEDULE[course];

  if (!today) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/70" />;
  }

  const needle = query.trim().toLowerCase();
  const matchesQuery = (...fields: string[]) =>
    needle === "" || fields.some((f) => f.toLowerCase().includes(needle));

  const lessons = plan.lessons
    .filter(
      (l) =>
        l.course === course &&
        matchesQuery(l.title, l.moduleTitle, l.nmtSection) &&
        (showFuture || isLessonOpen(l.date, today)),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const streams = plan.streams
    .filter(
      (s) =>
        s.course === course && matchesQuery(s.title, s.moduleTitle, s.teacher),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const cardLessons = lessons.filter((l) => l.cards > 0);
  const doneCount = lessons.filter(
    (l) => lessonState(l, progress[course][l.id]).ratio >= 1,
  ).length;

  return (
    <div className="mx-auto max-w-3xl">
      <header
        className="rounded-2xl border border-line p-5 md:p-6"
        style={{ background: schedule.accentSoft }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <CourseChip course={meta} />
          <span className="text-xs font-semibold text-forest/50">
            {doneCount} / {lessons.length} тем
          </span>
        </div>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink md:text-3xl">
          {schedule.label}
        </h1>
        <p className="mt-2 text-sm text-forest/65">
          Усі теми курсу по черзі — від першого тижня до кінця року.
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{
              width: `${lessons.length ? (doneCount / lessons.length) * 100 : 0}%`,
              background: schedule.accent,
            }}
          />
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "text-white"
                : "border border-line bg-white text-forest/65 hover:border-forest/25 hover:text-forest"
            }`}
            style={tab === t.id ? { background: schedule.accent } : undefined}
          >
            <t.Icon />
            {t.label}
          </button>
        ))}

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук…"
          className="ml-auto min-w-[10rem] flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink outline-none placeholder:text-forest/35 focus:border-teal/50 sm:flex-none"
        />
      </div>

      {tab !== "streams" && RELEASE.lessons === "scheduled" && (
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium text-forest/60">
          <input
            type="checkbox"
            checked={showFuture}
            onChange={(e) => setShowFuture(e.target.checked)}
            className="h-4 w-4 accent-[color:var(--teal)]"
          />
          Показувати майбутні за планом
        </label>
      )}

      <div className="mt-6">
        {tab === "streams" && (
          <StreamsTab streams={streams} courses={courses} today={today} accent={schedule.accent} />
        )}

        {tab === "all" &&
          (lessons.length === 0 ? (
            <EmptyState title="Нічого не знайдено" hint="Спробуйте інший запит." />
          ) : (
            <OrderedLessons
              lessons={lessons}
              course={meta}
              today={today}
              progress={progress}
              accent={schedule.accent}
            />
          ))}

        {tab === "cards" &&
          (cardLessons.length === 0 ? (
            <EmptyState title="Квізкарт поки немає" />
          ) : (
            <CardsTab
              lessons={cardLessons}
              course={meta}
              today={today}
              progress={progress}
              accent={schedule.accent}
            />
          ))}
      </div>
    </div>
  );
}

function StreamsTab({
  streams,
  courses,
  today,
  accent,
}: {
  streams: StudyPlan["streams"];
  courses: ReturnType<typeof courseMap>;
  today: string;
  accent: string;
}) {
  if (streams.length === 0) {
    return <EmptyState title="Ефірів поки немає" />;
  }

  const upcoming = streams.filter((s) => s.date >= today);
  const past = streams.filter((s) => s.date < today).reverse();

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Найближчі
          </h2>
          <ul className="mt-3 space-y-3">
            {upcoming.map((s) => (
              <StreamCard key={s.id} stream={s} course={courses[s.course]} today={today} />
            ))}
          </ul>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold tracking-[0.14em] text-forest/40 uppercase">Записи</h2>
          <ul className="mt-3 space-y-3">
            {past.map((s) => (
              <StreamCard key={s.id} stream={s} course={courses[s.course]} today={today} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Теми одного предмета — строго по черзі, з номером і тижнем. */
function OrderedLessons({
  lessons,
  course,
  today,
  progress,
  accent,
}: {
  lessons: PlannedLesson[];
  course: ReturnType<typeof courseMap>[CourseSlug];
  today: string;
  progress: AllProgress;
  accent: string;
}) {
  return (
    <ol className="space-y-3">
      {lessons.map((lesson, index) => {
        const state = lessonState(lesson, progress[lesson.course][lesson.id]);
        const open = isLessonOpen(lesson.date, today);
        return (
          <li key={`${lesson.course}-${lesson.id}`} className="flex gap-3">
            <span
              className="mt-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: state.ratio >= 1 ? "#dcfce7" : `${accent}18`,
                color: state.ratio >= 1 ? "#15803d" : accent,
              }}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[11px] font-semibold text-forest/40">
                Тиждень {lesson.weekIndex} · {formatDayMonth(lesson.date)}
              </p>
              <ul>
                <LessonCard
                  lesson={lesson}
                  course={course}
                  state={state}
                  open={open}
                  today={today}
                />
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function CardsTab({
  lessons,
  course,
  today,
  progress,
  accent,
}: {
  lessons: PlannedLesson[];
  course: ReturnType<typeof courseMap>[CourseSlug];
  today: string;
  progress: AllProgress;
  accent: string;
}) {
  const totalCards = lessons.reduce((sum, l) => sum + l.cards, 0);
  const seenCards = lessons.reduce((sum, l) => {
    const seen = progress[l.course][l.id]?.cardsSeen?.length ?? 0;
    return sum + Math.min(seen, l.cards);
  }, 0);

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-sm font-semibold text-ink">
          {seenCards} / {totalCards} карток · {uk.sets(lessons.length)}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{
              width: `${totalCards ? (seenCards / totalCards) * 100 : 0}%`,
              background: accent,
            }}
          />
        </div>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {lessons.map((lesson) => {
          const seen = Math.min(
            progress[lesson.course][lesson.id]?.cardsSeen?.length ?? 0,
            lesson.cards,
          );
          const open = isLessonOpen(lesson.date, today);

          return (
            <li
              key={`${lesson.course}-${lesson.id}`}
              className={`rounded-2xl border bg-white p-4 ${
                open ? "border-line hover:border-teal/35" : "border-dashed border-line/70"
              }`}
            >
              <h3 className="leading-snug font-semibold text-ink">{lesson.title}</h3>
              <p className="mt-1 text-xs text-forest/50">
                {uk.cards(lesson.cards)} · переглянуто {seen}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${lesson.cards ? (seen / lesson.cards) * 100 : 0}%`,
                    background: accent,
                  }}
                />
              </div>
              {open ? (
                <a
                  href={`/cabinet/courses/${lesson.course}/${lesson.id}/cards`}
                  className="mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ background: accent }}
                >
                  {seen > 0 ? "Продовжити" : "Почати"}
                </a>
              ) : (
                <p className="mt-3 text-xs font-medium text-forest/40">
                  Відкриється {formatDayMonth(lesson.date)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
