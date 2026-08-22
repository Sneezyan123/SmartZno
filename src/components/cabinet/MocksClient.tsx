"use client";

import { useMemo } from "react";
import { plural } from "@/lib/plural";
import { isMockOpen } from "@/lib/schedule/access";
import { MOCK_ACCENT, RELEASE } from "@/lib/schedule/config";
import { formatDayMonth } from "@/lib/schedule/dates";
import type { PlannedMock, StudyPlan } from "@/lib/schedule/types";
import { courseMap } from "./agenda";
import { MockCard } from "./cards";
import { useToday } from "./hooks";

export function MocksClient({ plan }: { plan: StudyPlan }) {
  const today = useToday();
  const courses = useMemo(() => courseMap(plan.courses), [plan.courses]);

  if (!today) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/70" />;
  }

  const months = new Map<string, PlannedMock[]>();
  for (const mock of plan.mocks) {
    const bucket = months.get(mock.date);
    if (bucket) bucket.push(mock);
    else months.set(mock.date, [mock]);
  }

  const openCount = plan.mocks.filter((m) => isMockOpen(m.date, today)).length;
  const readyCount = plan.mocks.filter((m) => m.lessonId).length;
  const next = plan.mocks.find((m) => m.date >= today);

  return (
    <div>
      <header>
        <p className="text-xs font-bold tracking-[0.16em] uppercase" style={{ color: MOCK_ACCENT }}>
          Раз на місяць
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink md:text-3xl">
          Пробні НМТ
        </h1>
        <p className="mt-2 max-w-2xl text-forest/65">
          Новий варіант відкривається першого числа кожного місяця — з вересня по травень. Це
          повний формат іспиту під таймер: саме за ним видно реальний бал, а не відчуття.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
            {plan.mocks.length}
          </p>
          <p className="mt-0.5 text-xs text-forest/50">
            {plural(plan.mocks.length, "пробний", "пробні", "пробних")} за рік
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
            {RELEASE.mocks === "open" ? plan.mocks.length : openCount}
          </p>
          <p className="mt-0.5 text-xs text-forest/50">відкрито зараз</p>
        </div>
        <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
            {readyCount}
          </p>
          <p className="mt-0.5 text-xs text-forest/50">
            {plural(readyCount, "варіант", "варіанти", "варіантів")} уже завантажено
          </p>
        </div>
      </div>

      {next && (
        <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm text-forest/70">
          Наступний за розкладом — {next.title} ({courses[next.course].label}),{" "}
          {formatDayMonth(next.date)}.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {[...months.entries()].map(([date, items]) => (
          <section key={date}>
            <div className="flex items-baseline gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink capitalize">
                {items[0].monthLabel}
              </h2>
              <span className="text-xs text-forest/40">відкриття {formatDayMonth(date)}</span>
            </div>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {items.map((mock) => (
                <MockCard
                  key={mock.id}
                  mock={mock}
                  course={courses[mock.course]}
                  open={isMockOpen(mock.date, today)}
                  today={today}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
