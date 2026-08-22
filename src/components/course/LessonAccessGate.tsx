"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CourseTracksFile } from "@/lib/course/types";
import { loadProgress } from "@/lib/course/progress";
import { loadProfile } from "@/lib/course/profile";
import { lessonAccess, isDemoOnly } from "@/lib/course/cohort";
import { studentMe } from "@/lib/crm";

export function LessonAccessGate({
  lessonId,
  tracks,
  cardCounts,
  children,
}: {
  lessonId: string;
  tracks: CourseTracksFile;
  cardCounts: Record<string, number>;
  children: React.ReactNode;
}) {
  const [blocked, setBlocked] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const profile = loadProfile();
      const track = tracks.tracks.find((t) => t.id === profile.trackId) ?? tracks.tracks[0];
      let demoOnly = false;
      try {
        const me = await studentMe();
        const math = me.subscriptions.find((s) => s.subject === "math");
        demoOnly = isDemoOnly(math?.status ?? null);
      } catch {
        demoOnly = false;
      }
      const access = lessonAccess({
        lessonId,
        sequence: track.sequence,
        startLessonId: profile.startLessonId,
        progress: loadProgress(),
        cardCounts,
        cohortMode: profile.cohortMode !== false,
        demoOnly,
        demoLessons: track.demoLessons,
      });
      if (!cancelled) {
        setBlocked(access.ok ? null : access.reason);
        setReady(true);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [lessonId, tracks, cardCounts]);

  if (!ready) {
    return <p className="px-5 py-10 text-center text-forest/60">Перевірка доступу…</p>;
  }
  if (blocked) {
    return (
      <div className="mx-auto max-w-lg px-5 py-12 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">Урок закритий у режимі когорти</p>
        <p className="mt-3 text-forest/75">{blocked}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/cabinet/courses/math/plan" className="rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white">
            План тижня
          </Link>
          <Link href="/cabinet/courses/math" className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest">
            До курсу
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
