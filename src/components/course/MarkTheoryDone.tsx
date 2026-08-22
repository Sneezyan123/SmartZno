"use client";

import { useEffect } from "react";
import type { CourseSlug } from "@/lib/course/types";
import { updateLessonProgress } from "@/lib/course/progress";

/** Marks theory as viewed when the lesson page mounts. */
export function MarkTheoryDone({
  lessonId,
  course = "math",
}: {
  lessonId: string;
  course?: CourseSlug;
}) {
  useEffect(() => {
    updateLessonProgress(lessonId, { theoryDone: true }, course);
  }, [lessonId, course]);
  return null;
}
