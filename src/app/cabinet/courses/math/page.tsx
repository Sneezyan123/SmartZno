import { getAllLessons, getCurriculum } from "@/lib/course";
import { CourseOverview } from "@/components/course/CourseOverview";

export default function MathCoursePage() {
  const curriculum = getCurriculum();
  const lessons = getAllLessons();
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

  return <CourseOverview curriculum={curriculum} lessonsById={lessonsById} />;
}
