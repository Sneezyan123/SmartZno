"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  OptionKey,
  TheoryBlock,
  TheoryFigure,
  TheoryFlip,
  TheoryPeriod,
  TheoryPin,
  TheoryStep,
  TheoryTile,
} from "@/lib/course/types";
import { CheatSheet } from "@/components/course/CheatSheet";

type Variant = "default" | "story" | "notes";
type BlockItem = { block: TheoryBlock; index: number };
type Chapter = {
  title: string;
  label: string;
  era?: string;
  image?: string;
  atmosphere?: string;
  items: BlockItem[];
};

const ERA: Record<string, { bar: string; bg: string; ink: string; pattern: string }> = {
  paleolithic: { bar: "#6b5344", bg: "#f3ebe2", ink: "#3d2e24", pattern: "stone" },
  mesolithic: { bar: "#1d6b66", bg: "#e4f2f0", ink: "#134845", pattern: "wave" },
  neolithic: { bar: "#5a7a32", bg: "#eef4dc", ink: "#2f4218", pattern: "grain" },
  eneolithic: { bar: "#c45c28", bg: "#faece4", ink: "#6a2e12", pattern: "copper" },
  bronze: { bar: "#a67c2d", bg: "#f6edd8", ink: "#5c4414", pattern: "bronze" },
  iron: { bar: "#7a3e3e", bg: "#f6eaea", ink: "#4a2020", pattern: "iron" },
  scythian: { bar: "#c4a035", bg: "#fbf6e0", ink: "#5c4a12", pattern: "gold" },
  greek: { bar: "#2a6a8f", bg: "#e6f2f8", ink: "#163c52", pattern: "sea" },
  sarmatian: { bar: "#8b5a6b", bg: "#f6eaee", ink: "#4a2432", pattern: "horse" },
  slavic: { bar: "#3f6b4a", bg: "#e8f1ea", ink: "#1f3d28", pattern: "leaf" },
  rus: { bar: "#6b3a4a", bg: "#f4e8ec", ink: "#3a1c28", pattern: "leaf" },
  byzantine: { bar: "#8a6a2d", bg: "#f7f0dc", ink: "#4a3a12", pattern: "gold" },
  princely: { bar: "#3a4a6b", bg: "#e8ecf4", ink: "#1c243a", pattern: "sea" },
  fragmentation: { bar: "#5a4a3a", bg: "#f0ebe4", ink: "#2e2418", pattern: "stone" },
  galicia: { bar: "#7a4a28", bg: "#f6ede8", ink: "#3d2410", pattern: "bronze" },
  mongol: { bar: "#5a3030", bg: "#f3e6e6", ink: "#321818", pattern: "iron" },
  culture: { bar: "#4a5a7a", bg: "#eaeef5", ink: "#1e2838", pattern: "gold" },
};

function EraMotif({ kind }: { kind: string }) {
  const common = { fill: "currentColor", opacity: 0.28 };
  if (kind === "wave") {
    return (
      <svg viewBox="0 0 80 24" className="h-6 w-20" aria-hidden>
        <path d="M0 14c8 0 8-8 16-8s8 8 16 8 8-8 16-8 8 8 16 8 8-8 16-8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
      </svg>
    );
  }
  if (kind === "grain") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <circle cx="8" cy="12" r="3" {...common} />
        <circle cx="20" cy="8" r="3" {...common} />
        <circle cx="32" cy="14" r="3" {...common} />
        <circle cx="44" cy="10" r="3" {...common} />
      </svg>
    );
  }
  if (kind === "iron") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <path d="M8 18h10l8-12H16z" {...common} />
        <rect x="30" y="6" width="3" height="14" rx="1" {...common} />
        <path d="M26 8h12v3H26z" {...common} />
      </svg>
    );
  }
  if (kind === "gold") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <path d="M24 4l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" {...common} />
      </svg>
    );
  }
  if (kind === "sea") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <path d="M6 16l10-8 8 4 10-6v12H6z" {...common} />
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <path d="M8 16c8-12 24-12 32 0-8 2-16 2-24 0 4-4 12-4 18-2" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.4" />
      </svg>
    );
  }
  if (kind === "horse") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <path d="M8 16c2-6 8-8 12-4 2-4 8-6 12-2 2 1 6 1 8 4H8z" {...common} />
      </svg>
    );
  }
  if (kind === "copper") {
    return (
      <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
        <circle cx="16" cy="12" r="6" {...common} />
        <circle cx="32" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.28" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 24" className="h-6 w-12" aria-hidden>
      <rect x="4" y="8" width="10" height="10" rx="1" {...common} />
      <rect x="20" y="4" width="10" height="10" rx="1" {...common} />
      <rect x="36" y="10" width="10" height="10" rx="1" {...common} />
    </svg>
  );
}

