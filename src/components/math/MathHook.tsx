"use client";

import { useState } from "react";

const TRAPS = [
  {
    bait: "√(x²) = x. Записав і пішов далі.",
    twist: "НМТ вже забрав бал. Модуль. Завжди модуль — поки не доведеш, що x ≥ 0.",
  },
  {
    bait: "Скоротив (x − 2) у чисельнику й знаменнику. Гарно.",
    twist: "А корінь x = 2 вилетів з ОДЗ. Тест ловить саме це, не арифметику.",
  },
  {
    bait: "Графік параболи — і ти вже ставиш вершину «на око».",
    twist: "НМТ питає зсув і знак. Одна плутанина з −(x − 3)² — і відповідь сусідня.",
  },
];

export function MathHook() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {TRAPS.map((item, i) => {
        const active = open === i;
        return (
          <button
            key={item.bait}
            type="button"
            onClick={() => setOpen(active ? null : i)}
            className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-play/35 hover:bg-white/[0.07]"
          >
            <p className="text-sm tracking-wide text-white/40">пастка {String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-white">
              {item.bait}
            </p>
            <p
              className={`mt-2 text-sm leading-relaxed text-play/90 transition-all ${
                active ? "max-h-40 opacity-100" : "max-h-0 overflow-hidden opacity-0"
              }`}
            >
              {item.twist}
            </p>
          </button>
        );
      })}
    </div>
  );
}
