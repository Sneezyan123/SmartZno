"use client";

import { useEffect, useState } from "react";
import type { CourseSlug, QuizCard } from "@/lib/course/types";
import { getLessonProgress, updateLessonProgress } from "@/lib/course/progress";

export function QuizCardsPlayer({
  lessonId,
  cards,
  course = "math",
}: {
  lessonId: string;
  cards: QuizCard[];
  course?: CourseSlug;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    const p = getLessonProgress(lessonId, course);
    setSeen(p.cardsSeen);
  }, [lessonId, course]);

  if (cards.length === 0) {
    return <p className="text-forest/70">Карток поки немає.</p>;
  }

  const card = cards[index];

  function markSeen(id: string) {
    setSeen((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      updateLessonProgress(lessonId, { cardsSeen: next }, course);
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
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-forest/60">
        <span>
          Картка {index + 1} з {cards.length}
        </span>
        <span>переглянуто {seen.length}</span>
      </div>
      <div className="mb-5 flex gap-1">
        {cards.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Картка ${i + 1}`}
            onClick={() => {
              setFlipped(false);
              setIndex(i);
            }}
            className={`h-1.5 flex-1 rounded-full transition ${
              i === index ? "bg-forest" : seen.includes(item.id) ? "bg-teal/50" : "bg-line"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={flip}
        className="quiz-flip-scene w-full text-left"
        aria-label={`Картка: ${card.front}. Перегорнути`}
      >
        <div className={`flip-scene-inner ${flipped ? "is-flipped" : ""}`}>
          <div className="flip-face flex flex-col rounded-[1.25rem] border border-white/10 bg-[#0b1524] p-6 shadow-[0_18px_40px_rgba(8,16,28,0.45)] md:p-8">
            <span className="inline-flex w-fit rounded-md bg-[#4db8ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Питання
            </span>
            <p className="mt-4 flex-1 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug text-white md:text-2xl">
              {card.front}
            </p>
            {!card.hint ? null : <p className="mt-4 text-sm text-white/55">Підказка: {card.hint}</p>}
            <span className="mt-6 text-sm font-semibold text-[#7ed0ff]">Перегорнути</span>
          </div>
          <div className="flip-face flip-face-back flex flex-col rounded-[1.25rem] border border-white/10 bg-[#13233a] p-6 shadow-[0_18px_40px_rgba(8,16,28,0.45)] md:p-8">
            <span className="inline-flex w-fit rounded-md bg-[#4db8ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Відповідь
            </span>
            <p className="mt-4 flex-1 text-base leading-7 text-white/90 md:text-lg">{card.back}</p>
            <span className="mt-6 text-sm font-semibold text-[#7ed0ff]">Перегорнути</span>
          </div>
        </div>
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
