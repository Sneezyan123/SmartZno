import { notFound } from "next/navigation";
import { getCardCounts, getLesson, getTracksFile } from "@/lib/course";
import { HomeworkPlayer } from "@/components/course/HomeworkPlayer";
import { CourseAuthGate, CourseHeader, LessonNav } from "@/components/course/CourseShell";
import { LessonAccessGate } from "@/components/course/LessonAccessGate";
import { HomeworkReadyNote } from "@/components/course/PacketExit";

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
      <LessonAccessGate lessonId={lessonId} tracks={getTracksFile()} cardCounts={getCardCounts()}>
        <main className="min-h-screen bg-paper">
          <CourseHeader title={lesson.title} />
          <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
            <div className="mb-8">
              <LessonNav lessonId={lessonId} active="homework" />
            </div>
            <p className="mb-2 text-forest/70">
              {lesson.moduleId === "m7"
                ? "Формат НМТ: 15×1 бал, 3×логічні пари (по 1 за пару), 4×відкриті по 2 бали. Максимум 32. Таймер 60 хв."
                : "Формати як на НМТ. Рівні A/B/C змінюють набір ДЗ. <70% — повтор карток; ≥85% — далі."}
            </p>
            <HomeworkReadyNote lessonId={lessonId} />
            <HomeworkPlayer
              lessonId={lessonId}
              items={lesson.homework}
              timedMinutes={lesson.moduleId === "m7" ? 60 : 0}
            />
          </div>
        </main>
      </LessonAccessGate>
    </CourseAuthGate>
  );
}
