"use client";

import { useEffect, useMemo, useState } from "react";
import type { HomeworkItem, OptionKey } from "@/lib/course/types";
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
import { MathText } from "./MathText";

type BoxState = "empty" | "on" | "ok" | "bad" | "miss";

const BOX_BORDER: Record<BoxState, string> = {
  empty: "border-[#9a9a9a]",
  on: "border-[#2f2f2f]",
  ok: "border-[#3f9142]",
  bad: "border-[#cf3b3b]",
  miss: "border-[#3f9142] border-dashed",
};

const BOX_MARK: Record<BoxState, string> = {
  empty: "text-transparent",
  on: "text-[#2f2f2f]",
  ok: "text-[#3f9142]",
  bad: "text-[#cf3b3b]",
  miss: "text-transparent",
};

function XMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]">
      <path
        d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Клітинка бланка: літера згори, квадрат із хрестиком. */
function AnswerBox({
  label,
  state,
  onClick,
  disabled,
}: {
  label: string;
  state: BoxState;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-9 flex-col items-center gap-1 disabled:cursor-default"
    >
      <span className="text-[12px] font-bold leading-none text-[#333]">{label}</span>
      <span
        className={`flex h-8 w-8 items-center justify-center border bg-white transition-colors ${BOX_BORDER[state]} ${BOX_MARK[state]} ${
          disabled ? "" : "hover:border-[#2f2f2f]"
        }`}
      >
        <XMark />
      </span>
    </button>
  );
}

/** Літера варіанта в сірому квадраті — як у друкованому зошиті. */
function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-[1px] inline-flex h-[23px] w-[23px] shrink-0 items-center justify-center bg-[#ebebeb] text-[12px] font-bold text-[#222]">
      {children}
    </span>
  );
}

function SheetTop({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center">
      <span className="h-px flex-1 bg-[#dcdcdc]" />
      <span className="border border-[#7cb342] bg-white px-3 py-[5px] text-[13px] text-[#333]">
        Завдання {current} з {total}
      </span>
    </div>
  );
}

function Prompt({ text }: { text: string }) {
  return (
    <p className="mt-5 text-[15px] leading-[1.6] text-[#1a1a1a]">
      <MathText text={text} />
    </p>
  );
}

function Figure({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="mt-5 mb-1 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption ?? ""} className="max-h-72 max-w-full object-contain" />
      {caption && <figcaption className="mt-2 text-[12px] text-[#777]">{caption}</figcaption>}
    </figure>
  );
}

