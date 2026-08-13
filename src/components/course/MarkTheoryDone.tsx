"use client";

import { useEffect } from "react";
import { updateLessonProgress } from "@/lib/course/progress";

/** Marks theory as viewed when the lesson page mounts. */
export function MarkTheoryDone({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    updateLessonProgress(lessonId, { theoryDone: true });
  }, [lessonId]);
  return null;
}
