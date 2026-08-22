"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Текст завдань змішаний: українські слова + математика.
 * Явна математика пишеться в $...$ і йде через KaTeX,
 * решта проходить легкий автопрохід: латинські літери стають
 * курсивними змінними, цифри після літери — індексами (A1 → A₁).
 */

const FUNCTIONS = new Set([
  "sin",
  "cos",
  "tg",
  "ctg",
  "tan",
  "cot",
  "arcsin",
  "arccos",
  "arctg",
  "arcctg",
  "log",
  "ln",
  "lg",
  "max",
  "min",
  "const",
]);

const LATIN = /[A-Za-z]/;
const DIGIT = /[0-9]/;
const INDEX_CHAR = /[A-Za-z0-9а-яїієґА-ЯІЇЄҐ]/;

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tex(source: string): string {
  try {
    return katex.renderToString(source, { throwOnError: false, strict: false });
  } catch {
    return esc(source);
  }
}

/** Читає індекс після `_` або злиті цифри: `A_1`, `A_{n+1}`, `A1`. */
function readIndex(src: string, from: number): { text: string; next: number } {
  let i = from;

  if (src[i] === "_" || src[i] === "^") {
    i += 1;
    if (src[i] === "{") {
      const end = src.indexOf("}", i + 1);
      if (end > -1) return { text: src.slice(i + 1, end), next: end + 1 };
      return { text: "", next: from };
    }
    const start = i;
    while (i < src.length && INDEX_CHAR.test(src[i])) i += 1;
    return { text: src.slice(start, i), next: i };
  }

  const start = i;
  while (i < src.length && DIGIT.test(src[i])) i += 1;
  return { text: src.slice(start, i), next: i };
}

function autoMath(src: string): string {
  let out = "";
  let i = 0;

  while (i < src.length) {
    const char = src[i];

    if (!LATIN.test(char)) {
      out += esc(char);
      i += 1;
      continue;
    }

    let word = i;
    while (word < src.length && LATIN.test(src[word])) word += 1;
    const run = src.slice(i, word);

    if (FUNCTIONS.has(run.toLowerCase())) {
      out += `<span class="m-fn">${esc(run)}</span>`;
      i = word;
      continue;
    }

    const sup = src[i + 1] === "^";
    const index = readIndex(src, i + 1);
    out += `<i class="m-var">${esc(char)}</i>`;
    if (index.text) {
      out += sup ? `<sup>${esc(index.text)}</sup>` : `<sub>${esc(index.text)}</sub>`;
    }
    i = index.text ? index.next : i + 1;
  }

  return out;
}

function toHtml(src: string): string {
  const parts: string[] = [];
  const re = /\$([^$]+)\$/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(src)) !== null) {
    parts.push(autoMath(src.slice(last, match.index)));
    parts.push(tex(match[1]));
    last = match.index + match[0].length;
  }
  parts.push(autoMath(src.slice(last)));

  return parts.join("");
}

export function MathText({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => toHtml(text), [text]);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
