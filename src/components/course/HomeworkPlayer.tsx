"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseSlug, HomeworkItem, OptionKey } from "@/lib/course/types";
import { getLessonProgress, updateLessonProgress } from "@/lib/course/progress";
import {
  asRecord,
  asStringArray,
  checkItem,
  computeHomeworkScore,
  matchPairScore,
  multiNmtScore,
  sequenceNmtScore,
} from "@/lib/course/homework-scoring";

function typeLabel(item: HomeworkItem) {
  if (item.type === "single") return "вибір відповіді";
  if (item.type === "match") return "логічні пари";
  if (item.type === "open") return "коротка відповідь";
  if (item.type === "sequence") return "послідовність";
  return "три з семи";
}

function ordinalUk(n: number) {
  if (n === 1) return "1-ша";
  if (n === 2) return "2-га";
  if (n === 3) return "3-тя";
  return `${n}-та`;
}

export function HomeworkPlayer({
  lessonId,
  items,
  course = "math",
}: {
  lessonId: string;
  items: HomeworkItem[];
  course?: CourseSlug;
}) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const p = getLessonProgress(lessonId, course);
    setAnswers(p.homeworkAnswers ?? {});
    setChecked(Boolean(p.homeworkChecked));
  }, [lessonId, course]);

  const isMock = lessonId.startsWith("m7-") || course === "history";

  const score = useMemo(
    () => (checked ? computeHomeworkScore(items, answers) : null),
    [checked, answers, items],
  );

  function setAnswer(id: string, value: unknown) {
    setChecked(false);
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      updateLessonProgress(lessonId, { homeworkAnswers: next, homeworkChecked: false }, course);
      return next;
    });
  }

  function onCheck() {
    setChecked(true);
    const result = computeHomeworkScore(items, answers);
    updateLessonProgress(
      lessonId,
      {
        homeworkChecked: true,
        homeworkScore: {
          correct: result.correct,
          total: result.total,
          nmtGot: result.nmtGot,
          nmtMax: result.nmtMax,
        },
      },
      course,
    );
  }

  if (items.length === 0) {
    return <p className="text-forest/70">Завдань поки немає.</p>;
  }

  return (
    <div className="space-y-8">
      {items.map((item, idx) => {
        const ok = checked ? checkItem(item, answers[item.id]) : null;
        const pairScore =
          checked && item.type === "match" ? matchPairScore(item, answers[item.id]) : null;
        const seqScore =
          checked && item.type === "sequence" ? sequenceNmtScore(item, answers[item.id]) : null;
        const multiScore =
          checked && item.type === "multi" ? multiNmtScore(item, answers[item.id]) : null;
        const partial =
          (pairScore !== null && pairScore.correct > 0 && pairScore.correct < pairScore.total) ||
          (seqScore !== null && seqScore.got > 0 && seqScore.got < seqScore.max) ||
          (multiScore !== null && multiScore.got > 0 && multiScore.got < multiScore.max);
        return (
          <article
            key={item.id}
            className={`border-t border-line pt-6 ${ok === false ? "opacity-95" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              Завдання {idx + 1} · {typeLabel(item)}
            </p>
            <p className="mt-2 font-medium text-ink">{item.prompt}</p>
            {"image" in item && item.image ? (
              <figure className="mt-4 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-white">
                <img
                  src={item.image}
                  alt={item.imageCaption || item.prompt}
                  className="mx-auto max-h-72 object-contain"
                />
                {item.imageCaption ? (
                  <figcaption className="px-3 py-2 text-xs text-forest/55">{item.imageCaption}</figcaption>
                ) : null}
              </figure>
            ) : null}

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
                      value={String(asRecord(answers[item.id])[left.key] ?? "")}
                      onChange={(e) => {
                        const prev = asRecord(answers[item.id]);
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

            {item.type === "sequence" && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-forest/60">
                  Розстав події від найранішої до найпізнішої.
                </p>
                {item.answer.map((_, pos) => {
                  const current = asStringArray(answers[item.id]);
                  return (
                    <div key={pos} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <p className="min-w-[28%] text-sm font-medium text-ink">
                        {ordinalUk(pos + 1)} подія
                      </p>
                      <select
                        className="rounded-[var(--radius-sm)] border border-line bg-white px-3 py-2 text-sm"
                        value={current[pos] ?? ""}
                        onChange={(e) => {
                          const next = [...current];
                          next.length = item.answer.length;
                          next[pos] = e.target.value;
                          setAnswer(item.id, next);
                        }}
                      >
                        <option value="">— оберіть —</option>
                        {item.items.map((ev) => (
                          <option key={ev.key} value={ev.key}>
                            {ev.key}. {ev.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}

            {item.type === "multi" && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-forest/60">Обери три правильні відповіді.</p>
                {item.options.map((opt) => {
                  const selected = asStringArray(answers[item.id]);
                  const on = selected.includes(opt.key);
                  return (
                    <label
                      key={opt.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${
                        on ? "border-teal bg-mist/70" : "border-line bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={on}
                        onChange={() => {
                          if (!on && selected.length >= 3) return;
                          const next = on
                            ? selected.filter((k) => k !== opt.key)
                            : [...selected, opt.key];
                          setAnswer(item.id, next as OptionKey[]);
                        }}
                      />
                      <span>
                        <strong className="mr-2">{opt.key}.</strong>
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {checked && (
              <div
                className={`mt-4 rounded-[var(--radius-sm)] px-3 py-2 text-sm ${
                  ok || partial ? "bg-mist text-forest" : "bg-amber-soft text-ink"
                }`}
              >
                <p className="font-semibold">
                  {ok
                    ? "Правильно"
                    : partial && pairScore
                      ? `Частково: ${pairScore.correct}/${pairScore.total}`
                      : partial && seqScore
                        ? `Частково: ${seqScore.got}/${seqScore.max} б.`
                        : partial && multiScore
                          ? `Частково: ${multiScore.got}/${multiScore.max}`
                          : "Неправильно"}
                </p>
                <p className="mt-1 text-forest/80">{item.explanation}</p>
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
            {isMock
              ? `Тестові бали: ${score.nmtGot}/${score.nmtMax}`
              : `Результат: ${score.correct}/${score.total}`}
          </p>
        )}
      </div>
    </div>
  );
}
