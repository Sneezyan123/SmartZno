"use client";

import { useEffect, useState } from "react";
import type { QuizCard } from "@/lib/course/types";
import { getLessonProgress, updateLessonProgress } from "@/lib/course/progress";

export function QuizCardsPlayer({ lessonId, cards }: { lessonId: string; cards: QuizCard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    setSeen(p.cardsSeen);
  }, [lessonId]);

  if (cards.length === 0) {
    return <p className="text-forest/70">Карток поки немає.</p>;
  }

  const card = cards[index];

  function markSeen(id: string) {
    setSeen((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      updateLessonProgress(lessonId, { cardsSeen: next });
      return next;
    });
  }

  function flip() {
    setFlipped((f) => !f);
    markSeen(card.id);
  }

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-4 text-sm text-forest/60">
        Картка {index + 1} / {cards.length} · переглянуто {seen.length}
      </p>

      <button
        type="button"
        onClick={flip}
        className="group relative w-full min-h-[220px] rounded-[var(--radius)] border border-line bg-white p-8 text-left shadow-[var(--shadow-soft)] transition hover:border-teal/40"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-teal">
          {flipped ? "Відповідь" : "Питання"} · натисни, щоб перевернути
        </span>
        <p className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold text-ink md:text-2xl">
          {flipped ? card.back : card.front}
        </p>
        {!flipped && card.hint && (
          <p className="mt-4 text-sm text-forest/55">Підказка: {card.hint}</p>
        )}
      </button>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
        >
          Далі
        </button>
      </div>
    </div>
  );
}
