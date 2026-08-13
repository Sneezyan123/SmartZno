import { notFound } from "next/navigation";
import { getLesson } from "@/lib/course";
import { HomeworkPlayer } from "@/components/course/HomeworkPlayer";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";

export default async function LessonHomeworkPage({
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
            <LessonNav lessonId={lessonId} active="homework" />
          </div>
          <p className="mb-2 text-forest/70">
            Формати як на НМТ: вибір відповіді, логічні пари, коротка відповідь.
          </p>
          <HomeworkPlayer lessonId={lessonId} items={lesson.homework} />
        </div>
      </main>
    </CourseAuthGate>
  );
}
