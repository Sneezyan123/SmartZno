"use client";

import { useState } from "react";

const HOOKS = [
  {
    bait: "НМТ питає: коли була Люблінська унія?",
    twist: "Ні. Він питає, чому після неї українські землі вже не могли жити «як раніше».",
  },
  {
    bait: "НМТ питає: в якому році зруйнували Січ?",
    twist: "Ні. Він питає, що імперія знищувала насправді — військо чи право на власну політику.",
  },
  {
    bait: "НМТ питає: дата Акту Злуки?",
    twist: "Ні. Він питає, чому соборність стала ідеєю сильнішою за два місяці на карті.",
  },
];

export function HistoryHook() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {HOOKS.map((item, i) => {
        const active = open === i;
        return (
          <button
            key={item.bait}
            type="button"
            onClick={() => setOpen(active ? null : i)}
            className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-play/35 hover:bg-white/[0.07]"
          >
            <p className="text-sm tracking-wide text-white/40">кадр {String(i + 1).padStart(2, "0")}</p>
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
