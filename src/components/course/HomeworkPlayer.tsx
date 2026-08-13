"use client";

import { useEffect, useMemo, useState } from "react";
import type { HomeworkItem } from "@/lib/course/types";
import { getLessonProgress, updateLessonProgress } from "@/lib/course/progress";

function normalizeOpen(value: string) {
  return value.trim().replace(",", ".").replace(/\s+/g, "").toLowerCase();
}

function checkItem(item: HomeworkItem, answer: unknown): boolean {
  if (item.type === "single") {
    return answer === item.answer;
  }
  if (item.type === "open") {
    return normalizeOpen(String(answer ?? "")) === normalizeOpen(item.answer);
  }
  if (item.type === "match") {
    const a = (answer ?? {}) as Record<string, string>;
    return Object.entries(item.answer).every(([k, v]) => a[k] === v);
  }
  return false;
}

export function HomeworkPlayer({ lessonId, items }: { lessonId: string; items: HomeworkItem[] }) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    setAnswers(p.homeworkAnswers ?? {});
    setChecked(Boolean(p.homeworkChecked));
  }, [lessonId]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const item of items) {
      if (checkItem(item, answers[item.id])) correct += 1;
    }
    return { correct, total: items.length };
  }, [checked, answers, items]);

  function setAnswer(id: string, value: unknown) {
    setChecked(false);
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      updateLessonProgress(lessonId, { homeworkAnswers: next, homeworkChecked: false });
      return next;
    });
  }

  function onCheck() {
    setChecked(true);
    let correct = 0;
    for (const item of items) {
      if (checkItem(item, answers[item.id])) correct += 1;
    }
    updateLessonProgress(lessonId, {
      homeworkChecked: true,
      homeworkScore: { correct, total: items.length },
    });
  }

  if (items.length === 0) {
    return <p className="text-forest/70">Завдань поки немає.</p>;
  }

  return (
    <div className="space-y-8">
      {items.map((item, idx) => {
        const ok = checked ? checkItem(item, answers[item.id]) : null;
        return (
          <article
            key={item.id}
            className={`border-t border-line pt-6 ${ok === false ? "opacity-95" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Завдання {idx + 1}
              {item.type === "single" && " · вибір відповіді"}
              {item.type === "match" && " · логічні пари"}
              {item.type === "open" && " · коротка відповідь"}
            </p>
            <p className="mt-2 font-medium text-ink">{item.prompt}</p>

            {item.type === "single" && (
              <div className="mt-4 space-y-2">
                {item.options.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${
                      answers[item.id] === opt.key
                        ? "border-teal bg-mist/70"
                        : "border-line bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={item.id}
                      className="mt-1"
                      checked={answers[item.id] === opt.key}
                      onChange={() => setAnswer(item.id, opt.key)}
                    />
                    <span>
                      <strong className="mr-2">{opt.key}.</strong>
                      {opt.text}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {item.type === "open" && (
              <input
                type="text"
                value={String(answers[item.id] ?? "")}
                onChange={(e) => setAnswer(item.id, e.target.value)}
                placeholder="Введи відповідь"
                className="mt-4 w-full max-w-md rounded-[var(--radius-sm)] border border-line bg-white px-3 py-2 text-ink outline-none focus:border-teal"
              />
            )}

            {item.type === "match" && (
              <div className="mt-4 space-y-3">
                {item.left.map((left) => (
                  <div key={left.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <p className="min-w-[40%] text-sm text-ink">
                      <strong>{left.key}.</strong> {left.text}
                    </p>
                    <select
                      className="rounded-[var(--radius-sm)] border border-line bg-white px-3 py-2 text-sm"
                      value={String((answers[item.id] as Record<string, string> | undefined)?.[left.key] ?? "")}
                      onChange={(e) => {
                        const prev = (answers[item.id] as Record<string, string> | undefined) ?? {};
                        setAnswer(item.id, { ...prev, [left.key]: e.target.value });
                      }}
                    >
                      <option value="">— оберіть —</option>
                      {item.right.map((r) => (
                        <option key={r.key} value={r.key}>
                          {r.key}. {r.text}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {checked && (
              <div
                className={`mt-4 rounded-[var(--radius-sm)] px-3 py-2 text-sm ${
                  ok ? "bg-mist text-forest" : "bg-amber-soft text-ink"
                }`}
              >
                <p className="font-semibold">{ok ? "Правильно" : "Неправильно"}</p>
                <p className="mt-1 text-forest/80">{item.explanation}</p>
                {item.type === "single" && (
                  <p className="mt-1">Правильна відповідь: {item.answer}</p>
                )}
                {item.type === "open" && <p className="mt-1">Правильна відповідь: {item.answer}</p>}
                {item.type === "match" && (
                  <p className="mt-1">
                    Правильні пари:{" "}
                    {Object.entries(item.answer)
                      .map(([k, v]) => `${k}→${v}`)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </article>
        );
      })}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={onCheck}
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white"
        >
          Перевірити
        </button>
        {score && (
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
            Результат: {score.correct}/{score.total}
          </p>
        )}
      </div>
    </div>
  );
}
