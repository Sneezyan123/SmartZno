"use client";

import { useState } from "react";
import { useInView, usePrefersReducedMotion, useStepper } from "./motion";

const week = [
  {
    day: "Пн",
    time: "45–60 хв",
    task: "Живе заняття або запис",
    detail:
      "Нова тема з викладачем у прямому ефірі. Не змогли бути - запис у кабінеті того ж дня, питання куратору в Telegram.",
    from: "#3b82f6",
    to: "#1d4ed8",
  },
  {
    day: "Вт",
    time: "25–35 хв",
    task: "Квізкартки: закріплення",
    detail:
      "Найкоротший підхід до вчорашнього матеріалу, поки він ще свіжий. Саме тут тема переходить із зошита в памʼять.",
    from: "#22b8cf",
    to: "#0e7490",
  },
  {
    day: "Ср",
    time: "40–50 хв",
    task: "Практика у форматі НМТ",
    detail:
      "Завдання точно такого формату, як на іспиті, і під таймер. Не «схожі задачі», а ті, що реально будуть у бланку.",
    from: "#6366f1",
    to: "#4338ca",
  },
  {
    day: "Чт",
    time: "20–30 хв",
    task: "Слабкі місця, коротко",
    detail:
      "Найлегший день тижня. Тільки те, що ви завалили на практиці, - за персональним списком від куратора.",
    from: "#8b5cf6",
    to: "#6d28d9",
  },
  {
    day: "Пт",
    time: "45–60 хв",
    task: "Друге заняття: розбір",
    detail:
      "Друга зустріч тижня: розбираємо помилки з практики й закриваємо прогалини до того, як вони накопичаться.",
    from: "#d946ef",
    to: "#a21caf",
  },
  {
    day: "Сб",
    time: "30–40 хв",
    task: "Міні-тест або авторський варіант НМТ",
    detail:
      "Перевірка тижня в балах, а не у відчуттях. Раз на місяць замість міні-тесту - повний авторський варіант НМТ під таймер.",
    from: "#f43f5e",
    to: "#be123c",
  },
  {
    day: "Нд",
    time: "за бажанням",
    task: "Буфер або відпочинок",
    detail:
      "Нічого не заплановано. Якщо тиждень зірвався через світло чи секцію - надолужуєте тут. Якщо ні - відпочиваєте.",
    from: "#94a3b8",
    to: "#64748b",
  },
];

export function WeekRhythm() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [manual, setManual] = useState(false);
  const [step, setStep] = useStepper(week.length, inView && !manual && !reduced, 1700, 2800);
  const active = week[step];

  return (
    <div ref={ref}>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {week.map((item, i) => {
          const isOn = i === step;
          return (
            <li key={item.day}>
              <button
                type="button"
                onClick={() => {
                  setManual(true);
                  setStep(i);
                }}
                aria-current={isOn ? "step" : undefined}
                className="group flex w-full flex-col items-stretch"
              >
                <span
                  className="flex aspect-square flex-col justify-between rounded-2xl border p-3.5 text-left"
                  style={{
                    background: isOn
                      ? `linear-gradient(155deg, ${item.from} 0%, ${item.to} 100%)`
                      : `${item.from}14`,
                    borderColor: isOn ? item.to : `${item.from}33`,
                    boxShadow: isOn ? `0 16px 34px ${item.to}45` : "none",
                    transform: isOn ? "translateY(-6px)" : "translateY(0)",
                    transition:
                      "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)",
                  }}
                >
                  <span
                    className="text-[11px] font-bold tracking-wide"
                    style={{
                      color: isOn ? "rgba(255,255,255,0.8)" : item.to,
                      transition: "color 0.45s ease",
                    }}
                  >
                    {item.time}
                  </span>
                  <span
                    className="text-[13px] leading-snug font-semibold"
                    style={{
                      color: isOn ? "#ffffff" : "var(--forest)",
                      opacity: isOn ? 1 : 0.72,
                      transition: "color 0.45s ease, opacity 0.45s ease",
                    }}
                  >
                    {item.task}
                  </span>
                </span>

                <span
                  className="mt-2.5 text-center font-[family-name:var(--font-display)] text-sm font-bold"
                  style={{
                    color: isOn ? item.to : "#94a3b8",
                    transition: "color 0.45s ease",
                  }}
                >
                  {item.day}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex gap-3.5 rounded-2xl border border-[#e2e8f0] bg-white p-4 sm:p-5">
        <span
          className="w-1 shrink-0 self-stretch rounded-full"
          style={{
            background: `linear-gradient(180deg, ${active.from}, ${active.to})`,
            transition: "background 0.45s ease",
          }}
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-forest/75">
          <span className="font-semibold text-ink">{active.task}.</span> {active.detail}
        </p>
      </div>
    </div>
  );
}