function OptionList({
  options,
  activeKeys,
  disabled,
  onPick,
}: {
  options: { key: OptionKey; text: string }[];
  activeKeys: string[];
  disabled: boolean;
  onPick: (key: OptionKey) => void;
}) {
  return (
    <ul className="mt-5 space-y-[9px]">
      {options.map((opt) => (
        <li key={opt.key}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onPick(opt.key)}
            className={`flex w-full items-start gap-2.5 py-[3px] pr-2 text-left transition-colors disabled:cursor-default ${
              activeKeys.includes(opt.key) ? "bg-[#f4f7ee]" : disabled ? "" : "hover:bg-[#fafafa]"
            }`}
          >
            <KeyBadge>{opt.key}</KeyBadge>
            <MathText text={opt.text} className="text-[15px] leading-[1.5] text-[#1a1a1a]" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function MarkArea({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7 border-t border-[#e2e2e2] pt-4">
      <p className="text-[13px] text-[#555]">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function pickState(
  key: string,
  selected: string[],
  correct: string[],
  checked: boolean,
): BoxState {
  if (!checked) return selected.includes(key) ? "on" : "empty";
  if (selected.includes(key)) return correct.includes(key) ? "ok" : "bad";
  return correct.includes(key) ? "miss" : "empty";
}

function ChoiceTask({
  item,
  answer,
  checked,
  onAnswer,
}: {
  item: Extract<HomeworkItem, { type: "single" | "multi" }>;
  answer: unknown;
  checked: boolean;
  onAnswer: (keys: OptionKey[]) => void;
}) {
  const multi = item.type === "multi";
  const selected = multi
    ? (asStringArray(answer) as OptionKey[])
    : answer
      ? [answer as OptionKey]
      : [];
  const correct = multi ? item.answer : [item.answer];

  function pick(key: OptionKey) {
    if (checked) return;
    if (!multi) return onAnswer([key]);
    const on = selected.includes(key);
    if (!on && selected.length >= correct.length) return;
    onAnswer(on ? selected.filter((k) => k !== key) : [...selected, key]);
  }

  return (
    <>
      <Prompt text={item.prompt} />
      {item.image ? <Figure src={item.image} caption={item.imageCaption} /> : null}

      <OptionList options={item.options} activeKeys={selected} disabled={checked} onPick={pick} />

      <MarkArea title={multi ? `Позначте ${correct.length} відповіді:` : "Позначте відповіді:"}>
        <div className="flex flex-wrap gap-1.5">
          {item.options.map((opt) => (
            <AnswerBox
              key={opt.key}
              label={opt.key}
              state={pickState(opt.key, selected, correct, checked)}
              onClick={() => pick(opt.key)}
              disabled={checked}
            />
          ))}
        </div>
      </MarkArea>
    </>
  );
}

/** Сітка бланка: літери в шапці, рядок на кожен пункт. */
function MarkGrid({
  rows,
  columns,
  selectedIn,
  correctIn,
  checked,
  onPick,
}: {
  rows: string[];
  columns: string[];
  selectedIn: (row: string) => string;
  correctIn: (row: string) => string;
  checked: boolean;
  onPick: (row: string, column: string) => void;
}) {
  return (
    <div className="inline-block">
      <div className="mb-1 flex gap-1.5 pl-[2.125rem]">
        {columns.map((column) => (
          <span
            key={column}
            className="w-8 text-center text-[12px] font-bold leading-none text-[#333]"
          >
            {column}
          </span>
        ))}
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className="w-7 text-[13px] font-bold text-[#333]">{row}</span>
            {columns.map((column) => {
              const selected = selectedIn(row);
              const state = pickState(
                column,
                selected ? [selected] : [],
                [correctIn(row)],
                checked,
              );
              return (
                <button
                  key={column}
                  type="button"
                  disabled={checked}
                  onClick={() => onPick(row, column)}
                  className={`flex h-8 w-8 items-center justify-center border bg-white transition-colors ${BOX_BORDER[state]} ${BOX_MARK[state]} ${
                    checked ? "cursor-default" : "hover:border-[#2f2f2f]"
                  }`}
                >
                  <XMark />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchTask({
  item,
  answer,
  checked,
  onAnswer,
}: {
  item: Extract<HomeworkItem, { type: "match" }>;
  answer: unknown;
  checked: boolean;
  onAnswer: (leftKey: string, letter: OptionKey) => void;
}) {
  const selected = asRecord(answer);

  return (
    <>
      <Prompt text={item.prompt} />

      <div className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-2">
        <ul className="space-y-[9px]">
          {item.left.map((row) => (
            <li key={row.key} className="flex items-start gap-2.5">
              <KeyBadge>{row.key}</KeyBadge>
              <MathText text={row.text} className="text-[15px] leading-[1.5] text-[#1a1a1a]" />
            </li>
          ))}
        </ul>
        <ul className="space-y-[9px]">
          {item.right.map((row) => (
            <li key={row.key} className="flex items-start gap-2.5">
              <KeyBadge>{row.key}</KeyBadge>
              <MathText text={row.text} className="text-[15px] leading-[1.5] text-[#1a1a1a]" />
            </li>
          ))}
        </ul>
      </div>

      <MarkArea title="Позначте відповіді:">
        <MarkGrid
          rows={item.left.map((row) => row.key)}
          columns={item.right.map((row) => row.key)}
          selectedIn={(row) => selected[row] ?? ""}
          correctIn={(row) => item.answer[row]}
          checked={checked}
          onPick={(row, column) => onAnswer(row, column as OptionKey)}
        />
      </MarkArea>
    </>
  );
}

function OpenTask({
  item,
  answer,
  checked,
  onAnswer,
}: {
  item: Extract<HomeworkItem, { type: "open" }>;
  answer: unknown;
  checked: boolean;
  onAnswer: (value: string) => void;
}) {
  const value = String(answer ?? "");
  const ok = checked ? checkItem(item, answer) : null;

  return (
    <>
      <Prompt text={item.prompt} />

      <MarkArea title="Впишіть відповідь:">
        <input
          type="text"
          value={value}
          onChange={(e) => !checked && onAnswer(e.target.value)}
          disabled={checked}
          inputMode="decimal"
          className={`h-10 w-40 border bg-white px-3 text-center text-[16px] tracking-[0.12em] text-[#1a1a1a] outline-none ${
            ok === true
              ? "border-[#3f9142]"
              : ok === false
                ? "border-[#cf3b3b]"
                : "border-[#9a9a9a] focus:border-[#2f2f2f]"
          }`}
        />
        {checked && ok === false && (
          <p className="mt-2 text-[13px] text-[#555]">
            Правильна відповідь: <span className="font-semibold text-[#1a1a1a]">{item.answer}</span>
          </p>
        )}
      </MarkArea>
    </>
  );
}

function SequenceTask({
  item,
  answer,
  checked,
  onAnswer,
}: {
  item: Extract<HomeworkItem, { type: "sequence" }>;
  answer: unknown;
  checked: boolean;
  onAnswer: (keys: string[]) => void;
}) {
  const order = asStringArray(answer);
  const slots = item.answer.length;

  function pick(slot: number, key: string) {
    if (checked) return;
    const next = [...order];
    while (next.length < slots) next.push("");
    next[slot] = next[slot] === key ? "" : key;
    onAnswer(next);
  }

  const rows = Array.from({ length: slots }, (_, slot) => String(slot + 1));

  return (
    <>
      <Prompt text={item.prompt} />

      <ul className="mt-5 space-y-[9px]">
        {item.items.map((row) => (
          <li key={row.key} className="flex items-start gap-2.5">
            <KeyBadge>{row.key}</KeyBadge>
            <MathText text={row.text} className="text-[15px] leading-[1.5] text-[#1a1a1a]" />
          </li>
        ))}
      </ul>

      <MarkArea title="Позначте послідовність:">
        <MarkGrid
          rows={rows}
          columns={item.items.map((row) => row.key)}
          selectedIn={(row) => order[Number(row) - 1] ?? ""}
          correctIn={(row) => item.answer[Number(row) - 1]}
          checked={checked}
          onPick={(row, column) => pick(Number(row) - 1, column)}
        />
      </MarkArea>
    </>
  );
}

function Feedback({ item, answer }: { item: HomeworkItem; answer: unknown }) {
  const ok = checkItem(item, answer);
  const pairScore = item.type === "match" ? matchPairScore(item, answer) : null;
  const seqScore = item.type === "sequence" ? sequenceNmtScore(item, answer) : null;
  const multiScore = item.type === "multi" ? multiNmtScore(item, answer) : null;
  const partial =
    (pairScore !== null && pairScore.correct > 0 && pairScore.correct < pairScore.total) ||
    (seqScore !== null && seqScore.got > 0 && seqScore.got < seqScore.max) ||
    (multiScore !== null && multiScore.got > 0 && multiScore.got < multiScore.max);

  const title = ok
    ? "Правильно"
    : partial && pairScore
      ? `Частково: ${pairScore.correct}/${pairScore.total}`
      : partial && seqScore
        ? `Частково: ${seqScore.got}/${seqScore.max} б.`
        : partial && multiScore
          ? `Частково: ${multiScore.got}/${multiScore.max}`
          : "Неправильно";

  return (
    <div
      className={`mt-5 border-l-[3px] pl-3 ${ok || partial ? "border-[#7cb342]" : "border-[#e0a030]"}`}
    >
      <p className="text-[13px] font-bold text-[#1a1a1a]">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.55] text-[#555]">
        <MathText text={item.explanation} />
      </p>
    </div>
  );
}

export function MathNmtPlayer({ lessonId, items }: { lessonId: string; items: HomeworkItem[] }) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const p = getLessonProgress(lessonId, "math");
    setAnswers(p.homeworkAnswers ?? {});
    setChecked(Boolean(p.homeworkChecked));
  }, [lessonId]);

  const score = useMemo(
    () => (checked ? computeHomeworkScore(items, answers) : null),
    [checked, answers, items],
  );

  const item = items[index];
  const isMock = lessonId.startsWith("m7-");

  function setAnswer(id: string, value: unknown) {
    setChecked(false);
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      updateLessonProgress(lessonId, { homeworkAnswers: next, homeworkChecked: false }, "math");
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
      "math",
    );
  }

  if (items.length === 0) {
    return <p className="text-forest/70">Завдань поки немає.</p>;
  }

  const answered = (i: number) => {
    const value = answers[items[i].id];
    return value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0);
  };

  return (
    <div className="nmt-sheet">
      <SheetTop current={index + 1} total={items.length} />

      {(item.type === "single" || item.type === "multi") && (
        <ChoiceTask
          item={item}
          answer={answers[item.id]}
          checked={checked}
          onAnswer={(keys) => setAnswer(item.id, item.type === "single" ? keys[0] : keys)}
        />
      )}

      {item.type === "match" && (
        <MatchTask
          item={item}
          answer={answers[item.id]}
          checked={checked}
          onAnswer={(leftKey, letter) => {
            const prev = asRecord(answers[item.id]);
            setAnswer(item.id, { ...prev, [leftKey]: letter });
          }}
        />
      )}

      {item.type === "open" && (
        <OpenTask
          item={item}
          answer={answers[item.id]}
          checked={checked}
          onAnswer={(v) => setAnswer(item.id, v)}
        />
      )}

      {item.type === "sequence" && (
        <SequenceTask
          item={item}
          answer={answers[item.id]}
          checked={checked}
          onAnswer={(keys) => setAnswer(item.id, keys)}
        />
      )}

      {checked && <Feedback item={item} answer={answers[item.id]} />}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#e2e2e2] pt-4">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="border border-[#cfcfcf] px-3 py-[7px] text-[13px] text-[#444] transition-colors hover:border-[#9a9a9a] disabled:opacity-35 disabled:hover:border-[#cfcfcf]"
        >
          ← Назад
        </button>

        <div className="flex flex-wrap justify-center gap-[3px]">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Завдання ${i + 1}`}
              className={`h-[6px] w-[6px] ${
                i === index ? "bg-[#2f2f2f]" : answered(i) ? "bg-[#7cb342]" : "bg-[#dcdcdc]"
              }`}
            />
          ))}
        </div>

        {index < items.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="border border-[#9a9a9a] px-3 py-[7px] text-[13px] text-[#1a1a1a] transition-colors hover:border-[#2f2f2f]"
          >
            Далі →
          </button>
        ) : (
          <button
            type="button"
            onClick={onCheck}
            className="border border-[#7cb342] bg-[#7cb342] px-4 py-[7px] text-[13px] font-semibold text-white"
          >
            Перевірити
          </button>
        )}
      </div>

      {score && (
        <p className="mt-4 text-[14px] text-[#333]">
          {isMock
            ? `Тестові бали: ${score.nmtGot} з ${score.nmtMax}`
            : `Результат: ${score.correct} з ${score.total}`}
        </p>
      )}
    </div>
  );
}
