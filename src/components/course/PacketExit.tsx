"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLessonProgress } from "@/lib/course/progress";

export function PacketExit({
  lessonId,
  cardsTotal,
  nextId,
  prevId,
}: {
  lessonId: string;
  cardsTotal: number;
  nextId: string | null;
  prevId: string | null;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [allowNext, setAllowNext] = useState(false);

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    const cardsOk =
      cardsTotal === 0 || p.cardsSeen.length >= Math.min(cardsTotal, Math.ceil(cardsTotal * 0.7));
    const hw = Boolean(p.homeworkChecked);
    const theory = Boolean(p.theoryDone);
    if (!theory || !cardsOk || !hw) {
      setAllowNext(false);
      if (p.homeworkScore && p.homeworkScore.total > 0) {
        const r = p.homeworkScore.correct / p.homeworkScore.total;
        if (r < 0.7) setMsg("Менше 70% ДЗ — повтор карток і 1 розбір, не наступний урок.");
        else if (r >= 0.85 && (!theory || !cardsOk))
          setMsg("ДЗ сильне, але в когорті ще потрібні теорія і картки.");
        else setMsg("Щоб іти далі: теорія → ≥70% карток → ДЗ.");
      } else {
        setMsg("Щоб іти далі: теорія → ≥70% карток → ДЗ.");
      }
    } else {
      setAllowNext(true);
      const r = p.homeworkScore ? p.homeworkScore.correct / Math.max(1, p.homeworkScore.total) : 1;
      setMsg(r >= 0.85 ? "≥85% ДЗ — можна наступний урок." : null);
    }
  }, [lessonId, cardsTotal]);

  return (
    <div className="mt-10 border-t border-line pt-6">
      {msg && <p className="mb-4 text-sm text-forest/70">{msg}</p>}
      <div className="flex justify-between text-sm">
        {prevId ? (
          <Link href={`/cabinet/courses/math/${prevId}`} className="text-teal hover:underline">
            ← Попередній
          </Link>
        ) : (
          <span />
        )}
        {nextId && allowNext ? (
          <Link href={`/cabinet/courses/math/${nextId}`} className="text-teal hover:underline">
            Наступний →
          </Link>
        ) : nextId ? (
          <span className="text-forest/40">Наступний закритий</span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export function HomeworkReadyNote({ lessonId }: { lessonId: string }) {
  const [needTheory, setNeedTheory] = useState(false);
  useEffect(() => {
    setNeedTheory(!getLessonProgress(lessonId).theoryDone);
  }, [lessonId]);
  if (!needTheory) return null;
  return (
    <p className="mb-4 rounded-[var(--radius-sm)] bg-amber-soft/80 px-3 py-2 text-sm">
      Спочатку натисни «Прочитав теорію» на сторінці уроку — інакше когорта не зарахує пакет.
    </p>
  );
}
