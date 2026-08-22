import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentLessonIds, getCourseMeta, getLesson, isCourseSlug, shouldShowLessonBear } from "@/lib/course";
import { TheoryBlocks } from "@/components/course/TheoryBlocks";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";
import { MarkTheoryDone } from "@/components/course/MarkTheoryDone";
import { LessonBear } from "@/components/course/LessonBear";

export default async function LessonTheoryPage({
  params,
}: {
  params: Promise<{ course: string; lessonId: string }>;
}) {
  const { course, lessonId } = await params;
  if (!isCourseSlug(course)) notFound();
  const lesson = getLesson(lessonId, course);
  if (!lesson) notFound();
  const { prev, next } = getAdjacentLessonIds(lessonId, course);
  const nav = getCourseMeta(course).nav;
  const base = `/cabinet/courses/${course}`;

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={lesson.title} course={course} />
        <MarkTheoryDone lessonId={lessonId} course={course} />
        <div className="mx-auto max-w-3xl px-5 py-8 md:max-w-[46rem] md:py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <LessonNav lessonId={lessonId} active="theory" course={course} />
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                lesson.status === "ready" ? "bg-mist text-forest" : "bg-amber-soft text-ink"
              }`}
            >
              {lesson.status === "ready" ? "Готовий" : "Каркас"}
            </span>
          </div>

          {shouldShowLessonBear(lessonId, course) ? <LessonBear /> : null}

          {course === "history" && !(lesson.notes && lesson.notes.length > 0) && (
            <div className="mb-8 overflow-hidden rounded-[var(--radius)] border border-line bg-white">
              <div className="h-1.5 bg-gradient-to-r from-amber via-teal to-violet" />
              <div className="px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  {lesson.nmtTags.join(" · ")}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink md:text-3xl">
                  {lesson.title}
                </p>
                {lesson.objectives.length > 0 && (
                  <ul className="mt-4 space-y-2 text-base leading-7 text-forest/80">
                    {lesson.objectives.map((o) => (
                      <li key={o}>→ {o}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {course !== "history" && lesson.objectives.length > 0 && (
            <div className="mb-8 rounded-[var(--radius)] border border-line bg-white p-5">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-forest/50">Після цього уроку ти зможеш</p>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[1.0625rem] leading-7 text-forest/85">
                {lesson.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          <TheoryBlocks blocks={lesson.theory} variant={course === "history" ? "story" : "default"} />

          <div className="mt-10 flex flex-wrap gap-3">
            {nav.notes && lesson.notes && lesson.notes.length > 0 ? (
              <Link
                href={`${base}/${lessonId}/notes`}
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
              >
                {nav.notes} →
              </Link>
            ) : (
              <Link
                href={`${base}/${lessonId}/cards`}
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
              >
                {nav.cards} →
              </Link>
            )}
            <Link
              href={`${base}/${lessonId}/homework`}
              className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
            >
              {nav.homework}
            </Link>
          </div>

          <div className="mt-10 flex justify-between border-t border-line pt-6 text-sm">
            {prev ? (
              <Link href={`${base}/${prev}`} className="text-teal hover:underline">
                ← Попередній
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`${base}/${next}`} className="text-teal hover:underline">
                Наступний →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </main>
    </CourseAuthGate>
  );
}
