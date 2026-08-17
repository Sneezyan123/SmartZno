"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CourseOpsFile } from "@/lib/course/types";
import { detectChurn } from "@/lib/course/churn";
import { hydrateProgressFromMongo, loadProgress, type CourseProgress } from "@/lib/course/progress";
import { loadProfile } from "@/lib/course/profile";

export function ChurnBanner({ ops, hasDueMock }: { ops: CourseOpsFile; hasDueMock: boolean }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      let progress: CourseProgress = loadProgress();
      const remote = await hydrateProgressFromMongo();
      if (remote) progress = remote;
      const scenario = detectChurn(ops, progress, loadProfile(), hasDueMock);
      if (scenario) setText(scenario.studentText);
    };
    void run();
  }, [ops, hasDueMock]);

  if (!text) return null;
  return (
    <div className="mt-6 border-l-4 border-amber bg-amber-soft/70 px-4 py-3 text-sm text-ink">
      <p className="font-semibold">Наздогін</p>
      <p className="mt-1">{text}</p>
      <Link href="/cabinet/courses/math/plan" className="mt-2 inline-block text-teal underline">
        Відкрити план тижня
      </Link>
    </div>
  );
}

export function CourseHubLinks() {
  const links = [
    { href: "/cabinet/courses/math/plan", label: "План тижня" },
    { href: "/cabinet/courses/math/placement", label: "Діагностика старту" },
    { href: "/cabinet/courses/math/review", label: "Помилки" },
    { href: "/cabinet/courses/math/parent", label: "Звіт батькам" },
  ];
  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest hover:border-teal"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
