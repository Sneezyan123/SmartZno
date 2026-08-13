import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson } from "@/lib/course";
import { QuizCardsPlayer } from "@/components/course/QuizCardsPlayer";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";

export default async function LessonCardsPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title={lesson.title} />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <div className="mb-8">
            <LessonNav lessonId={lessonId} active="cards" />
          </div>
          <p className="mb-6 text-forest/70">
            Перевертай картки й повторюй формули / факти у стилі флешкарток.
          </p>
          <QuizCardsPlayer lessonId={lessonId} cards={lesson.quizCards} />
          <div className="mt-10 flex justify-end">
            <Link
              href={`/cabinet/courses/math/${lessonId}/homework`}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
            >
              До завдань →
            </Link>
          </div>
        </div>
      </main>
    </CourseAuthGate>
  );
}