function tabLabel(heading: TheoryBlock) {
  if (heading.kicker) return heading.kicker;
  return heading.content.split(/[.,]/)[0]?.trim() || heading.content;
}

function isDocumentVisual(src?: string, label?: string) {
  const path = (src || "").toLowerCase();
  const tag = (label || "").toLowerCase();
  return (
    path.includes("/map-") ||
    path.includes("map-") ||
    path.includes("chronicle-") ||
    path.includes("atlas") ||
    path.includes("seal") ||
    path.includes("desyatynna-ruins") ||
    tag.includes("карт") ||
    tag.includes("схем") ||
    tag.includes("атлас") ||
    tag.includes("печатк")
  );
}

function isHeroPhoto(src?: string, label?: string) {
  return Boolean(src && !isDocumentVisual(src, label));
}

function splitChapters(blocks: TheoryBlock[]): Chapter[] {
  const chapters: Chapter[] = [];
  let current: Chapter | null = null;
  const leading: BlockItem[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "heading") {
      if (current) chapters.push(current);
      const heroPhoto = isHeroPhoto(block.image, block.kicker);
      current = {
        title: block.content,
        label: tabLabel(block),
        era: block.era,
        image: heroPhoto ? block.image : undefined,
        atmosphere: heroPhoto ? block.caption : undefined,
        items: [...leading, { block, index: i }],
      };
      leading.length = 0;
    } else if (!current) {
      leading.push({ block, index: i });
    } else {
      current.items.push({ block, index: i });
    }
  }
  if (current) chapters.push(current);
  else if (leading.length) {
    chapters.push({ title: "Вступ", label: "Вступ", items: leading });
  }
  return chapters;
}

/** Remove chapter title from body; keep maps/documents as artifacts under the hero. */
function chapterBodyItems(items: BlockItem[]): BlockItem[] {
  const headingAt = items.findIndex((item) => item.block.type === "heading");
  if (headingAt < 0) return items;
  const heading = items[headingAt].block;
  const rest = items.filter((_, i) => i !== headingAt);
  if (heading.image && isDocumentVisual(heading.image, heading.kicker)) {
    const mapArtifact: TheoryBlock = {
      type: "artifact",
      kicker: "Карта",
      content: heading.content,
      caption: heading.caption,
      image: heading.image,
      credit: heading.credit,
      era: heading.era,
    };
    return [{ block: mapArtifact, index: items[headingAt].index }, ...rest];
  }
  return rest;
}

