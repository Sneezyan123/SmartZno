"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CourseOpsFile, CourseTracksFile } from "@/lib/course/types";
import { CourseAuthGate, CourseHeader } from "@/components/course/CourseShell";
import { loadProfile, updateProfile, type CourseProfile } from "@/lib/course/profile";
import { getWeekPlan } from "@/lib/course/tracks";

type Props = {
  tracks: CourseTracksFile;
  ops: CourseOpsFile;
  titles: Record<string, string>;
};

export function WeekPlanClient({ tracks, ops, titles }: Props) {
  const [profile, setProfile] = useState<CourseProfile>({
    trackId: "g11-9",
    startDate: "2026-09-01T00:00:00.000Z",
    level: "B",
    startLessonId: "m1-01",
    curatorChecked: {},
    mistakes: [],
    coins: 0,
    streak: 0,
    cohortMode: true,
  });

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const track = tracks.tracks.find((t) => t.id === profile.trackId) ?? tracks.tracks[0];
  const plan = useMemo(
    () => getWeekPlan(track, profile.startDate),
    [track, profile.startDate],
  );
  const current = plan.current;

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title="План тижня" />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <p className="text-sm text-forest/70">
            Два ефіри, два дедлайни ДЗ, один слот карток. Пізній старт — інтенсив, не плейлист без дедлайнів.
          </p>

          <label className="mt-6 block text-sm text-forest/70">
            Трек
            <select
              className="field mt-1 px-3 py-2"
              value={profile.trackId}
              onChange={(e) => setProfile(updateProfile({ trackId: e.target.value }))}
            >
              {tracks.tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-sm text-forest/65">{track.goal}</p>

          <div className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Тиждень {plan.week} · дедлайн ДЗ{" "}
              {new Date(plan.hwDeadline).toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}
            </p>
            <ul className="mt-4 space-y-2">
              {(current?.lessons ?? []).map((id) => (
                <li key={id}>
                  <Link href={`/cabinet/courses/math/${id}`} className="text-teal underline">
                    {titles[id] ?? id}
                  </Link>
                </li>
              ))}
              {current?.mock && (
                <li>
                  <Link
                    href={`/cabinet/courses/math/${current.mock}/homework`}
                    className="font-semibold text-forest underline"
                  >
                    Mock {titles[current.mock] ?? current.mock} · 60 хв
                  </Link>
                </li>
              )}
            </ul>
            {current?.liveFocus && (
              <p className="mt-4 text-sm text-forest/75">
                Ефір: {titles[current.liveFocus] ?? current.liveFocus}
              </p>
            )}
          </div>

          <section className="mt-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
              Ритм куратора
            </h2>
            <p className="mt-1 text-sm text-forest/65">{ops.curator.role}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-forest/85">
              {ops.curator.weeklyRhythm.map((row) => (
                <li key={row.weekday}>{row.task}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-forest/60">SLA перевірки ДЗ: {ops.curator.slaHours} год.</p>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-teal">Шаблони коментарів</h3>
            <ul className="mt-3 space-y-2 text-sm text-forest/80">
              {Object.entries(ops.curator.commentTemplates).map(([k, v]) => (
                <li key={k}>
                  <span className="font-medium text-ink">{k}: </span>
                  {v}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </CourseAuthGate>
  );
}
