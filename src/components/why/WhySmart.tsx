"use client";

import { useState, type ReactNode } from "react";
import { useInView, usePrefersReducedMotion, useStepper } from "./motion";

type Step = {
  point: [number, number];
  reveal: number;
  title: string;
  text: string;
};

const chaosSteps: Step[] = [
  {
    point: [40, 250],
    reveal: 100,
    title: "«З понеділка починаю»",
    text: "Знайдено канал з розборами, куплено новий зошит, складено список тем. Мотивація на максимумі.",
  },
  {
    point: [165, 72],
    reveal: 215,
    title: "Тиждень на хайпі",
    text: "По чотири години на день, кольорові конспекти, відчуття «я точно все встигну».",
  },
  {
    point: [300, 268],
    reveal: 355,
    title: "Пропустив тиждень",
    text: "Потім місяць і все що там далі.",
  },
  {
    point: [430, 150],
    reveal: 495,
    title: "«Ну тепер точно»",
    text: "Новий ривок з першого числа. І знову з тих самих перших тем, бо старе вивітрилось.",
  },
  {
    point: [575, 275],
    reveal: 615,
    title: "Другий зрив",
    text: "Тем побільшало, часу поменшало, віри в себе - теж. Далі відкладаєш, бо страшно починати.",
  },
  {
    point: [640, 68],
    reveal: 760,
    title: "Квітень: марафон",
    text: "По 12 годин за два тижні до НМТ. На іспиті пам’ять чесно віддає лише те, що вчив учора.",
  },
];

const chaosCrosses = [
  { x: 300, y: 268, from: 2 },
  { x: 575, y: 275, from: 4 },
  { x: 640, y: 68, from: 5 },
  { x: 730, y: 245, from: 5 },
];

const smartSteps: Step[] = [
  {
    point: [40, 262],
    reveal: 105,
    title: "Діагностика",
    text: "Не «десь 130», а список конкретних тем, які провалюються.",
  },
  {
    point: [170, 222],
    reveal: 235,
    title: "План на тиждень",
    text: "Не «повчи історію», а: вівторок, 40 хвилин, Козацька доба, 12 завдань формату НМТ.",
  },
  {
    point: [300, 182],
    reveal: 365,
    title: "Щодня по 30–60 хвилин",
    text: "Той самий загальний час, що й у марафоні. Але розподілений так, щоб він лишався в пам’яті.",
  },
  {
    point: [430, 138],
    reveal: 495,
    title: "Повторення за графіком",
    text: "Тема повертається саме тоді, коли мозок починає її втрачати. Не раніше і не тоді, коли вже пізно.",
  },
  {
    point: [560, 92],
    reveal: 625,
    title: "Тест після кожної теми",
    text: "Пригадуєш сам, бачиш помилку, розбираєш її з куратором. Замість «перечитаю ще разок».",
  },
  {
    point: [700, 44],
    reveal: 760,
    title: "Авторський варіант НМТ раз на місяць",
    text: "Повний формат НМТ під таймер. До травня ви знаєте свій бал, бо бачили його тричі поспіль.",
  },
];

const smartChecks = [
  { x: 170, y: 222, from: 1 },
  { x: 300, y: 182, from: 2 },
  { x: 430, y: 138, from: 3 },
  { x: 560, y: 92, from: 4 },
  { x: 700, y: 44, from: 5 },
];

const CHAOS_PATH =
  "M40 250 C 85 248, 122 90, 165 72 C 214 52, 258 214, 300 268 C 344 324, 396 190, 430 150 C 470 103, 538 226, 575 275 C 601 310, 606 92, 640 68 C 672 45, 706 190, 730 245";

const SMART_PATH =
  "M40 262 C 88 258, 130 228, 170 222 C 220 214, 262 194, 300 182 C 350 166, 396 150, 430 138 C 482 120, 526 108, 560 92 C 612 68, 662 54, 700 44";

function CrossMark({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className={`why-mark ${on ? "is-on" : ""}`}>
      <path
        d="M-15 -17 C -7 -7, 5 7, 15 17"
        fill="none"
        stroke="#475569"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M15 -17 C 6 -5, -5 7, -15 17"
        fill="none"
        stroke="#475569"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </g>
  );
}

