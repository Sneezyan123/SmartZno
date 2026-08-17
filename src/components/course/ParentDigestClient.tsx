"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CourseAuthGate, CourseHeader } from "@/components/course/CourseShell";
import { loadProgress, type CourseProgress } from "@/lib/course/progress";
import { loadProfile } from "@/lib/course/profile";
import { getStudentToken } from "@/lib/crm";
import type { CourseOpsFile } from "@/lib/course/types";

const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL || process.env.CRM_API_URL || "http://localhost:8000";

export function ParentDigestClient({
  ops,
  titles,
}: {
  ops: CourseOpsFile;
  titles: Record<string, string>;
}) {
  const [progress, setProgress] = useState<CourseProgress>({});
  const [remote, setRemote] = useState<Record<string, unknown> | null>(null);
  const [level, setLevel] = useState("B");

  useEffect(() => {
    setProgress(loadProgress());
    setLevel(loadProfile().level);
    const token = getStudentToken();
    if (!token) return;
    fetch(`${CRM_API_URL}/lms/parent-digest`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then(setRemote)
      .catch(() => setRemote(null));
  }, []);
  const hwDone = Object.values(progress).filter((p) => p.homeworkChecked).length;
  const hwDue = 2;
  const cardsPct = useMemo(() => {
    const withCards = Object.values(progress).filter((p) => (p.cardsSeen?.length ?? 0) > 0).length;
    const n = Math.max(1, Object.keys(progress).length);
    return Math.round((withCards / n) * 100);
  }, [progress]);
  const lastMock = Object.entries(progress)
    .filter(([id, p]) => id.startsWith("m7-") && p.homeworkChecked)
    .sort((a, b) => (b[1].updatedAt ?? "").localeCompare(a[1].updatedAt ?? ""))[0];

  const digest = ops.parent.digestTemplate
    .replace("{{week}}", "поточний")
    .replace("{{hwDone}}", String(remote?.hwDone ?? hwDone))
    .replace("{{hwDue}}", String(hwDue))
    .replace("{{cards}}", String(cardsPct))
    .replace("{{mock}}", lastMock ? titles[lastMock[0]] ?? lastMock[0] : "ще не писали")
    .replace("{{level}}", String(remote?.level ?? level));

  return (
    <CourseAuthGate>
      <main className="min-h-screen bg-paper">
        <CourseHeader title="Звіт для батьків" />
        <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
          <p className="text-forest/75">
            {ops.parent.channel}. Це read-only дайджест: без щоденних дзвінків менеджеру.
          </p>
          <div className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Повідомлення тижня</p>
            <p className="mt-3 text-lg text-ink">{digest}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-forest/80">
              {ops.parent.fields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          {lastMock && (
            <p className="mt-6 text-sm">
              Останній пробний:{" "}
              <Link href={`/cabinet/courses/math/${lastMock[0]}/homework`} className="text-teal underline">
                {titles[lastMock[0]]}
              </Link>
              {lastMock[1].homeworkScore?.nmtGot != null
                ? ` · ${lastMock[1].homeworkScore.nmtGot}/${lastMock[1].homeworkScore.nmtMax} тестових`
                : ""}
            </p>
          )}
          <p className="mt-8 text-sm text-forest/55">
            Premium: куратор + цей звіт + розбір mock. Standard: контент і ефір групи.
          </p>
        </div>
      </main>
    </CourseAuthGate>
  );
}
