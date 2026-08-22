import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseMeta, getLesson, isCourseSlug } from "@/lib/course";
import { TheoryBlocks } from "@/components/course/TheoryBlocks";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";

export default async function LessonNotesPage({
  params,
}: {
  params: Promise<{ course: string; lessonId: string }>;
}) {
  const { course, lessonId } = await params;
  if (!isCourseSlug(course)) notFound();
  const lesson = getLesson(lessonId, course);
  if (!lesson) notFound();
  const nav = getCourseMeta(course).nav;
  if (!nav.notes) notFound();
  const hasSheet = lesson.notes?.some((block) => block.type === "cheatsheet");

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={lesson.title} course={course} />
        <div className="mx-auto max-w-3xl px-5 py-8 md:max-w-4xl md:py-12">
          <div className="mb-8 cheat-sheet-print-hide">
            <LessonNav lessonId={lessonId} active="notes" course={course} />
          </div>
          <p className="mb-6 text-forest/70 cheat-sheet-print-hide">
            {hasSheet
              ? "Шпаргалка зверху, далі факти, дати й визначення — без анімацій. Лекцію можна закрити."
              : "Факти, дати й визначення — без анімацій. Лекцію можна закрити."}
          </p>
          {lesson.notes && lesson.notes.length > 0 ? (
            <TheoryBlocks blocks={lesson.notes} variant="notes" />
          ) : (
            <p className="text-forest/70">Конспекту для цього уроку поки немає.</p>
          )}
          <div className="mt-10 flex justify-end cheat-sheet-print-hide">
            <Link
              href={`/cabinet/courses/${course}/${lessonId}/cards`}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
            >
              {nav.cards} →
            </Link>
          </div>
        </div>
      </main>
    </CourseAuthGate>
  );
}
