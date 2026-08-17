"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { HomeworkItem, HomeworkLevel } from "@/lib/course/types";
import { getLessonProgress, updateLessonProgress } from "@/lib/course/progress";
import { addMistake, loadProfile, updateProfile } from "@/lib/course/profile";
import { filterHomeworkByLevel } from "@/lib/course/tracks";

function normalizeOpen(value: string) {
  return value.trim().replace(",", ".").replace(/\s+/g, "").toLowerCase();
}

function matchPairScore(
  item: Extract<HomeworkItem, { type: "match" }>,
  answer: unknown,
): { correct: number; total: number } {
  const a = (answer ?? {}) as Record<string, string>;
  const total = Object.keys(item.answer).length;
  let correct = 0;
  for (const [k, v] of Object.entries(item.answer)) {
    if (a[k] === v) correct += 1;
  }
  return { correct, total };
}

function nmtPoints(item: HomeworkItem, answer: unknown): { got: number; max: number } {
  if (item.type === "single") {
    return { got: checkItem(item, answer) ? 1 : 0, max: 1 };
  }
  if (item.type === "open") {
    return { got: checkItem(item, answer) ? 2 : 0, max: 2 };
  }
  const p = matchPairScore(item, answer);
  return { got: p.correct, max: p.total };
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

/** Isolated so the 1s tick does not re-render all questions. */
function MockTimer({
  endAt,
  onExpire,
}: {
  endAt: number;
  onExpire: () => void;
}) {
  const [remainSec, setRemainSec] = useState(() =>
    Math.max(0, Math.floor((endAt - Date.now()) / 1000)),
  );

  useEffect(() => {
    let expired = false;
    const tick = () => {
      const left = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
      setRemainSec(left);
      if (left === 0 && !expired) {
        expired = true;
        onExpire();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endAt, onExpire]);

  const mm = Math.floor(remainSec / 60);
  const ss = remainSec % 60;

  return (
    <p
      className={`font-[family-name:var(--font-display)] text-xl font-semibold ${
        remainSec < 300 ? "text-amber" : "text-ink"
      }`}
    >
      {mm}:{String(ss).padStart(2, "0")}
    </p>
  );
}

export function HomeworkPlayer({
  lessonId,
  items,
  timedMinutes = 0,
}: {
  lessonId: string;
  items: HomeworkItem[];
  timedMinutes?: number;
}) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState(false);
  const [level, setLevel] = useState<HomeworkLevel>("B");
  const [endAt, setEndAt] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  const visible = useMemo(() => filterHomeworkByLevel(items, level), [items, level]);
  const isMock = lessonId.startsWith("m7-");
  const timed = timedMinutes > 0 || isMock;

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    setAnswers(p.homeworkAnswers ?? {});
    setChecked(Boolean(p.homeworkChecked));
    const profile = loadProfile();
    setLevel(profile.level);
    if (!timed) {
      setEndAt(null);
      setExpired(false);
      return;
    }
    let started = p.mockStartedAt;
    if (!started) {
      started = new Date().toISOString();
      updateLessonProgress(lessonId, { mockStartedAt: started });
    }
    const end = new Date(started).getTime() + (timedMinutes || 60) * 60 * 1000;
    setEndAt(end);
    setExpired(Date.now() >= end && !p.homeworkChecked);
  }, [lessonId, timed, timedMinutes]);

  const onExpire = useCallback(() => {
    setExpired(true);
    updateLessonProgress(lessonId, { mockTimedOut: true });
  }, [lessonId]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    let nmtGot = 0;
    let nmtMax = 0;
    for (const item of visible) {
      if (checkItem(item, answers[item.id])) correct += 1;
      const pts = nmtPoints(item, answers[item.id]);
      nmtGot += pts.got;
      nmtMax += pts.max;
    }
    return { correct, total: visible.length, nmtGot, nmtMax };
  }, [checked, answers, visible]);

  const locked = timed && expired && !checked;

  function setAnswer(id: string, value: unknown) {
    if (locked) return;
    setChecked(false);
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      updateLessonProgress(
        lessonId,
        { homeworkAnswers: next, homeworkChecked: false },
        { syncDebounceMs: 450 },
      );
      return next;
    });
  }

  function onCheck() {
    setChecked(true);
    let correct = 0;
    let nmtGot = 0;
    let nmtMax = 0;
    for (const item of visible) {
      const ok = checkItem(item, answers[item.id]);
      if (ok) correct += 1;
      else addMistake(lessonId, item.id, item.reviewLessonId);
      const pts = nmtPoints(item, answers[item.id]);
      nmtGot += pts.got;
      nmtMax += pts.max;
    }
    updateLessonProgress(lessonId, {
      homeworkChecked: true,
      homeworkScore: { correct, total: visible.length, nmtGot, nmtMax },
    });
    const p = loadProfile();
    updateProfile({
      lastHwAt: new Date().toISOString(),
      coins: p.coins + Math.max(1, correct),
      streak: p.streak + 1,
    });
  }

  if (items.length === 0) {
    return <p className="text-forest/70">Завдань поки немає.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          {(["C", "B", "A"] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => {
                setLevel(lv);
                updateProfile({ level: lv });
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                level === lv ? "bg-violet text-white" : "border border-line text-forest"
              }`}
            >
              Рівень {lv}
            </button>
          ))}
        </div>
        {timed && endAt !== null && <MockTimer endAt={endAt} onExpire={onExpire} />}
      </div>
      {locked && (
        <p className="rounded-[var(--radius-sm)] bg-amber-soft px-3 py-2 text-sm">
          Час вичерпано. Перевір відповіді — як на НМТ, далі пишеться те, що в бланку.
        </p>
      )}

      {visible.map((item, idx) => {
        const ok = checked ? checkItem(item, answers[item.id]) : null;
        const pairScore =
          checked && item.type === "match" ? matchPairScore(item, answers[item.id]) : null;
        const partial = pairScore !== null && pairScore.correct > 0 && pairScore.correct < pairScore.total;
        const reviewId = item.reviewLessonId;
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
              {item.level && item.level !== "B" ? ` · ${item.level}` : ""}
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
                        : "border-line bg-surface"
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
                className="field mt-4 max-w-md px-3 py-2"
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
                      className="field px-3 py-2 text-sm"
                      value={String(
                        (answers[item.id] as Record<string, string> | undefined)?.[left.key] ?? "",
                      )}
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
                  ok || partial ? "bg-mist text-forest" : "bg-amber-soft text-ink"
                }`}
              >
                <p className="font-semibold">
                  {ok
                    ? "Правильно"
                    : partial && pairScore
                      ? `Частково: ${pairScore.correct}/${pairScore.total}`
                      : "Неправильно"}
                </p>
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
                {ok === false && reviewId && (
                  <p className="mt-2">
                    <Link href={`/cabinet/courses/math/${reviewId}`} className="text-teal underline">
                      Робота над помилками → урок {reviewId}
                    </Link>
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
          className="rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white"
        >
          Перевірити
        </button>
        {score && (
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
            {isMock
              ? `Тестові бали: ${score.nmtGot}/${score.nmtMax}`
              : `Результат: ${score.correct}/${score.total}`}
            {isMock && score.nmtGot / Math.max(score.nmtMax, 1) < 0.7
              ? " · повтор карток теми помилок"
              : ""}
            {isMock && score.nmtGot / Math.max(score.nmtMax, 1) >= 0.85
              ? " · можна наступний mock"
              : ""}
          </p>
        )}
        {checked && (
          <Link href="/cabinet/courses/math/review" className="text-sm text-teal underline">
            Усі помилки
          </Link>
        )}
      </div>
    </div>
  );
}