function CheckMark({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} className={`why-mark ${on ? "is-on" : ""}`}>
      <circle r="13" fill="#ffffff" stroke="#2563eb" strokeWidth="2.4" />
      <path
        d="M-5.5 0.5 L -1.5 4.8 L 6 -4.4"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function StepRail({
  steps,
  active,
  onSelect,
  tone,
}: {
  steps: Step[];
  active: number;
  onSelect: (i: number) => void;
  tone: "chaos" | "smart";
}) {
  const activeRing =
    tone === "smart"
      ? "border-[#2563eb]/35 bg-[#eff6ff]"
      : "border-[#cbd5e1] bg-white";
  const activeBadge = tone === "smart" ? "bg-[#2563eb] text-white" : "bg-[#475569] text-white";

  return (
    <ol className="flex flex-col gap-1.5">
      {steps.map((step, i) => {
        const isActive = i === active;
        return (
          <li key={step.title}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isActive ? "step" : undefined}
              className={`flex w-full gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                isActive ? activeRing : "border-transparent hover:bg-[#f1f5f9]"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                  isActive ? activeBadge : "bg-[#e2e8f0] text-[#64748b]"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-[0.95rem] font-semibold transition ${
                    isActive ? "text-ink" : "text-[#64748b]"
                  }`}
                >
                  {step.title}
                </span>
                <span
                  className={`grid transition-all duration-500 ${
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <span className="overflow-hidden">
                    <span className="mt-1 block text-sm leading-relaxed text-forest/70">
                      {step.text}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ChaosJourney() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [manual, setManual] = useState(false);
  const [step, setStep] = useStepper(chaosSteps.length, inView && !manual && !reduced);
  const current = reduced ? chaosSteps.length - 1 : step;
  const active = chaosSteps[current];
  const progress = active.reveal / 760;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[1.75rem] border border-[#e2e8f0] bg-[#f8fafc]"
    >
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-[#e2e8f0] px-2.5 text-[11px] font-bold tracking-[0.14em] text-[#475569] uppercase">
              Шлях «наобум»
            </span>
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-[#475569] sm:text-[1.75rem]">
            Мотивація → тиша → паніка → повторити
          </p>

          <svg viewBox="0 0 760 320" className="mt-4 h-auto w-full" aria-hidden>
            <defs>
              <clipPath id="whyChaosClip">
                <rect
                  x="0"
                  y="0"
                  width="760"
                  height="320"
                  className="why-reveal"
                  style={{ transform: `scaleX(${reduced ? 1 : progress})` }}
                />
              </clipPath>
            </defs>

            {[70, 140, 210, 280].map((y) => (
              <line key={y} x1="24" y1={y} x2="748" y2={y} stroke="#e2e8f0" strokeWidth="1" />
            ))}

            <path
              d={CHAOS_PATH}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="11 13"
            />

            <g clipPath="url(#whyChaosClip)">
              <path
                d={CHAOS_PATH}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeDasharray="11 13"
              />
            </g>

            <g
              className="why-marker"
              style={{ transform: `translate(${active.point[0]}px, ${active.point[1]}px)` }}
            >
              <circle r="18" fill="#64748b" opacity="0.14" />
              <circle r="5.5" fill="#475569" />
            </g>

            {chaosCrosses.map((c) => (
              <CrossMark key={`${c.x}-${c.y}`} x={c.x} y={c.y} on={reduced || current >= c.from} />
            ))}

            <text x="30" y="308" fill="#94a3b8" fontSize="13" fontWeight="600">
              вересень
            </text>
            <text x="668" y="308" fill="#94a3b8" fontSize="13" fontWeight="600">
              НМТ
            </text>
          </svg>

          <p className="mt-2 rounded-xl bg-[#eef2f6] px-4 py-3 text-sm leading-relaxed text-[#475569]">
            <span className="font-semibold text-[#334155]">Підсумок:</span> годин витрачено багато,
            бал - нижчий за реальний потенціал. Проблема не в здібностях, а в тому, що вивчене не
            дожило до червня.
          </p>
        </div>

        <div className="lg:pt-2">
          <StepRail
            steps={chaosSteps}
            active={current}
            tone="chaos"
            onSelect={(i) => {
              setManual(true);
              setStep(i);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SmartJourney() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [manual, setManual] = useState(false);
  const [step, setStep] = useStepper(smartSteps.length, inView && !manual && !reduced);
  const current = reduced ? smartSteps.length - 1 : step;
  const active = smartSteps[current];
  const progress = active.reveal / 760;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[1.75rem] border border-[#bfdbfe] bg-white shadow-[0_20px_60px_rgba(37,99,235,0.1)]"
    >
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-[#2563eb] px-2.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase">
              Шлях SMART
            </span>
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
            Щотижня трохи вгору - і жодного разу з нуля
          </p>

          <svg viewBox="0 0 760 320" className="mt-4 h-auto w-full" aria-hidden>
            <defs>
              <clipPath id="whySmartClip">
                <rect
                  x="0"
                  y="0"
                  width="760"
                  height="320"
                  className="why-reveal"
                  style={{ transform: `scaleX(${reduced ? 1 : progress})` }}
                />
              </clipPath>
              <linearGradient id="whySmartArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b8cff" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#5b8cff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[70, 140, 210, 280].map((y) => (
              <line key={y} x1="24" y1={y} x2="748" y2={y} stroke="#e8eefb" strokeWidth="1" />
            ))}

            <path
              d={SMART_PATH}
              fill="none"
              stroke="#e8eefb"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <g clipPath="url(#whySmartClip)">
              <path d={`${SMART_PATH} L 700 300 L 40 300 Z`} fill="url(#whySmartArea)" />
              <path
                d={SMART_PATH}
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            <g
              className="why-marker"
              style={{ transform: `translate(${active.point[0]}px, ${active.point[1]}px)` }}
            >
              <circle r="20" fill="#2563eb" opacity="0.14" />
              <circle r="6" fill="#2563eb" />
            </g>

            {smartChecks.map((c) => (
              <CheckMark key={`${c.x}-${c.y}`} x={c.x} y={c.y} on={reduced || current >= c.from} />
            ))}

            <text x="30" y="308" fill="#94a3b8" fontSize="13" fontWeight="600">
              вересень
            </text>
            <text x="668" y="308" fill="#2563eb" fontSize="13" fontWeight="700">
              НМТ
            </text>
          </svg>

          <p className="mt-2 rounded-xl bg-[#eff6ff] px-4 py-3 text-sm leading-relaxed text-[#1e3a8a]">
            <span className="font-semibold">Підсумок:</span> той самий час, інший розподіл. Кожна
            вивчена тема повертається на повторення й доживає до дня іспиту.
          </p>
        </div>

        <div className="lg:pt-2">
          <StepRail
            steps={smartSteps}
            active={current}
            tone="smart"
            onSelect={(i) => {
              setManual(true);
              setStep(i);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  eyebrow,
  title,
  children,
  takeaway,
  source,
  href,
}: {
  eyebrow: string;
  title: string;
  children: (on: boolean) => ReactNode;
  takeaway: string;
  source: string;
  href: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.35);
  const reduced = usePrefersReducedMotion();

  return (
    <figure
      ref={ref}
      className="flex flex-col rounded-[1.5rem] border border-[#e2e8f0] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6"
    >
      <figcaption>
        <p className="text-[11px] font-bold tracking-[0.16em] text-[#2563eb] uppercase">{eyebrow}</p>
        <h4 className="mt-1.5 font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
          {title}
        </h4>
      </figcaption>

      {children(inView || reduced)}

      <p className="mt-4 text-sm leading-relaxed text-forest/70">{takeaway}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-xs leading-relaxed text-[#64748b] underline decoration-[#cbd5e1] underline-offset-4 transition hover:text-[#2563eb]"
      >
        {source}
      </a>
    </figure>
  );
}

function Gridlines() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {[0, 25, 50, 75, 100].map((v) => (
        <div
          key={v}
          className="absolute inset-x-0 flex items-center"
          style={{ bottom: `${v}%`, transform: "translateY(50%)" }}
        >
          <span className="w-8 shrink-0 text-[10px] font-medium text-[#94a3b8]">{v}%</span>
          <span className="h-px flex-1 bg-[#eef2f7]" />
        </div>
      ))}
    </div>
  );
}

type BarGroup = {
  label: string;
  bars: { name: string; value: number; accent: boolean }[];
};

function BarChart({ on, groups }: { on: boolean; groups: BarGroup[] }) {
  return (
    <div className="mt-6">
      <div className="relative h-52">
        <Gridlines />
        <div className="absolute inset-y-0 left-8 right-0 flex items-end justify-around">
          {groups.map((group, gi) => (
            <div key={group.label} className="flex h-full flex-1 flex-col justify-end">
              <div className="flex h-full items-end justify-center gap-2 sm:gap-4">
                {group.bars.map((bar, bi) => {
                  const delay = gi * 220 + bi * 130;
                  return (
                    <div key={bar.name} className="relative h-full w-12 sm:w-14">
                      <div
                        className={`absolute inset-x-0 bottom-0 rounded-t-md ${
                          bar.accent
                            ? "bg-gradient-to-b from-[#60a5fa] to-[#1d4ed8]"
                            : "bg-[#cbd5e1]"
                        }`}
                        style={{
                          height: on ? `${bar.value}%` : "0%",
                          transition: "height 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
                          transitionDelay: `${delay}ms`,
                        }}
                      />
                      <span
                        className={`absolute inset-x-0 text-center text-[13px] font-bold tabular-nums ${
                          bar.accent ? "text-[#1d4ed8]" : "text-[#64748b]"
                        }`}
                        style={{
                          bottom: on ? `calc(${bar.value}% + 6px)` : "6px",
                          opacity: on ? 1 : 0,
                          transition:
                            "bottom 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                          transitionDelay: `${delay + 180}ms`,
                        }}
                      >
                        {String(bar.value).replace(".", ",")}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-around border-t border-[#e2e8f0] pl-8 pt-2.5">
        {groups.map((group) => (
          <p key={group.label} className="flex-1 text-center text-xs font-semibold text-forest/60">
            {group.label}
          </p>
        ))}
      </div>
    </div>
  );
}

function Legend({ items }: { items: { name: string; accent: boolean }[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map((item) => (
        <span key={item.name} className="inline-flex items-center gap-2 text-xs text-forest/65">
          <span
            className={`h-2.5 w-2.5 rounded-sm ${
              item.accent ? "bg-[#1d4ed8]" : "bg-[#cbd5e1]"
            }`}
          />
          {item.name}
        </span>
      ))}
    </div>
  );
}

const forgettingLabels = ["20 хв", "1 год", "9 год", "1 день", "2 дні", "6 днів", "31 день"];
const ebbinghaus = [58, 44, 36, 34, 28, 25, 21];
const replication = [47, 37, 28, 32, 23, 17, 4];

function toPoints(values: number[]) {
  return values.map((v, i) => {
    const x = 46 + i * ((404 - 46) / (values.length - 1));
    const y = 176 - (v / 100) * 156;
    return [x, y] as const;
  });
}

function toPath(values: number[]) {
  return toPoints(values)
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
}

function ForgettingChart({ on }: { on: boolean }) {
  return (
    <div className="mt-6">
      <svg viewBox="0 0 420 210" className="h-auto w-full" aria-hidden>
        {[0, 25, 50, 75, 100].map((v) => {
          const y = 176 - (v / 100) * 156;
          return (
            <g key={v}>
              <line x1="46" y1={y} x2="404" y2={y} stroke="#eef2f7" strokeWidth="1" />
              <text x="10" y={y + 4} fill="#94a3b8" fontSize="10" fontWeight="500">
                {v}%
              </text>
            </g>
          );
        })}

        <path
          d={toPath(ebbinghaus)}
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: on ? 0 : 1,
            transition: "stroke-dashoffset 1.4s ease-out 0.15s",
          }}
        />
        <path
          d={toPath(replication)}
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="7 7"
          style={{
            opacity: on ? 1 : 0,
            transition: "opacity 0.8s ease 0.9s",
          }}
        />

        {toPoints(ebbinghaus).map(([x, y], i) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r="4"
            fill="#ffffff"
            stroke="#1d4ed8"
            strokeWidth="2.4"
            style={{
              opacity: on ? 1 : 0,
              transition: `opacity 0.4s ease ${0.25 + i * 0.16}s`,
            }}
          />
        ))}

        {forgettingLabels.map((label, i) => {
          const x = 46 + i * ((404 - 46) / (forgettingLabels.length - 1));
          return (
            <text
              key={label}
              x={x}
              y="198"
              fill="#94a3b8"
              fontSize="10"
              fontWeight="500"
              textAnchor="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>

      <Legend
        items={[
          { name: "Еббінгауз, 1885", accent: true },
          { name: "Репліка 2015 року", accent: false },
        ]}
      />
    </div>
  );
}

export function WhySmart() {
  return (
    <section
      id="why"
      className="relative overflow-hidden border-y border-[#e2e8f0] bg-gradient-to-b from-white via-[#f7faff] to-white py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(#eaf0fb_1px,transparent_1px),linear-gradient(90deg,#eaf0fb_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs font-bold tracking-[0.24em] text-[#2563eb] uppercase">Головне</p>
        <h2 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-[2.5rem] leading-[1.02] font-semibold tracking-tight text-ink sm:text-6xl md:text-7xl">
          Чому SMART для підготовки до НМТ?
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/75 md:text-xl">
          Бал вирішує не талант і не героїчні 12 годин у квітні. Його вирішує те, що ви робите
          кожного тижня з вересня - і скільки з цього доживе до дня іспиту.{" "}
          <span className="font-semibold text-ink">
            Ми даємо систему, яка не дає забути матеріал.
          </span>
        </p>

        {/* Системна підготовка */}
        <div className="mt-16">
          <div className="max-w-3xl">
            <h3 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Що ми називаємо системною підготовкою
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-forest/70">
              Це не «вчитися більше». Це шість речей, які працюють тільки разом - прибери одну, і
              конструкція не складається, як у більшості самостійників.
            </p>
          </div>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Точка А замість здогадок",
                d: "Діагностика показує рівень по кожній темі окремо. Визнач свій рівень на початку навчання.",
              },
              {
                t: "Ритм замість ривків",
                d: "30–60 хвилин щодня замість шести годин раз на два тижні. Годин виходить стільки ж - результат інший.",
              },
              {
                t: "Повторення в потрібний момент",
                d: "Тема повертається тоді, коли пам’ять починає її втрачати. Раніше - марна витрата часу, пізніше - вчити з нуля.",
              },
              {
                t: "Пригадування, а не перечитування",
                d: "Кожна тема закінчується тестом і розбором помилок. «Десь бачив» на НМТ не зараховують.",
              },
              {
                t: "Вимірювання щомісяця",
                d: "Авторський варіант НМТ у повному форматі під таймер. Прогрес у балах, а не у відчутті «начебто підтягнувся».",
              },
              {
                t: "Людина, яка не дасть злитись",
                d: "Куратор бачить провал темпу на другий день, а не в квітні. Один дзвінок замість втраченого місяця.",
              },
            ].map((item, i) => (
              <li
                key={item.t}
                className="rounded-2xl border border-[#e2e8f0] bg-white p-5 transition hover:border-[#bfdbfe] hover:shadow-[0_14px_40px_rgba(37,99,235,0.08)]"
              >
                <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[#2563eb]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                  {item.t}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-forest/70">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Два шляхи */}
        <div className="mt-20">
          <h3 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Два шляхи до 200 балів. Один із них не веде туди ніколи
          </h3>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-forest/70">
            Подивіться, як виглядає навчальний рік у кожному з них. Крок за кроком, від вересня до
            дня іспиту.
          </p>

          <div className="mt-9 space-y-5">
            <ChaosJourney />
            <SmartJourney />
          </div>
        </div>

        {/* Тези */}
        <div className="mt-20">
          <ul className="grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Забування - не лінь",
                d: "Це нормальна робота мозку. З нею не борються силою волі - її обходять графіком повторень.",
              },
              {
                t: "Час можна не збільшувати",
                d: "Ті самі години, розкладені інакше, дають помітно вищий результат на фінальному тесті.",
              },
              {
                t: "Тест - це не контроль",
                d: "Це найсильніший спосіб запам’ятати. Перечитування тільки створює відчуття, що ви знаєте.",
              },
            ].map((item) => (
              <li key={item.t} className="rounded-2xl bg-ink p-6 text-white">
                <h4 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                  {item.t}
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-white/70">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Докази */}
        <div className="mt-16">
          <h3 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            У нас є докази:
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest/70">
            Це не наша внутрішня статистика й не «за даними наших учнів». Нижче - чотири
            рецензовані дослідження когнітивної психології. Кожен графік підписаний джерелом і
            веде на оригінал публікації.
          </p>

          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            <ChartCard
              eyebrow="Крива забування"
              title="Що лишається після одного вивчення"
              takeaway="Вивчив один раз - і вже за добу здатність відтворити матеріал падає приблизно до третини. Без запланованого повторення до НМТ доживає дуже мало. Синя лінія - класичний експеримент Еббінгауза, пунктир - його успішне повторення у 2015 році."
              source="Murre & Dros, «Replication and Analysis of Ebbinghaus’ Forgetting Curve», PLOS ONE, 2015 - вимірювання методом economy of savings"
              href="https://doi.org/10.1371/journal.pone.0120644"
            >
              {(on) => <ForgettingChart on={on} />}
            </ChartCard>

            <ChartCard
              eyebrow="Розподілена практика"
              title="Той самий час, розкладений інакше"
              takeaway="Метааналіз 317 експериментів: коли ті самі повторення рознесені в часі, а не зібрані в один підхід, середня точність на фінальному тесті - 47,3% проти 36,7%. Жодного інтервалу, на якому зубріння вигравало б у довгій дистанції, знайдено не було."
              source="Cepeda, Pashler, Vul, Wixted & Rohrer, Psychological Bulletin, 2006 - 317 експериментів, 184 публікації"
              href="https://doi.org/10.1037/0033-2909.132.3.354"
            >
              {(on) => (
                <>
                  <BarChart
                    on={on}
                    groups={[
                      {
                        label: "усе за один раз",
                        bars: [{ name: "Зубріння", value: 36.7, accent: false }],
                      },
                      {
                        label: "рознесено в часі",
                        bars: [{ name: "Розподілено", value: 47.3, accent: true }],
                      },
                    ]}
                  />
                  <p className="mt-1 text-xs text-forest/50">
                    Точність на фінальному тесті, усереднено по всіх інтервалах утримання.
                  </p>
                </>
              )}
            </ChartCard>

            <ChartCard
              eyebrow="Тестування проти перечитування"
              title="Чому «перечитаю ще раз» обманює"
              takeaway="Одразу після навчання перечитування виглядає ефективнішим - 83% проти 71%. Через тиждень усе перевертається: 40% проти 61%. Саме тому відчуття «я готовий» після конспектів нічого не гарантує, а тест після теми - гарантує."
              source="Roediger & Karpicke, «Test-Enhanced Learning», Psychological Science, 2006 - експеримент 2, частка відтворених смислових одиниць"
              href="https://doi.org/10.1111/j.1467-9280.2006.01693.x"
            >
              {(on) => (
                <>
                  <BarChart
                    on={on}
                    groups={[
                      {
                        label: "через 5 хвилин",
                        bars: [
                          { name: "Перечитування", value: 83, accent: false },
                          { name: "Тестування", value: 71, accent: true },
                        ],
                      },
                      {
                        label: "через тиждень",
                        bars: [
                          { name: "Перечитування", value: 40, accent: false },
                          { name: "Тестування", value: 61, accent: true },
                        ],
                      },
                    ]}
                  />
                  <Legend
                    items={[
                      { name: "перечитування", accent: false },
                      { name: "тест на пригадування", accent: true },
                    ]}
                  />
                </>
              )}
            </ChartCard>

            <ChartCard
              eyebrow="Математика, не абстракція"
              title="Ті самі задачі, різний розклад"
              takeaway="Студенти розв’язували однакову кількість задач одного типу. Одні - за один сеанс, інші - за два з інтервалом у тиждень. На тесті через тиждень: 74% проти 49%. Ніхто не працював більше - працювали за розкладом."
              source="Rohrer & Taylor, «The shuffling of mathematics problems improves learning», Instructional Science, 2007 - експеримент 1"
              href="https://doi.org/10.1007/s11251-007-9015-8"
            >
              {(on) => (
                <>
                  <BarChart
                    on={on}
                    groups={[
                      {
                        label: "усе за один сеанс",
                        bars: [{ name: "Масовано", value: 49, accent: false }],
                      },
                      {
                        label: "два сеанси через тиждень",
                        bars: [{ name: "Розподілено", value: 74, accent: true }],
                      },
                    ]}
                  />
                  <p className="mt-1 text-xs text-forest/50">
                    Точність на тесті через тиждень після останньої практики.
                  </p>
                </>
              )}
            </ChartCard>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-forest/60">
            Уся методика SmartZno побудована саме на цих принципах: розподілені сесії замість
            марафонів, повторення за графіком і тест після кожної теми. Ми не вигадали їх - ми
            зробили так, щоб учень справді їх дотримувався.
          </p>
        </div>
      </div>
    </section>
  );
}
