import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentLessonIds, getLesson } from "@/lib/course";
import { TheoryBlocks } from "@/components/course/TheoryBlocks";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";
import { MarkTheoryDone } from "@/components/course/MarkTheoryDone";

export default async function LessonTheoryPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  const { prev, next } = getAdjacentLessonIds(lessonId);

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={lesson.title} />
        <MarkTheoryDone lessonId={lessonId} />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <LessonNav lessonId={lessonId} active="theory" />
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                lesson.status === "ready" ? "bg-mist text-forest" : "bg-amber-soft text-ink"
              }`}
            >
              {lesson.status === "ready" ? "Готовий" : "Каркас"}
            </span>
          </div>

          {lesson.objectives.length > 0 && (
            <div className="mb-8 rounded-[var(--radius)] border border-line bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal">Цілі уроку</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-forest/85">
                {lesson.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          <TheoryBlocks blocks={lesson.theory} />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/cabinet/courses/math/${lessonId}/cards`}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
            >
              Квізкарти →
            </Link>
            <Link
              href={`/cabinet/courses/math/${lessonId}/homework`}
              className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
            >
              Завдання після уроку
            </Link>
          </div>

          <div className="mt-10 flex justify-between border-t border-line pt-6 text-sm">
            {prev ? (
              <Link href={`/cabinet/courses/math/${prev}`} className="text-teal hover:underline">
                ← Попередній
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/cabinet/courses/math/${next}`} className="text-teal hover:underline">
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
