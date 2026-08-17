import { getLessonTitles } from "@/lib/course";
import { ReviewClient } from "@/components/course/ReviewClient";

export default function ReviewPage() {
  return <ReviewClient titles={getLessonTitles()} />;
}
