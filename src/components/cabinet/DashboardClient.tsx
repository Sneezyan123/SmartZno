"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isAdminDemo, seedDemoActivity, setAdminDemo } from "@/lib/activity/demo";
import { ACTIVITY_EVENT } from "@/lib/activity/log";
import type { CourseSlug } from "@/lib/course/types";
import { COURSE_SCHEDULE } from "@/lib/schedule/config";
import { formatDayMonth } from "@/lib/schedule/dates";
import type { StudyPlan } from "@/lib/schedule/types";
import { courseMap } from "./agenda";
import { AdminDemoBanner, DayDetailPanel } from "./DayDetailPanel";
import { useStudent } from "./CabinetShell";
import { useActivity, useProgress, useToday } from "./hooks";
import { IconArrow } from "./icons";
import { anchorWeek, buildWeekOverview, lessonIndex, weekOf } from "./week";
import { WeekCourseBlock, WeekPulse, WeekSwitcher } from "./WeekPlan";

const SUBJECTS: CourseSlug[] = ["math", "history"];

function SubjectWeekSection({
  course,
  group,
  today,
  href,
}: {
  course: CourseSlug;
  group: ReturnType<typeof buildWeekOverview>["groups"][0] | undefined;
  today: string;
  href: string;
}) {
  const schedule = COURSE_SCHEDULE[course];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          className="font-[family-name:var(--font-display)] text-lg font-semibold"
          style={{ color: schedule.accent }}
        >
          {schedule.label}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-bold"
          style={{ color: schedule.accent }}
        >
          Усі теми
          <IconArrow className="h-3.5 w-3.5" />
        </Link>
      </div>

      {!group || (group.lessons.length === 0 && !group.stream && group.mocks.length === 0) ? (
        <p className="mt-2 rounded-xl border border-dashed border-line bg-white/60 px-4 py-5 text-center text-sm text-forest/50">
          Нових тем цього тижня немає
        </p>
      ) : (
        <div className="mt-2">
          <WeekCourseBlock group={group} today={today} />
        </div>
      )}
    </section>
  );
}

export function DashboardClient({ plan }: { plan: StudyPlan }) {
  const me = useStudent();
  const today = useToday();
  const progress = useProgress();
  const activity = useActivity();

  const [weekIndex, setWeekIndex] = useState<number | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [demoOn, setDemoOn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    setDemoOn(isAdminDemo());
    setShowAdmin(
      isAdminDemo() ||
        new URLSearchParams(window.location.search).get("demo") === "1" ||
        process.env.NODE_ENV === "development",
    );
  }, []);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("week");
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1) setWeekIndex(Math.min(n, plan.weeks.length));
  }, [plan.weeks.length]);

  const courses = useMemo(() => courseMap(plan.courses), [plan.courses]);
  const lessons = useMemo(() => lessonIndex(plan), [plan]);

  const currentWeek = today ? anchorWeek(plan, today) : plan.weeks[0];
  const week = plan.weeks[Math.min((weekIndex ?? currentWeek.index) - 1, plan.weeks.length - 1)];

  useEffect(() => {
    if (!today || !demoOn) return;
    seedDemoActivity(today, week.start, plan, week.index);
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  }, [demoOn, today, week.start, week.index, plan]);

  if (!today) {
    return <div className="mx-auto h-80 max-w-3xl animate-pulse rounded-2xl bg-white/70" />;
  }

  const overview = buildWeekOverview(plan, week, progress, activity.days, today);
  const dayInfo = day ? activity.days[day] : undefined;
  const beforeYear = today < plan.startISO;

  const groupByCourse = (slug: CourseSlug) =>
    overview.groups.find((g) => g.course.slug === slug);

  function goToWeek(index: number) {
    setWeekIndex(Math.min(Math.max(index, 1), plan.weeks.length));
    setDay(null);
  }

  function pickDay(iso: string) {
    setDay((prev) => (prev === iso ? null : iso));
    const w = weekOf(plan, iso);
    if (w) setWeekIndex(w.index);
  }

  function toggleDemo(on: boolean) {
    setAdminDemo(on);
    setDemoOn(on);
    if (!on) {
      localStorage.removeItem("smartzno-activity-log");
      window.dispatchEvent(new Event(ACTIVITY_EVENT));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {showAdmin && <AdminDemoBanner active={demoOn} onToggle={toggleDemo} />}

      <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink md:text-3xl">
          Привіт, {me.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-forest/65">Обирай собі комфортний графік навчання на тиждень.</p>

        {beforeYear && (
          <p className="mt-3 text-sm text-forest/50">Рік стартує {formatDayMonth(plan.startISO)}.</p>
        )}

        <div className="mt-5 border-t border-line/70 pt-4">
          <WeekSwitcher
            overview={overview}
            weeksTotal={plan.weeks.length}
            onShift={(delta) => goToWeek(week.index + delta)}
            onCurrent={() => goToWeek(currentWeek.index)}
            canPrev={week.index > 1}
            canNext={week.index < plan.weeks.length}
          />
          <WeekPulse overview={overview} onSelectDay={pickDay} selectedDay={day} />
        </div>

        {day && (
          <DayDetailPanel
            date={day}
            today={today}
            dayInfo={dayInfo}
            courses={courses}
            lessons={lessons}
            onClose={() => setDay(null)}
          />
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href="/cabinet/calendar"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-forest/70 transition hover:border-teal/40 hover:text-teal"
          >
            Вся історія та календар
            <IconArrow className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <div className="space-y-6">
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
          План тижня
        </p>

        {SUBJECTS.map((slug) => (
          <SubjectWeekSection
            key={slug}
            course={slug}
            group={groupByCourse(slug)}
            today={today}
            href={`/cabinet/${slug}`}
          />
        ))}
      </div>
    </div>
  );
}