function ChapterHero({ chapter }: { chapter: Chapter }) {
  const theme = chapter.era ? ERA[chapter.era] : { bar: "#2a2038", bg: "#1a1224", ink: "#fff" };
  const documentVisual = Boolean(chapter.image && isDocumentVisual(chapter.image, chapter.label));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  if (documentVisual && chapter.image) {
    return (
      <>
        <figure className="overflow-hidden rounded-[1.35rem] border border-line bg-white shadow-[0_22px_50px_rgba(8,6,16,0.16)]">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="group relative block w-full cursor-zoom-in bg-[#f4efe6] p-2 text-left md:p-3"
            aria-label="Відкрити карту на весь екран"
          >
            <SafeImage
              src={chapter.image}
              alt={chapter.title}
              className="chapter-hero-still mx-auto block h-auto max-h-[70vh] w-full object-contain"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 opacity-90 transition group-hover:bg-black/70">
              Натисни, щоб збільшити
            </span>
          </button>
          <figcaption className="space-y-2 border-t border-line px-5 py-4 md:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">{chapter.label}</p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-ink md:text-3xl">
              {chapter.title}
            </h2>
            {chapter.atmosphere ? (
              <p className="max-w-3xl text-sm leading-6 text-forest/75 md:text-base md:leading-7">{chapter.atmosphere}</p>
            ) : null}
          </figcaption>
        </figure>
        {expanded ? (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={chapter.title}
            onClick={() => setExpanded(false)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              onClick={() => setExpanded(false)}
            >
              Закрити
            </button>
            <img
              src={chapter.image}
              alt={chapter.title}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : null}
      </>
    );
  }

  return (
    <figure className="relative isolate -mx-1 overflow-hidden rounded-[1.35rem] shadow-[0_28px_70px_rgba(8,6,16,0.34)] md:-mx-2">
      <div className="relative aspect-[16/10] min-h-[260px] md:min-h-[360px]">
        {chapter.image ? (
          <SafeImage
            src={chapter.image}
            alt={chapter.title}
            className="chapter-hero-still absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.bar} 0%, #120c18 70%)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.4)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${theme.bar}, #f5c518, transparent)` }}
        />
        <figcaption className="chapter-hero-copy relative flex h-full min-h-[260px] flex-col justify-end px-5 py-6 md:min-h-[360px] md:px-9 md:py-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber">
            {chapter.label}
          </p>
          <h2 className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.02] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] md:text-5xl">
            {chapter.title}
          </h2>
          {chapter.atmosphere ? (
            <p className="mt-3 max-w-xl text-base leading-7 text-white/88 md:text-lg">{chapter.atmosphere}</p>
          ) : null}
        </figcaption>
      </div>
    </figure>
  );
}

function EraFrame({
  era,
  children,
  notes,
}: {
  era?: string;
  children: ReactNode;
  notes?: boolean;
}) {
  const theme = era ? ERA[era] : null;
  if (!theme || notes) {
    return <div className="space-y-5">{children}</div>;
  }
  return (
    <section
      className="space-y-5 overflow-hidden rounded-[var(--radius)] border px-4 py-5 md:px-6 md:py-6"
      style={{
        background: theme.bg,
        borderColor: `${theme.bar}44`,
        color: theme.ink,
      }}
    >
      <div className="flex items-center justify-between" style={{ color: theme.bar }}>
        <div className="h-1.5 w-16 rounded-full" style={{ background: theme.bar }} />
        <EraMotif kind={theme.pattern} />
      </div>
      {children}
    </section>
  );
}

function BlockGroups({ items, variant }: { items: BlockItem[]; variant: Variant }) {
  const notes = variant === "notes";
  const story = variant === "story";
  const groups: { era?: string; items: BlockItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (!last || last.era !== item.block.era) {
      groups.push({ era: item.block.era, items: [item] });
    } else {
      last.items.push(item);
    }
  }
  return (
    <>
      {groups.map((group, gi) => (
        <EraFrame key={gi} era={story ? undefined : group.era} notes={notes || story}>
          <div className={story ? "chapter-body space-y-5" : "space-y-5"}>
            {group.items.map(({ block, index }) => (
              <Block key={index} block={block} index={index} variant={variant} />
            ))}
          </div>
        </EraFrame>
      ))}
    </>
  );
}

function StoryChapters({ blocks }: { blocks: TheoryBlock[] }) {
  const chapters = useMemo(() => splitChapters(blocks), [blocks]);
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(true);
  const chapter = chapters[active];
  const theme = chapter?.era ? ERA[chapter.era] : null;

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  if (!chapter) return null;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-1 bg-paper/90 px-1 py-2 backdrop-blur">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest/45">
            Розділ {active + 1} з {chapters.length}
          </p>
          <p className="truncate text-xs text-forest/50">{chapter.title}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Розділи уроку" role="tablist">
          {chapters.map((ch, i) => {
            const on = i === active;
            const color = ch.era ? ERA[ch.era]?.bar : undefined;
            return (
              <button
                key={`${ch.label}-${i}`}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={(e) => {
                  setActive(i);
                  e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
                }}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  on ? "text-white shadow-[var(--shadow-soft)]" : "border-line bg-white text-forest/75 hover:border-teal/40"
                }`}
                style={
                  on
                    ? { background: color || "#2a2038", borderColor: color || "#2a2038" }
                    : undefined
                }
              >
                {ch.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div ref={panelRef} key={active} className="animate-fade-up scroll-mt-28 space-y-5">
        <ChapterHero chapter={chapter} />
        <BlockGroups items={chapterBodyItems(chapter.items)} variant="story" />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => setActive((n) => Math.max(0, n - 1))}
          disabled={active === 0}
          className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest disabled:opacity-30"
        >
          ← Назад
        </button>
        {active < chapters.length - 1 ? (
          <button
            type="button"
            onClick={() => setActive((n) => n + 1)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: theme?.bar || "#2a2038" }}
          >
            Далі: {chapters[active + 1].label} →
          </button>
        ) : (
          <p className="text-sm text-forest/50">Кінець лекції</p>
        )}
      </div>
    </div>
  );
}

export function TheoryBlocks({
  blocks,
  variant = "default",
}: {
  blocks: TheoryBlock[];
  variant?: Variant;
}) {
  const story = variant === "story";
  const notes = variant === "notes";
  const headingCount = blocks.filter((block) => block.type === "heading").length;

  if (story && headingCount > 3) {
    return <StoryChapters blocks={blocks} />;
  }

  return (
    <div className={story ? "space-y-8" : notes ? "space-y-5" : "space-y-5"}>
      <BlockGroups items={blocks.map((block, index) => ({ block, index }))} variant={variant} />
    </div>
  );
}

function Block({
  block,
  index,
  variant,
}: {
  block: TheoryBlock;
  index: number;
  variant: Variant;
}) {
  const story = variant === "story";
  const notes = variant === "notes";
  const body = notes
    ? "whitespace-pre-wrap text-base leading-7 text-forest/85"
    : story
      ? "whitespace-pre-wrap text-[1.125rem] leading-8 text-forest/90 md:text-[1.2rem] md:leading-9"
      : "whitespace-pre-wrap text-[1.0625rem] leading-8 text-forest/90 md:text-[1.125rem] md:leading-[1.85]";

  if (block.type === "heading") {
    return (
      <h2
        id={`s-${index}`}
        className={`scroll-mt-24 font-[family-name:var(--font-display)] font-semibold text-ink ${
          story ? "pt-3 text-2xl md:text-3xl" : notes ? "text-xl" : "pt-2 text-2xl md:text-[1.75rem]"
        }`}
      >
        {block.content}
      </h2>
    );
  }

  if (block.type === "formula") {
    return (
      <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-line bg-white px-4 py-3.5 font-mono text-[1rem] text-ink md:text-[1.0625rem]">
        {block.content}
      </div>
    );
  }

  if (block.type === "example") {
    return (
      <div className="border-l-[3px] border-violet/50 bg-white px-4 py-3.5 text-ink md:px-5">
        <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide text-forest/45">Розбір</p>
        <p className="whitespace-pre-wrap text-[1.0625rem] font-medium leading-7 md:text-[1.125rem]">
          {block.content}
        </p>
        {block.items && block.items.length > 0 && (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[1.0625rem] leading-7 text-forest/85 md:text-[1.125rem] md:leading-8">
            {block.items.map((item, j) => (
              <li key={j} className="whitespace-pre-wrap">
                {item}
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  if (block.type === "tip") {
    return (
      <div className="rounded-[var(--radius-sm)] border border-amber/35 bg-amber-soft/70 px-4 py-4 text-ink md:px-5">
        <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide text-forest/50">Порада</p>
        <p className={story ? "text-base leading-7" : "text-[1.0625rem] leading-7 md:text-[1.125rem] md:leading-8"}>
          {block.content}
        </p>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div>
        {block.content ? (
          <p className={`mb-3 font-medium text-ink ${story ? "text-lg" : notes ? "" : "text-[1.125rem]"}`}>
            {block.content}
          </p>
        ) : null}
        <ul
          className={`list-disc space-y-1.5 pl-5 text-forest/85 ${
            story
              ? "text-[1.05rem] leading-7"
              : notes
                ? ""
                : "space-y-2 text-[1.0625rem] leading-7 md:text-[1.125rem] md:leading-8"
          }`}
        >
          {(block.items ?? []).map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === "scene") {
    const mapScene = isDocumentVisual(block.image, block.kicker);
    if (mapScene && block.image) {
      return (
        <figure className="overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-[0_22px_50px_rgba(8,6,16,0.16)]">
          <div className="bg-[#f4efe6] p-2 md:p-3">
            <SafeImage
              src={block.image}
              alt={block.kicker || "Карта"}
              className="mx-auto block h-auto max-h-[70vh] w-full object-contain"
            />
          </div>
          <figcaption className="space-y-2 border-t border-line px-5 py-4 md:px-6">
            {block.kicker ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">{block.kicker}</p>
            ) : null}
            <p className="text-base leading-7 text-forest/85 md:text-lg md:leading-8">{block.content}</p>
          </figcaption>
        </figure>
      );
    }
    if (!story && !block.image) {
      return (
        <div className="rounded-[var(--radius)] border border-line border-l-[3px] border-l-violet bg-white px-5 py-6 md:px-7">
          {block.kicker ? (
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-violet">{block.kicker}</p>
          ) : null}
          <p className="mt-2.5 text-[1.125rem] leading-8 text-ink md:text-[1.25rem] md:leading-9">{block.content}</p>
        </div>
      );
    }
    return (
      <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#120c18] text-white shadow-[0_22px_50px_rgba(8,6,16,0.25)]">
        {block.image ? (
          <div className="absolute inset-0">
            <SafeImage src={block.image} alt="" className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#120c18] via-[#120c18]/88 to-[#120c18]/55" />
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(192,38,211,0.22),transparent_46%)]" />
        )}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber via-teal to-violet" />
        <div className="relative px-5 py-7 md:px-7 md:py-9">
          {block.kicker ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber">{block.kicker}</p>
          ) : null}
          <p className="mt-3 max-w-2xl text-[1.15rem] leading-8 text-white/90 md:text-[1.3rem] md:leading-9">{block.content}</p>
        </div>
      </div>
    );
  }

  if (block.type === "story") {
    return <p className={body}>{block.content}</p>;
  }

  if (block.type === "portrait" && block.figure) {
    return (<PortraitCard figure={block.figure} />);
  }

  if (block.type === "people" && block.figures) {
    return (
      <div>
        {block.content ? (
          <p className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
            {block.content}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          {block.figures.map((figure) => (
            <PortraitCard key={figure.name} figure={figure} compact />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "artifact") {
    return <ArtifactBlock block={block} />;
  }

  if (block.type === "timeline" && block.periods) {
    return (<Timeline title={block.content} periods={block.periods} />);
  }

  if (block.type === "checkpoint" && block.checkpoint) {
    return (<Checkpoint prompt={block.content} data={block.checkpoint} />);
  }

  if (block.type === "compare" && block.columns) {
    return (
      <div>
        {block.content ? <p className="mb-3 text-[1.125rem] font-medium text-ink">{block.content}</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {block.columns.map((col) => (
            <div key={col.title} className="rounded-[var(--radius-sm)] border border-line bg-white p-4 md:p-5">
              <p className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-ink">
                {col.title}
              </p>
              <ul className="mt-2.5 list-disc space-y-2 pl-5 text-[1.0625rem] leading-7 text-forest/80">
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "reveal") {
    return (<Reveal title={block.content} items={block.items ?? []} />);
  }

  if (block.type === "flip-cards" && block.flips) {
    return <FlipCards title={block.content} cards={block.flips} hint={block.kicker} dark={story} />;
  }

  if (block.type === "tiles" && block.tiles) {
    return <Tiles title={block.content} tiles={block.tiles} hint={block.kicker} />;
  }

  if (block.type === "pins" && block.pins) {
    return (<Pins title={block.content} pins={block.pins} hint={block.kicker} />);
  }

  if (block.type === "steps" && block.steps) {
    return (<Steps title={block.content} steps={block.steps} hint={block.kicker} />);
  }

  if (block.type === "cheatsheet" && block.sheet) {
    return <CheatSheet data={block.sheet} />;
  }

  return <p className={body}>{block.content}</p>;
}

function ArtifactBlock({ block }: { block: TheoryBlock }) {
  const [expanded, setExpanded] = useState(false);
  const isWideVisual =
    isDocumentVisual(block.image, block.kicker || block.content) ||
    (block.kicker || "").toLowerCase().includes("ілюстрац") ||
    (block.kicker || "").toLowerCase().includes("артефакт");

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  return (
    <>
      <figure className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#141018] shadow-[0_22px_50px_rgba(8,6,16,0.28)]">
        {block.image ? (
          isWideVisual ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group relative block w-full cursor-zoom-in bg-[#f4efe6] p-0 text-left"
              aria-label="Відкрити зображення на весь екран"
            >
              <SafeImage
                src={block.image}
                alt={block.caption || block.content}
                className="block h-auto w-full"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 opacity-90 transition group-hover:bg-black/70">
                Натисни, щоб збільшити
              </span>
            </button>
          ) : (
            <div className="relative bg-[#1a1612]">
              <SafeImage
                src={block.image}
                alt={block.caption || block.content}
                className="mx-auto max-h-[460px] w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141018] to-transparent" />
            </div>
          )
        ) : null}
        <figcaption className="space-y-1 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">{block.kicker || "Артефакт"}</p>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">{block.content}</p>
          {block.caption ? <p className="text-sm leading-6 text-white/75">{block.caption}</p> : null}
          {block.credit ? <p className="text-[11px] text-white/40">{block.credit}</p> : null}
        </figcaption>
      </figure>

      {expanded && block.image ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={block.content}
          onClick={() => setExpanded(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
            onClick={() => setExpanded(false)}
          >
            Закрити
          </button>
          <img
            src={block.image}
            alt={block.caption || block.content}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className="flex min-h-40 items-center justify-center bg-[#efe6d6] px-4 py-8 text-center">
        <p className="text-sm leading-6 text-forest/45">{alt}</p>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setOk(false)} />;
}

function PortraitCard({ figure, compact }: { figure: TheoryFigure; compact?: boolean }) {
  return (
    <article className="grid overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#1a1612] shadow-[0_22px_50px_rgba(8,6,16,0.28)] md:grid-cols-[minmax(200px,280px)_1fr]">
      {figure.image ? (
        <div className="flex items-center justify-center bg-[#100e0c] p-4">
          <SafeImage
            src={figure.image}
            alt={figure.name}
            className={`w-full object-contain ${compact ? "max-h-64" : "max-h-[420px]"}`}
          />
        </div>
      ) : null}
      <div className="space-y-2 bg-[#f7f1e6] p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a5a28]">Постать</p>
        <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">{figure.name}</p>
        {figure.years ? <p className="text-xs font-medium uppercase tracking-wide text-[#8a5a28]">{figure.years}</p> : null}
        <p className="text-base text-forest/85">{figure.role}</p>
        <p className="text-base leading-7 text-forest/75">{figure.why}</p>
        {figure.credit ? <p className="pt-1 text-[11px] text-forest/40">{figure.credit}</p> : null}
      </div>
    </article>
  );
}

function Timeline({ title, periods }: { title: string; periods: TheoryPeriod[] }) {
  const [open, setOpen] = useState(0);
  const current = periods[open];
  const theme = current?.era ? ERA[current.era] : ERA.paleolithic;
  return (
    <div>
      {title ? <p className="mb-3 text-lg font-medium text-ink">{title}</p> : null}
      <p className="mb-3 text-sm text-forest/55">Натисни період — текст з’явиться нижче.</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {periods.map((period, i) => {
          const color = period.era ? ERA[period.era]?.bar : theme.bar;
          const on = i === open;
          return (
            <button
              key={period.title}
              type="button"
              onClick={() => setOpen(i)}
              className="shrink-0 rounded-full border px-3 py-1.5 text-left text-sm font-semibold transition"
              style={
                on
                  ? { background: color, borderColor: color, color: "#fff" }
                  : { borderColor: `${color}66`, color }
              }
            >
              {i + 1}. {period.title}
            </button>
          );
        })}
      </div>
      {current ? (
        <article
          className="rounded-[var(--radius)] border p-5"
          style={{ background: theme.bg, borderColor: `${theme.bar}55` }}
        >
          <div className="mb-3 flex items-center justify-between" style={{ color: theme.bar }}>
            <div className="h-1.5 w-12 rounded-full" style={{ background: theme.bar }} />
            <EraMotif kind={theme.pattern} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.bar }}>
            {current.tag ?? "Період"}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-ink">
            {current.title}
          </p>
          <p className="mt-1 text-sm font-medium" style={{ color: theme.ink }}>
            {current.years}
          </p>
          <p className="mt-3 text-[1.05rem] leading-7 text-forest/80">{current.text}</p>
        </article>
      ) : null}
    </div>
  );
}

function FlipHint({ dark }: { dark: boolean }) {
  return (
    <span
      className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${
        dark ? "text-[#7ed0ff]" : "text-violet"
      }`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path
          d="M3 5.5A4.5 4.5 0 0 1 12.2 4M13 10.5A4.5 4.5 0 0 1 3.8 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M12.2 4V1.8M12.2 4h2.2M3.8 12v2.2M3.8 12H1.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Перегорнути
    </span>
  );
}

function FlipFace({
  card,
  index,
  side,
  dark,
}: {
  card: TheoryFlip;
  index: number;
  side: "front" | "back";
  dark: boolean;
}) {
  const isBack = side === "back";
  if (dark) {
    return (
      <div
        className={`flip-face ${isBack ? "flip-face-back" : ""} flex flex-col rounded-[1.25rem] border border-white/10 bg-[#0b1524] p-4 shadow-[0_18px_40px_rgba(8,16,28,0.45)]`}
      >
        <span className="inline-flex w-fit rounded-md bg-[#4db8ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Картка №{index + 1}
        </span>
        <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold uppercase leading-tight text-[#7ed0ff]">
          {card.front}
        </p>
        <div className="my-2.5 h-px w-full bg-white/35" />
        <p className="flex-1 text-sm leading-6 text-white/90">
          {isBack ? card.back : card.teaser || "Натисни, щоб побачити пояснення."}
        </p>
        <FlipHint dark />
      </div>
    );
  }
  return (
    <div
      className={`flip-face ${isBack ? "flip-face-back" : ""} flex flex-col rounded-[var(--radius)] border border-line bg-white p-4 shadow-[var(--shadow-soft)] md:p-5`}
    >
      <p className="font-[family-name:var(--font-display)] text-[1.25rem] font-semibold leading-tight text-ink">
        {card.front}
      </p>
      <div className="my-3 h-px w-full bg-line" />
      <p className="flex-1 text-[1.0625rem] leading-7 text-forest/85">
        {isBack ? card.back : card.teaser || "Натисни, щоб побачити пояснення."}
      </p>
      <FlipHint dark={false} />
    </div>
  );
}

function FlipCards({
  title,
  cards,
  hint,
  dark,
}: {
  title: string;
  cards: TheoryFlip[];
  hint?: string;
  dark: boolean;
}) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <div>
      {title ? <p className="mb-2 text-[1.125rem] font-medium text-ink">{title}</p> : null}
      <p className="mb-4 text-[0.9375rem] text-forest/55">{hint || "Натисни картку, щоб перегорнути."}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card, i) => (
          <button
            key={card.front}
            type="button"
            onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
            className="flip-scene text-left"
            aria-label={`Картка: ${card.front}. Перегорнути`}
          >
            <div className={`flip-scene-inner ${flipped[i] ? "is-flipped" : ""}`}>
              <FlipFace card={card} index={i} side="front" dark={dark} />
              <FlipFace card={card} index={i} side="back" dark={dark} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Tiles({ title, tiles, hint }: { title: string; tiles: TheoryTile[]; hint?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {title ? <p className="mb-2 text-[1.125rem] font-medium text-ink">{title}</p> : null}
      <p className="mb-3 text-[0.9375rem] text-forest/55">
        {hint || "Відкривай плитки — текст з’являється всередині."}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {tiles.map((tile, i) => {
          const on = open === i;
          return (
            <button
              key={tile.title}
              type="button"
              onClick={() => setOpen(on ? null : i)}
              className={`rounded-[var(--radius-sm)] border px-4 py-3.5 text-left transition ${
                on
                  ? "border-violet/40 bg-white shadow-[var(--shadow-soft)]"
                  : "border-line bg-white/70 hover:border-violet/30"
              }`}
            >
              <p className="text-[1.0625rem] font-semibold text-ink">{tile.title}</p>
              {on ? (
                <p className="mt-2 text-[1.0625rem] leading-7 text-forest/80">{tile.text}</p>
              ) : (
                <p className="mt-1 text-sm text-violet">відкрити</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Pins({ title, pins, hint }: { title: string; pins: TheoryPin[]; hint?: string }) {
  const [open, setOpen] = useState(0);
  const current = pins[open];
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-white">
      <div className="relative bg-gradient-to-b from-[#d7e8ef] to-white px-4 pb-3 pt-4 md:px-5">
        <svg viewBox="0 0 320 36" className="absolute inset-x-0 top-2 h-8 w-full text-[#2a6a8f]" aria-hidden>
          <path d="M0 22c28-10 48 8 76 0s44-12 72 0 48 10 76 0 48-12 96 2" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        </svg>
        {title ? <p className="relative text-lg font-medium text-ink">{title}</p> : null}
        <p className="relative mt-1 text-sm text-forest/55">{hint || "Натисни точку, щоб відкрити."}</p>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {pins.map((pin, i) => (
            <button
              key={pin.title}
              type="button"
              onClick={() => setOpen(i)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                open === i ? "bg-forest text-white" : "border border-forest/20 bg-white/80 text-forest hover:border-teal"
              }`}
            >
              {i + 1}. {pin.title}
            </button>
          ))}
        </div>
      </div>
      {current ? (
        <div className="border-t border-line px-4 py-4 md:px-5">
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">{current.title}</p>
          {current.subtitle ? <p className="mt-1 text-sm font-medium text-teal">{current.subtitle}</p> : null}
          <p className="mt-2 text-[1.05rem] leading-7 text-forest/85">{current.text}</p>
        </div>
      ) : null}
    </div>
  );
}

function Steps({ title, steps, hint }: { title: string; steps: TheoryStep[]; hint?: string }) {
  const [i, setI] = useState(0);
  const step = steps[i];
  return (
    <div className="rounded-[var(--radius)] border border-line bg-white p-4 md:p-5">
      {title ? <p className="mb-1 text-[1.125rem] font-medium text-ink">{title}</p> : null}
      <p className="mb-4 text-[0.9375rem] text-forest/55">
        {hint || `Крок ${i + 1} з ${steps.length}`}
        {hint ? ` · ${i + 1} / ${steps.length}` : ""}
      </p>
      <div className="mb-4 flex gap-1">
        {steps.map((_, n) => (
          <button
            key={n}
            type="button"
            aria-label={`Крок ${n + 1}`}
            onClick={() => setI(n)}
            className={`h-1.5 flex-1 rounded-full transition ${n === i ? "bg-forest" : n < i ? "bg-teal/50" : "bg-line"}`}
          />
        ))}
      </div>
      {step ? (
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">{step.title}</p>
          <p className="mt-2 text-[1.0625rem] leading-8 text-forest/85 md:text-[1.125rem]">{step.content}</p>
          {step.image ? (
            <SafeImage src={step.image} alt={step.caption || step.title} className="mt-4 max-h-64 w-full object-contain" />
          ) : null}
        </div>
      ) : null}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest disabled:opacity-30"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}
          disabled={i === steps.length - 1}
          className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
        >
          Далі
        </button>
      </div>
    </div>
  );
}

function Checkpoint({ prompt, data }: { prompt: string; data: NonNullable<TheoryBlock["checkpoint"]> }) {
  const [picked, setPicked] = useState<OptionKey | null>(null);
  const [checked, setChecked] = useState(false);
  const ok = checked && picked === data.answer;
  return (
    <div className="rounded-[var(--radius)] border border-line bg-mist/40 p-5">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-forest/50">Перевір себе</p>
      <p className="mt-2 text-[1.1875rem] font-medium leading-8 text-ink">{data.prompt || prompt}</p>
      <div className="mt-4 space-y-2">
        {data.options.map((opt) => {
          const selected = picked === opt.key;
          const reveal = checked && opt.key === data.answer;
          const wrong = checked && selected && opt.key !== data.answer;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                setPicked(opt.key);
                setChecked(false);
              }}
              className={`flex w-full items-start gap-3 rounded-[var(--radius-sm)] border px-3.5 py-3 text-left text-[1.0625rem] leading-7 transition ${
                reveal
                  ? "border-[#3f9142] bg-white text-forest"
                  : wrong
                    ? "border-amber bg-amber-soft/70"
                    : selected
                      ? "border-violet/50 bg-white"
                      : "border-line bg-white hover:border-violet/30"
              }`}
            >
              <strong className="mt-0.5">{opt.key}.</strong>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => picked && setChecked(true)}
        className="mt-4 rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
        disabled={!picked}
      >
        Перевірити
      </button>
      {checked && (
        <p className={`mt-3 text-[1.0625rem] leading-7 ${ok ? "text-forest" : "text-ink"}`}>
          <strong className="font-semibold">{ok ? "Правильно." : "Не цей варіант."}</strong> {data.explanation}
        </p>
      )}
    </div>
  );
}

function Reveal({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[var(--radius-sm)] border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-[1.0625rem] font-medium text-ink">{title}</span>
        <span className="shrink-0 text-[0.9375rem] text-violet">{open ? "сховати" : "відкрити"}</span>
      </button>
      {open && (
        <ul className="list-disc space-y-2 border-t border-line px-4 py-3.5 pl-8 text-[1.0625rem] leading-7 text-forest/85">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
