"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CourseSlug, Curriculum, Lesson } from "@/lib/course/types";
import { getCourseMeta } from "@/lib/course/catalog";
import {
  getLessonProgress,
  lessonCompletionRatio,
  type CourseProgress,
  loadProgress,
} from "@/lib/course/progress";
import { CourseAuthGate, CourseHeader } from "@/components/course/CourseShell";

type Props = {
  course: CourseSlug;
  curriculum: Curriculum;
  lessonsById: Record<string, Pick<Lesson, "id" | "title" | "status" | "order" | "quizCards" | "homework">>;
};

export function CourseOverview({ course, curriculum, lessonsById }: Props) {
  const [progress, setProgress] = useState<CourseProgress>({});
  const meta = getCourseMeta(course);

  useEffect(() => {
    setProgress(loadProgress(course));
  }, [course]);

  const readyCount = Object.values(lessonsById).filter((l) => l.status === "ready").length;
  const total = Object.keys(lessonsById).length;

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={curriculum.title} course={course} backHref="/cabinet" backLabel="Кабінет" />
        <div className="mx-auto max-w-4xl px-5 py-10">
          <p className="text-sm uppercase tracking-wide text-teal">Курс · {curriculum.year}</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
            {meta.headline}
          </h2>
          <p className="mt-3 max-w-2xl text-forest/75">{curriculum.description}</p>
          <p className="mt-2 text-sm text-forest/55">{curriculum.programSource}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-mist px-4 py-1.5 text-forest">
              {curriculum.nmtFormat.tasks} завдань · {curriculum.nmtFormat.maxScore} балів · ~
              {curriculum.nmtFormat.minutes} хв
            </span>
            <span className="rounded-full bg-white px-4 py-1.5 text-forest border border-line">
              Готово: {readyCount}/{total} уроків
            </span>
          </div>

          <div className="mt-12 space-y-10">
            {curriculum.modules.map((mod) => (
              <section key={mod.id}>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
                  {mod.title}
                </h3>
                <p className="mt-1 text-sm text-forest/65">{mod.description}</p>
                <ul className="mt-4 space-y-2">
                  {mod.lessonIds.map((id, i) => {
                    const lesson = lessonsById[id];
                    if (!lesson) return null;
                    const p = progress[id] ?? getLessonProgress(id, course);
                    const ratio = lessonCompletionRatio(
                      p,
                      lesson.quizCards?.length ?? 0,
                      lesson.homework?.length ?? 0,
                    );
                    return (
                      <li key={id}>
                        <Link
                          href={`/cabinet/courses/${course}/${id}`}
                          className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-line bg-white px-4 py-3 transition hover:border-teal/40"
                        >
                          <div>
                            <p className="font-medium text-ink">
                              <span className="mr-2 text-forest/40">{i + 1}.</span>
                              {lesson.title}
                            </p>
                            <p className="mt-0.5 text-xs text-forest/50">
                              {lesson.status === "ready" ? "Готовий урок" : "Каркас (скоро)"}
                              {ratio > 0 ? ` · прогрес ${Math.round(ratio * 100)}%` : ""}
                            </p>
                          </div>
                          <span className="text-teal">→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
    </CourseAuthGate>
  );
}
