import { notFound } from "next/navigation";
import { getAllLessons, getCurriculum, isCourseSlug } from "@/lib/course";
import { CourseOverview } from "@/components/course/CourseOverview";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!isCourseSlug(course)) notFound();

  const curriculum = getCurriculum(course);
  const lessons = getAllLessons(course);
  const lessonsById = Object.fromEntries(
    lessons.map((l) => [
      l.id,
      {
        id: l.id,
        title: l.title,
        status: l.status,
        order: l.order,
        quizCards: l.quizCards,
        homework: l.homework,
      },
    ]),
  );

  return <CourseOverview course={course} curriculum={curriculum} lessonsById={lessonsById} />;
}
