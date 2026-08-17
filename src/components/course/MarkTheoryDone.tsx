"use client";

import { useEffect, useState } from "react";
import { getLessonProgress, updateLessonProgress } from "@/lib/course/progress";
import { updateProfile } from "@/lib/course/profile";

export function MarkTheoryDone({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(Boolean(getLessonProgress(lessonId).theoryDone));
  }, [lessonId]);

  if (done) {
    return <p className="mt-8 text-sm text-forest/60">Теорію позначено прочитаною. Далі — картки (≥70%) і ДЗ.</p>;
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => {
          updateLessonProgress(lessonId, { theoryDone: true });
          updateProfile({ lastTheoryAt: new Date().toISOString() });
          setDone(true);
        }}
        className="rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white"
      >
        Прочитав теорію
      </button>
      <p className="mt-2 text-xs text-forest/55">У когорті наступний урок не відкриється, доки є картки й ДЗ.</p>
    </div>
  );
}
