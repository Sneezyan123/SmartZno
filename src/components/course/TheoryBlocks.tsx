import type { TheoryBlock } from "@/lib/course/types";

export function TheoryBlocks({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink md:text-2xl"
            >
              {block.content}
            </h2>
          );
        }
        if (block.type === "formula") {
          return (
            <div
              key={i}
              className="overflow-x-auto rounded-[var(--radius-sm)] border border-teal/20 bg-mist/60 px-4 py-3 font-mono text-sm text-forest md:text-base"
            >
              {block.content}
            </div>
          );
        }
        if (block.type === "example") {
          return (
            <div key={i} className="border-l-4 border-teal bg-white/80 px-4 py-3 text-sm text-ink md:text-base">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal">Приклад</p>
              {block.content}
            </div>
          );
        }
        if (block.type === "tip") {
          return (
            <div key={i} className="rounded-[var(--radius-sm)] bg-amber-soft/80 px-4 py-3 text-sm text-ink">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber">Порада</p>
              {block.content}
            </div>
          );
        }
        if (block.type === "list") {
          return (
            <div key={i}>
              <p className="mb-2 font-medium text-ink">{block.content}</p>
              <ul className="list-disc space-y-1 pl-5 text-forest/85">
                {(block.items ?? []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-forest/90">
            {block.content}
          </p>
        );
      })}
    </div>
  );
}
