"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentToken } from "@/lib/crm";

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
  backHref = "/cabinet/courses/math",
  backLabel = "До курсу",
}: {
  title: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="border-b border-white/10 bg-night/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-5">
        <div>
          <Link href={backHref} className="text-sm text-teal hover:underline">
            ← {backLabel}
          </Link>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-white md:text-xl">
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
}: {
  lessonId: string;
  active: "theory" | "cards" | "homework";
}) {
  const base = `/cabinet/courses/math/${lessonId}`;
  const items = [
    { id: "theory" as const, href: base, label: "Теорія" },
    { id: "cards" as const, href: `${base}/cards`, label: "Квізкарти" },
    { id: "homework" as const, href: `${base}/homework`, label: "Завдання" },
  ];
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            active === item.id
              ? "bg-violet text-white"
              : "border border-forest/20 text-forest hover:border-teal"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
