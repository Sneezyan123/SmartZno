import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function lesson({ id, moduleId, title, order, objectives, nmtTags, subtopics = [], theory, cards, hw }) {
  return {
    id,
    moduleId,
    title,
    slug: id,
    order,
    status: "ready",
    objectives,
    nmtTags,
    subtopics,
    theory,
    quizCards: cards.map((c, i) => {
      const item = {
        id: `${id}-c${String(i + 1).padStart(2, "0")}`,
        front: c[0],
        back: c[1],
      };
      if (c[2]) item.hint = c[2];
      return item;
    }),
    homework: hw,
  };
}

export const h = (content) => ({ type: "heading", content });
export const p = (content) => ({ type: "paragraph", content });
export const tip = (content) => ({ type: "tip", content });
export const list = (content, items) => ({ type: "list", content, items });
export const ex = (content, items) => ({ type: "example", content, ...(items ? { items } : {}) });

function opts(pairs) {
  return pairs.map(([key, text]) => ({ key, text }));
}

export function single(id, prompt, options, answer, explanation) {
  return { id, type: "single", prompt, options: opts(options), answer, explanation };
}

export function match(id, prompt, left, right, answer, explanation) {
  return { id, type: "match", prompt, left: opts(left), right: opts(right), answer, explanation };
}

export function seq(id, prompt, items, answer, explanation) {
  return { id, type: "sequence", prompt, items: opts(items), answer, explanation };
}

export function multi(id, prompt, options, answer, explanation) {
  return { id, type: "multi", prompt, options: opts(options), answer, explanation };
}

export function writeLessons(lessons) {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "history-nmt", "lessons");
  mkdirSync(root, { recursive: true });
  for (const item of lessons) {
    writeFileSync(path.join(root, `${item.id}.json`), JSON.stringify(item, null, 2), "utf-8");
  }
}
