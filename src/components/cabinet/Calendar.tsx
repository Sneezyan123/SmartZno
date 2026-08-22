"use client";

import type { ReactNode } from "react";
import {
  WEEKDAY_SHORT,
  getDay,
  getMonth,
  getYear,
  monthGrid,
  monthTitle,
} from "@/lib/schedule/dates";
import type { DayMark } from "./week";

type CalendarProps = {
  month: string;
  onMonthChange: (month: string) => void;
  selected: string;
  onSelect: (date: string) => void;
  today: string;
  marks: Record<string, DayMark>;
  minISO: string;
  maxISO: string;
  /** Межі тижня, який зараз читає учень — підсвічуємо рядок. */
  weekRange?: { start: string; end: string } | null;
  size?: "sm" | "lg";
  footer?: ReactNode;
};

const EMPTY_MARK: DayMark = { activity: [], planned: [], idle: false };

function shiftMonth(month: string, delta: number): string {
  const y = Number(month.slice(0, 4));
  const m = Number(month.slice(5, 7)) - 1 + delta;
  const date = new Date(Date.UTC(y, m, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Заповнена крапка — день роботи, порожня — те, що заплановано. */
function DayDots({ mark, muted }: { mark: DayMark; muted: boolean }) {
  const activity = mark.activity.slice(0, 3);
  const planned = mark.planned.filter((c) => !mark.activity.includes(c)).slice(0, 3 - activity.length);

  return (
    <span className="mt-1 flex h-1.5 items-center gap-[3px]">
      {activity.map((color, i) => (
        <span
          key={`a-${i}`}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: muted ? "rgba(255,255,255,0.9)" : color }}
        />
      ))}
      {planned.map((color, i) => (
        <span
          key={`p-${i}`}
          className="h-1.5 w-1.5 rounded-full border"
          style={{
            borderColor: muted ? "rgba(255,255,255,0.6)" : color,
            opacity: muted ? 1 : 0.55,
          }}
        />
      ))}
      {activity.length === 0 && planned.length === 0 && mark.idle && (
        <span
          className="h-1 w-1 rounded-full"
          style={{ background: muted ? "rgba(255,255,255,0.45)" : "var(--line)" }}
        />
      )}
    </span>
  );
}

export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  today,
  marks,
  minISO,
  maxISO,
  weekRange = null,
  size = "sm",
  footer,
}: CalendarProps) {
  const year = Number(month.slice(0, 4));
  const month1 = Number(month.slice(5, 7));
  const days = monthGrid(year, month1);

  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const canPrev = `${prev}-31` >= minISO.slice(0, 7) + "-01";
  const canNext = `${next}-01` <= maxISO;

  const cell = size === "lg" ? "h-14 text-sm" : "h-10 text-[13px]";

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => canPrev && onMonthChange(prev)}
          disabled={!canPrev}
          aria-label="Попередній місяць"
          className="flex h-8 w-8 items-center justify-center rounded-full text-forest/50 transition hover:bg-mist hover:text-forest disabled:pointer-events-none disabled:opacity-30"
        >
          ‹
        </button>
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-ink capitalize">
          {monthTitle(year, month1)}
        </p>
        <button
          type="button"
          onClick={() => canNext && onMonthChange(next)}
          disabled={!canNext}
          aria-label="Наступний місяць"
          className="flex h-8 w-8 items-center justify-center rounded-full text-forest/50 transition hover:bg-mist hover:text-forest disabled:pointer-events-none disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAY_SHORT.map((d) => (
          <span key={d} className="py-1 text-center text-[11px] font-semibold text-forest/35">
            {d}
          </span>
        ))}

        {days.map((iso) => {
          const outside = getMonth(iso) !== month1 || getYear(iso) !== year;
          const inYear = iso >= minISO && iso <= maxISO;
          const isToday = iso === today;
          const isSelected = iso === selected;
          const inWeek = weekRange ? iso >= weekRange.start && iso <= weekRange.end : false;
          const mark = marks[iso] ?? EMPTY_MARK;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              aria-current={isToday ? "date" : undefined}
              aria-label={iso}
              className={`relative flex flex-col items-center justify-center rounded-lg transition ${cell} ${
                isSelected
                  ? "bg-forest font-bold text-white"
                  : isToday
                    ? "bg-mist font-bold text-teal"
                    : inWeek && !outside
                      ? "bg-mist/55 font-medium text-forest/80 hover:bg-mist"
                      : outside || !inYear
                        ? "text-forest/25 hover:bg-mist/60"
                        : "font-medium text-forest/80 hover:bg-mist"
              }`}
            >
              <span className="leading-none">{getDay(iso)}</span>
              <DayDots mark={mark} muted={isSelected} />
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-forest/45">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-forest/70" />
          працював
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full border border-forest/45" />
          за планом
        </span>
      </div>

      {footer}
    </div>
  );
}
