"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentToken } from "@/lib/crm";
import type { CourseSlug } from "@/lib/course/types";
import { getCourseMeta } from "@/lib/course/catalog";

export function CourseAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!getStudentToken()) {
      router.replace("/cabinet/login");
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper text-forest/70">
        Завантаження…
      </main>
    );
  }

  return <>{children}</>;
}

export function CourseHeader({
  title,
  course = "math",
  backHref,
  backLabel = "До курсу",
}: {
  title: string;
  course?: CourseSlug;
  backHref?: string;
  backLabel?: string;
}) {
  const href = backHref ?? `/cabinet/courses/${course}`;
  return (
    <header className="cheat-sheet-print-hide border-b border-line bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-5">
        <div>
          <Link href={href} className="text-sm text-teal hover:underline">
            ← {backLabel}
          </Link>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-forest md:text-xl">
            {title}
          </h1>
        </div>
        <Link href="/cabinet" className="text-sm text-forest/70 hover:text-forest">
          Кабінет
        </Link>
      </div>
    </header>
  );
}

export function LessonNav({
  lessonId,
  active,
  course = "math",
}: {
  lessonId: string;
  active: "theory" | "notes" | "cards" | "homework";
  course?: CourseSlug;
}) {
  const base = `/cabinet/courses/${course}/${lessonId}`;
  const nav = getCourseMeta(course).nav;
  const items = [
    { id: "theory" as const, href: base, label: nav.theory },
    ...(nav.notes ? [{ id: "notes" as const, href: `${base}/notes`, label: nav.notes }] : []),
    { id: "cards" as const, href: `${base}/cards`, label: nav.cards },
    { id: "homework" as const, href: `${base}/homework`, label: nav.homework },
  ];
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            active === item.id
              ? "bg-forest text-white"
              : "border border-forest/20 text-forest hover:border-teal"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
