import type { HomeworkItem } from "./types";

export function normalizeOpen(value: string) {
  return value.trim().replace(",", ".").replace(/\s+/g, "").toLowerCase();
}

export function asRecord(answer: unknown): Record<string, string> {
  return (answer ?? {}) as Record<string, string>;
}

export function asStringArray(answer: unknown): string[] {
  return Array.isArray(answer) ? answer.map(String) : [];
}

export function matchPairScore(
  item: Extract<HomeworkItem, { type: "match" }>,
  answer: unknown,
): { correct: number; total: number } {
  const a = asRecord(answer);
  const total = Object.keys(item.answer).length;
  let correct = 0;
  for (const [k, v] of Object.entries(item.answer)) {
    if (a[k] === v) correct += 1;
  }
  return { correct, total };
}

export function sequenceNmtScore(
  item: Extract<HomeworkItem, { type: "sequence" }>,
  answer: unknown,
): { got: number; max: number } {
  const given = asStringArray(answer);
  const correct = item.answer;
  const max = 3;
  if (given.length === 0) return { got: 0, max };
  const full =
    given.length === correct.length && given.every((key, i) => key === correct[i]);
  if (full) return { got: 3, max };
  const firstOk = given[0] === correct[0];
  const lastOk = given[given.length - 1] === correct[correct.length - 1];
  if (firstOk && lastOk) return { got: 2, max };
  if (firstOk || lastOk) return { got: 1, max };
  return { got: 0, max };
}

export function multiNmtScore(
  item: Extract<HomeworkItem, { type: "multi" }>,
  answer: unknown,
): { got: number; max: number } {
  const selected = asStringArray(answer);
  const got = item.answer.filter((key) => selected.includes(key)).length;
  return { got, max: item.answer.length };
}

export function nmtPoints(item: HomeworkItem, answer: unknown): { got: number; max: number } {
  if (item.type === "single") {
    return { got: checkItem(item, answer) ? 1 : 0, max: 1 };
  }
  if (item.type === "open") {
    return { got: checkItem(item, answer) ? 2 : 0, max: 2 };
  }
  if (item.type === "sequence") {
    return sequenceNmtScore(item, answer);
  }
  if (item.type === "multi") {
    return multiNmtScore(item, answer);
  }
  const p = matchPairScore(item, answer);
  return { got: p.correct, max: p.total };
}

export function checkItem(item: HomeworkItem, answer: unknown): boolean {
  if (item.type === "single") {
    return answer === item.answer;
  }
  if (item.type === "open") {
    return normalizeOpen(String(answer ?? "")) === normalizeOpen(item.answer);
  }
  if (item.type === "match") {
    const a = asRecord(answer);
    return Object.entries(item.answer).every(([k, v]) => a[k] === v);
  }
  if (item.type === "sequence") {
    const given = asStringArray(answer);
    return given.length === item.answer.length && given.every((key, i) => key === item.answer[i]);
  }
  if (item.type === "multi") {
    const selected = [...asStringArray(answer)].sort();
    const correct = [...item.answer].sort();
    return selected.length === correct.length && selected.every((key, i) => key === correct[i]);
  }
  return false;
}

export function computeHomeworkScore(
  items: HomeworkItem[],
  answers: Record<string, unknown>,
): { correct: number; total: number; nmtGot: number; nmtMax: number } {
  let correct = 0;
  let nmtGot = 0;
  let nmtMax = 0;
  for (const item of items) {
    if (checkItem(item, answers[item.id])) correct += 1;
    const pts = nmtPoints(item, answers[item.id]);
    nmtGot += pts.got;
    nmtMax += pts.max;
  }
  return { correct, total: items.length, nmtGot, nmtMax };
}
