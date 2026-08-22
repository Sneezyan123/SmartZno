import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseMeta, getLesson, isCourseSlug } from "@/lib/course";
import { QuizCardsPlayer } from "@/components/course/QuizCardsPlayer";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";

export default async function LessonCardsPage({
  params,
}: {
  params: Promise<{ course: string; lessonId: string }>;
}) {
  const { course, lessonId } = await params;
  if (!isCourseSlug(course)) notFound();
  const lesson = getLesson(lessonId, course);
  if (!lesson) notFound();
  const nav = getCourseMeta(course).nav;

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={lesson.title} course={course} />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <div className="mb-8">
            <LessonNav lessonId={lessonId} active="cards" course={course} />
          </div>
          <p className="mb-6 text-forest/70">
            {course === "history"
              ? "Натисни картку, щоб перегорнути. Повторюй дати, постаті й факти."
              : "Натисни картку, щоб перегорнути. Повторюй формули і факти."}
          </p>
          <QuizCardsPlayer lessonId={lessonId} cards={lesson.quizCards} course={course} />
          <div className="mt-10 flex justify-end">
            <Link
              href={`/cabinet/courses/${course}/${lessonId}/homework`}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
            >
              {nav.homework} →
            </Link>
          </div>
        </div>
      </main>
    </CourseAuthGate>
  );
}
