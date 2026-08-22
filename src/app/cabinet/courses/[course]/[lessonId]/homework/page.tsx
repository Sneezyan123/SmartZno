import { notFound } from "next/navigation";
import { getLesson, isCourseSlug } from "@/lib/course";
import { HomeworkPlayer } from "@/components/course/HomeworkPlayer";
import { MathNmtPlayer } from "@/components/course/MathNmtPlayer";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";

export default async function LessonHomeworkPage({
  params,
}: {
  params: Promise<{ course: string; lessonId: string }>;
}) {
  const { course, lessonId } = await params;
  if (!isCourseSlug(course)) notFound();
  const lesson = getLesson(lessonId, course);
  if (!lesson) notFound();

  const isMath = course === "math";

  return (
    <CourseAuthGate>
      <main className={`min-h-screen ${isMath ? "bg-white" : "bg-paper"}`}>
        <CourseHeader title={lesson.title} course={course} />
        <div
          className={`mx-auto px-5 ${isMath ? "max-w-[720px] py-7" : "max-w-3xl py-8 md:py-12"}`}
        >
          <div className={isMath ? "mb-7" : "mb-6"}>
            <LessonNav lessonId={lessonId} active="homework" course={course} />
          </div>

          {!isMath && (
            <p className="mb-6 text-sm text-forest/65">
              {lesson.moduleId === "h11"
                ? "Формат НМТ: 20×1 бал, 4×логічні пари, 3×послідовність, 3×три з семи. Максимум 54."
                : "Формати як на НМТ: вибір однієї відповіді, логічні пари, послідовність, три з семи."}
            </p>
          )}

          {isMath ? (
            <MathNmtPlayer lessonId={lessonId} items={lesson.homework} />
          ) : (
            <HomeworkPlayer lessonId={lessonId} items={lesson.homework} course={course} />
          )}
        </div>
      </main>
    </CourseAuthGate>
  );
}
