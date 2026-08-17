"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CourseOpsFile, CourseTracksFile, Curriculum } from "@/lib/course/types";
import type { LessonSummary } from "@/lib/course";
import {
  getLessonProgress,
  lessonCompletionRatio,
  type CourseProgress,
  loadProgress,
} from "@/lib/course/progress";
import { loadProfile, updateProfile } from "@/lib/course/profile";
import { CourseAuthGate, CourseHeader } from "@/components/course/CourseShell";
import { ChurnBanner, CourseHubLinks } from "@/components/course/LtvWidgets";
import { lessonAccess, moduleClosed, successfulMock, isDemoOnly } from "@/lib/course/cohort";
import { studentMe } from "@/lib/crm";

type Props = {
  curriculum: Curriculum;
  lessonsById: Record<string, LessonSummary>;
  ops: CourseOpsFile;
  tracks: CourseTracksFile;
  monthlyMockId: string | null;
};

export function CourseOverview({ curriculum, lessonsById, ops, tracks, monthlyMockId }: Props) {
  const [progress, setProgress] = useState<CourseProgress>({});
  const [startLesson, setStartLesson] = useState("m1-01");
  const [level, setLevel] = useState("B");
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [demoOnly, setDemoOnly] = useState(false);
  const [crossSell, setCrossSell] = useState(false);
  const [trackId, setTrackId] = useState(tracks.defaultTrackId);

  const cardCounts = useMemo(
    () => Object.fromEntries(Object.values(lessonsById).map((l) => [l.id, l.cardsCount])),
    [lessonsById],
  );

  useEffect(() => {
    const prog = loadProgress();
    setProgress(prog);
    const p = loadProfile();
    setStartLesson(p.startLessonId);
    setLevel(p.level);
    setCoins(p.coins);
    setStreak(p.streak);
    setTrackId(p.trackId);
    const mock = successfulMock(prog);
    setCrossSell(Boolean(mock) && !p.crossSellDismissed);
    studentMe()
      .then((me) => {
        const math = me.subscriptions.find((s) => s.subject === "math");
        setDemoOnly(isDemoOnly(math?.status ?? null));
      })
      .catch(() => setDemoOnly(false));
  }, []);

  const readyCount = Object.values(lessonsById).filter((l) => l.status === "ready").length;
  const total = Object.keys(lessonsById).length;
  const hasDueMock = Boolean(monthlyMockId && !progress[monthlyMockId]?.homeworkChecked);
  const track = tracks.tracks.find((t) => t.id === trackId) ?? tracks.tracks[0];

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={curriculum.title} backHref="/cabinet" backLabel="Кабінет" />
        <div className="mx-auto max-w-4xl px-5 py-10">
          <p className="text-sm uppercase tracking-wide text-teal">Курс · {curriculum.year}</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
            Підготовка до НМТ з математики
          </h2>
          <p className="mt-3 max-w-2xl text-forest/75">{curriculum.description}</p>
          <p className="mt-2 text-sm text-forest/55">{curriculum.programSource}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-mist px-4 py-1.5 text-forest">
              {curriculum.nmtFormat.tasks} завдань · {curriculum.nmtFormat.maxScore} балів · ~
              {curriculum.nmtFormat.minutes} хв
            </span>
            <span className="rounded-full border border-line bg-surface px-4 py-1.5 text-forest">
              Готово: {readyCount}/{total} уроків
            </span>
            <span className="rounded-full border border-line bg-surface px-4 py-1.5 text-forest">
              Рівень {level}
            </span>
            <span className="rounded-full border border-line bg-surface px-4 py-1.5 text-forest">
              Стрік {streak} · коїни {coins}
            </span>
            {demoOnly && (
              <span className="rounded-full bg-amber-soft px-4 py-1.5 text-ink">Демо: уроки 1–2</span>
            )}
          </div>

          <CourseHubLinks />
          <ChurnBanner ops={ops} hasDueMock={hasDueMock} />

          {crossSell && (
            <div className="mt-6 rounded-[var(--radius)] border border-teal/30 bg-mist/50 p-5">
              <p className="font-semibold text-ink">Після успішного пробного</p>
              <p className="mt-1 text-sm text-forest/75">
                Не в день оплати математики — зараз можна додати другий предмет (українська / історія).
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link href="/#pricing" className="text-sm font-semibold text-teal underline">
                  Дивитись тарифи
                </Link>
                <button
                  type="button"
                  className="text-sm text-forest/60"
                  onClick={() => {
                    updateProfile({ crossSellDismissed: true });
                    setCrossSell(false);
                  }}
                >
                  Пізніше
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Твій старт</p>
            <p className="mt-2 text-forest/80">
              Після діагностики рекомендований урок:{" "}
              <Link href={`/cabinet/courses/math/${startLesson}`} className="font-semibold text-teal underline">
                {lessonsById[startLesson]?.title ?? startLesson}
              </Link>
            </p>
            {monthlyMockId && (
              <p className="mt-2 text-sm text-forest/70">
                Пробний цього місяця:{" "}
                <Link href={`/cabinet/courses/math/${monthlyMockId}/homework`} className="text-teal underline">
                  {lessonsById[monthlyMockId]?.title ?? monthlyMockId} · таймер 60 хв
                </Link>
              </p>
            )}
          </div>

          <div className="mt-12 space-y-10">
            {curriculum.modules.map((mod) => {
              const closed = moduleClosed(mod.lessonIds, progress, cardCounts);
              return (
                <section key={mod.id}>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
                    {mod.title}
                    {closed ? <span className="ml-2 text-sm font-medium text-teal">· модуль закрито</span> : null}
                  </h3>
                  <p className="mt-1 text-sm text-forest/65">{mod.description}</p>
                  <ul className="mt-4 space-y-2">
                    {mod.lessonIds.map((id, i) => {
                      const lesson = lessonsById[id];
                      if (!lesson) return null;
                      const p = progress[id] ?? getLessonProgress(id);
                      const ratio = lessonCompletionRatio(p, lesson.cardsCount, lesson.hwCount);
                      const access = lessonAccess({
                        lessonId: id,
                        sequence: track.sequence,
                        startLessonId: startLesson,
                        progress,
                        cardCounts,
                        cohortMode: true,
                        demoOnly,
                        demoLessons: track.demoLessons,
                      });
                      const href = access.ok ? `/cabinet/courses/math/${id}` : "/cabinet/courses/math/plan";
                      return (
                        <li key={id}>
                          <Link
                            href={href}
                            className={`flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border px-4 py-3 transition ${
                              access.ok
                                ? "border-line bg-surface hover:border-teal/40"
                                : "border-line bg-mist/40 text-forest/50"
                            }`}
                          >
                            <div>
                              <p className="font-medium text-ink">
                                <span className="mr-2 text-forest/40">{i + 1}.</span>
                                {lesson.title}
                              </p>
                              <p className="mt-0.5 text-xs text-forest/50">
                                {access.ok ? "Готовий урок" : "Закрито до здачі попереднього"}
                                {ratio > 0 ? ` · прогрес ${Math.round(ratio * 100)}%` : ""}
                                {p.curatorChecked ? " · ДЗ перевірено куратором" : ""}
                                {mod.id === "m7" ? " · 60 хв" : ""}
                              </p>
                            </div>
                            <span className="text-teal">{access.ok ? "→" : "🔒"}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </CourseAuthGate>
  );
}
