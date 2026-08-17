import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentLessonIds, getCardCounts, getLesson, getTracksFile } from "@/lib/course";
import { TheoryBlocks } from "@/components/course/TheoryBlocks";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";
import { MarkTheoryDone } from "@/components/course/MarkTheoryDone";
import { LessonAccessGate } from "@/components/course/LessonAccessGate";
import { PacketExit } from "@/components/course/PacketExit";

export default async function LessonTheoryPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  const { prev, next } = getAdjacentLessonIds(lessonId);
  const tracks = getTracksFile();
  const cardCounts = getCardCounts();

  return (
    <CourseAuthGate>
      <LessonAccessGate lessonId={lessonId} tracks={tracks} cardCounts={cardCounts}>
        <main className="min-h-screen bg-paper">
          <CourseHeader title={lesson.title} />
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
              <div className="mb-8 rounded-[var(--radius)] border border-line bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">Цілі уроку</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-forest/85">
                  {lesson.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            <TheoryBlocks blocks={lesson.theory} />

            {lesson.liveTopic && (
              <div className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">Ефір (45–60 хв)</p>
                <p className="mt-2 text-forest/85">{lesson.liveTopic}</p>
                <p className="mt-2 text-sm text-forest/55">
                  Не конспект вголос: 10 хв питань, 4 задачі на бал, ДЗ на тиждень. Запис доступний 24 год.
                </p>
                {lesson.videoUrl ? (
                  <video className="mt-4 w-full rounded-[var(--radius-sm)]" controls src={lesson.videoUrl} />
                ) : (
                  <p className="mt-3 text-sm text-forest/60">
                    Запис ефіру з’явиться тут після заняття (поле videoUrl уроку).
                  </p>
                )}
              </div>
            )}

            <MarkTheoryDone lessonId={lessonId} />

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`/cabinet/courses/math/${lessonId}/cards`}
                className="rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white"
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

            <PacketExit
              lessonId={lessonId}
              cardsTotal={lesson.quizCards.length}
              prevId={prev}
              nextId={next}
            />
          </div>
        </main>
      </LessonAccessGate>
    </CourseAuthGate>
  );
}
