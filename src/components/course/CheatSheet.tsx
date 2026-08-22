"use client";

import type { ReactNode } from "react";
import type { CheatSheetData, CheatSheetPeriod } from "@/lib/course/types";

const ERA_TONE: Record<string, string> = {
  paleolithic: "#6b5344",
  mesolithic: "#1d6b66",
  neolithic: "#5a7a32",
  eneolithic: "#c45c28",
  bronze: "#a67c2d",
  iron: "#7a3e3e",
  stone: "#2a2038",
};

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconPen() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 4 4 8.5 12 13l8-4.5L12 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12.5 12 17l8-4.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SectionLabel({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet px-3.5 py-1.5 text-white">
      {icon}
      <span className="text-[13px] font-semibold tracking-wide">{children}</span>
    </div>
  );
}

function PeriodNode({ node }: { node: CheatSheetPeriod }) {
  const tone = node.era ? ERA_TONE[node.era] : "#7c1fa8";
  const kids = node.children ?? [];

  if (kids.length === 0) {
    return (
      <div className="flex overflow-hidden rounded-xl ring-1 ring-line">
        <span
          className="flex min-h-[2.6rem] min-w-[42%] items-center px-3 py-2 text-[13px] font-semibold leading-4 text-white"
          style={{ background: tone }}
        >
          {node.title}
        </span>
        {node.years ? (
          <span className="flex flex-1 items-center justify-end bg-white px-3 py-2 text-right text-[13px] text-forest/70">
            {node.years}
          </span>
        ) : null}
      </div>
    );
  }

  const hasGrandchildren = kids.some((child) => (child.children ?? []).length > 0);

  if (hasGrandchildren) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-mist/40">
        <div className="flex min-h-[9rem]">
          <div
            className="flex w-[5.6rem] shrink-0 items-center justify-center px-2 text-center text-[13px] font-semibold leading-4 text-white sm:w-28 sm:text-sm"
            style={{ background: tone }}
          >
            {node.title}
          </div>
          <div className="min-w-0 flex-1 space-y-2 p-2.5">
            {kids.map((child) => (
              <PeriodBranch key={child.title} node={child} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5">
      <span className="font-semibold text-ink">{node.title}</span>
      {node.years ? <span className="text-sm text-forest/65">{node.years}</span> : null}
    </div>
  );
}

function PeriodBranch({ node }: { node: CheatSheetPeriod }) {
  const tone = node.era ? ERA_TONE[node.era] : "#7c1fa8";
  const kids = node.children ?? [];

  if (kids.length === 0) {
    return (
      <div className="flex items-baseline justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-line">
        <span className="font-semibold" style={{ color: tone }}>
          {node.title}
        </span>
        {node.years ? <span className="shrink-0 text-right text-[13px] text-forest/65">{node.years}</span> : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white ring-1 ring-line">
      <div className="flex">
        <div
          className="flex w-[4.6rem] shrink-0 items-center justify-center px-1.5 py-2 text-center text-[12px] font-semibold leading-4 text-white sm:w-24 sm:text-[13px]"
          style={{ background: tone }}
        >
          {node.title}
        </div>
        <div className="min-w-0 flex-1 divide-y divide-line/80">
          {kids.map((child) => (
            <div key={child.title} className="flex items-baseline justify-between gap-2 px-2.5 py-1.5 text-[13px]">
              <span className="font-medium text-ink">{child.title}</span>
              {child.years ? <span className="shrink-0 text-right text-forest/60">{child.years}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheatSheet({ data }: { data: CheatSheetData }) {
  const brand = data.brand || "SmartZno";
  const terms = data.terms ?? [];

  return (
    <article className="cheat-sheet relative overflow-hidden rounded-[1.4rem] border border-violet/20 bg-white shadow-[var(--shadow-soft)]">
      <div className="pointer-events-none absolute -right-8 top-8 rotate-12 font-[family-name:var(--font-display)] text-6xl font-semibold text-violet/[0.06]">
        {brand}
      </div>

      <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-violet/15 bg-violet px-4 py-3.5 text-white md:px-5">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight md:text-base">
          {brand}
        </p>
        <h2 className="order-last w-full text-center font-[family-name:var(--font-display)] text-lg font-semibold md:order-none md:w-auto md:text-xl">
          {data.title}
        </h2>
        <p className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
          шпаргалка
        </p>
      </header>

      <div className="relative space-y-5 px-4 py-5 md:px-5 md:py-6">
        {data.chronology && data.chronology.length > 0 ? (
          <section>
            <SectionLabel icon={<IconSearch />}>{data.chronologyTitle || "Хронологічний довідник"}</SectionLabel>
            <div className="space-y-2">
              {data.chronology.map((row) => (
                <p
                  key={row}
                  className="rounded-2xl border border-amber/40 bg-amber-soft/70 px-4 py-3 text-sm leading-6 text-ink"
                >
                  <span className="mr-2 inline-block text-violet">▸</span>
                  {row}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {terms.length > 0 ? (
            <section>
              <SectionLabel icon={<IconPen />}>{data.termsTitle || "Терміни"}</SectionLabel>
              <div className="space-y-3">
                {terms.map((item) => (
                  <p key={item.term} className="text-[15px] leading-6 text-forest/85">
                    <span className="mr-1.5 text-violet">▸</span>
                    <strong className="font-semibold text-violet">{item.term}</strong>
                    <span> — {item.def}</span>
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          {data.periods && data.periods.length > 0 ? (
            <section>
              <SectionLabel icon={<IconLayers />}>{data.periodsTitle || "Періодизація історії України"}</SectionLabel>
              <div className="space-y-2">
                {data.periods.map((node) => (
                  <PeriodNode key={node.title} node={node} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <footer className="relative flex items-center justify-between gap-3 border-t border-violet/10 px-4 py-3 text-[11px] text-forest/45 md:px-5">
        <span>
          {brand} · {data.subtitle || "конспект до НМТ з історії України"}
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="cheat-sheet-print-hide rounded-full border border-forest/15 px-3 py-1 font-semibold text-forest/70 hover:border-teal"
        >
          Друкувати
        </button>
      </footer>
    </article>
  );
}
