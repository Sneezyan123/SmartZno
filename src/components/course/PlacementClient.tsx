"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlacementFile } from "@/lib/course/types";
import { CourseAuthGate, CourseHeader } from "@/components/course/CourseShell";
import { updateProfile } from "@/lib/course/profile";
import { recommendFromPlacement } from "@/lib/course/tracks";

export function PlacementClient({ placement, titles }: { placement: PlacementFile; titles: Record<string, string> }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<ReturnType<typeof recommendFromPlacement> | null>(null);

  function submit() {
    const wrongLessons: string[] = [];
    let correct = 0;
    for (const q of placement.questions) {
      if (answers[q.id] === q.answer) correct += 1;
      else wrongLessons.push(q.mapsToLesson);
    }
    const rec = recommendFromPlacement(correct, wrongLessons, placement.questions.length);
    updateProfile({
      level: rec.level,
      trackId: rec.trackId,
      startLessonId: rec.startLessonId,
      startDate: new Date().toISOString(),
    });
    setDone(rec);
  }

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title="Діагностика старту" />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <p className="text-forest/75">
            {placement.questions.length} задач. Результат ставить рівень A/B/C і перший урок: не завжди з
            вступу, якщо фундамент уже є.
          </p>

          {!done && (
            <div className="mt-8 space-y-8">
              {placement.questions.map((q, i) => (
                <article key={q.id} className="border-t border-line pt-5">
                  <p className="text-xs text-teal">
                    {i + 1}. {q.topic}
                  </p>
                  <p className="mt-1 font-medium text-ink">{q.prompt}</p>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt.key} className="flex gap-2 text-sm">
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === opt.key}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt.key }))}
                        />
                        <span>
                          {opt.key}. {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
              <button
                type="button"
                onClick={submit}
                className="rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white"
              >
                Отримати план старту
              </button>
            </div>
          )}

          {done && (
            <div className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-5">
              <p className="text-sm text-forest/60">Правильних: {done.correct} / {placement.questions.length}</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
                Рівень {done.level} · трек {done.trackId}
              </p>
              <p className="mt-3">
                Стартовий урок:{" "}
                <Link href={`/cabinet/courses/math/${done.startLessonId}`} className="text-teal underline">
                  {titles[done.startLessonId] ?? done.startLessonId}
                </Link>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/cabinet/courses/math/${done.startLessonId}`}
                  className="rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Почати
                </Link>
                <Link href="/cabinet/courses/math/plan" className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest">
                  План тижня
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </CourseAuthGate>
  );
}
