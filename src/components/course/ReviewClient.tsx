"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CourseAuthGate, CourseHeader } from "@/components/course/CourseShell";
import { loadProfile, type CourseProfile } from "@/lib/course/profile";

export function ReviewClient({ titles }: { titles: Record<string, string> }) {
  const [profile, setProfile] = useState<CourseProfile | null>(null);
  useEffect(() => setProfile(loadProfile()), []);
  const mistakes = profile?.mistakes ?? [];

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title="Робота над помилками" />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <p className="text-forest/75">
            Після ДЗ і пробних кожне неправильне завдання веде на урок-тег. Не починай новий mock, доки не закриєш теги.
          </p>
          {mistakes.length === 0 && (
            <p className="mt-8 text-forest/60">Поки немає збережених помилок — здайте ДЗ або пробний.</p>
          )}
          <ul className="mt-8 space-y-3">
            {mistakes.map((m) => {
              const target = m.reviewLessonId ?? m.lessonId;
              return (
                <li key={`${m.lessonId}-${m.itemId}-${m.at}`} className="border-t border-line pt-3">
                  <p className="text-sm text-forest/55">
                    {new Date(m.at).toLocaleString("uk-UA")} · {m.itemId}
                  </p>
                  <Link href={`/cabinet/courses/math/${target}`} className="font-medium text-teal underline">
                    {titles[target] ?? target}
                  </Link>
                  {m.reviewLessonId && m.reviewLessonId !== m.lessonId && (
                    <span className="ml-2 text-xs text-forest/50">з {titles[m.lessonId] ?? m.lessonId}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </CourseAuthGate>
  );
}
