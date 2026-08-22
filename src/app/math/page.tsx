import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroPhoneForm } from "@/components/HeroPhoneForm";
import { MathHook } from "@/components/math/MathHook";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCta } from "@/components/StickyCta";
import mathBlurs from "@/components/math/math-blurs.json";

export const metadata: Metadata = {
  title: "Математика — SmartZno",
  description:
    "НМТ з математики — 22 пастки за 60 хвилин. Учимо формули через ходи, таймінг і типові помилки, не через зубріння.",
};

const glyphs = [
  { s: "√", x: "7%", t: "22%" },
  { s: "π", x: "28%", t: "64%" },
  { s: "Δ", x: "52%", t: "16%" },
  { s: "∫", x: "72%", t: "48%" },
  { s: "∞", x: "88%", t: "26%" },
];

const levels = [
  {
    n: "01",
    title: "Числа",
    line: "Дроби, степені, модуль. Тут зникають найлегші бали.",
    image: "/images/math/numbers.webp",
    blur: mathBlurs.numbers,
  },
  {
    n: "02",
    title: "Рівняння",
    line: "Не «розв’яжи». Знайди, де рівняння бреше про ОДЗ.",
    image: "/images/math/equations.webp",
    blur: mathBlurs.equations,
  },
  {
    n: "03",
    title: "Функції",
    line: "Графік — це характер. Зсув, знак, вершина.",
    image: "/images/math/functions.webp",
    blur: mathBlurs.functions,
  },
  {
    n: "04",
    title: "Ймовірність",
    line: "Кілька рядків логіки замість магії «на око».",
    image: "/images/math/probability.webp",
    blur: mathBlurs.probability,
  },
  {
    n: "05",
    title: "Планіметрія",
    line: "Малюнок першим. Формула — другим.",
    image: "/images/math/planimetry.webp",
    blur: mathBlurs.planimetry,
  },
  {
    n: "06",
    title: "Стереометрія",
    line: "Об’єм не вгадують. Його збирають з перерізу.",
    image: "/images/math/stereo.webp",
    blur: mathBlurs.stereo,
  },
];

export default function MathPage() {
  return (
    <main className="math-page math-grid pb-24 md:pb-0">
      <StickyCta />

      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/images/subject-math.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={55}
          className="object-cover opacity-[0.22] saturate-[0.35] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070c]/30 via-[#05070c]/80 to-[#05070c]" />
        <div className="hist-scan pointer-events-none absolute inset-x-0 top-[46%] h-px bg-gradient-to-r from-transparent via-play/60 to-transparent" />
        {glyphs.map((item, i) => (
          <span
            key={item.s}
            className="math-glyph pointer-events-none absolute hidden font-[family-name:var(--font-display)] text-5xl font-semibold text-play/30 md:block lg:text-7xl"
            style={{ left: item.x, top: item.t, animationDelay: `${i * 0.55}s` }}
          >
            {item.s}
          </span>
        ))}
        <SiteHeader />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-20">
          <p className="text-xs font-semibold tracking-[0.28em] text-play uppercase">НМТ · 22 ходи · 32 бали</p>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Це не 22 задачі.
            <span className="mt-2 block text-white/40">Це 22 пастки.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
            Формулу можна визубрить за ніч. Хід, який рятує бал, — ні. Анна вчить бачити пастку
            раніше, ніж УЦОЯО її поставить.
          </p>
          <a
            href="#consult-form"
            className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-play uppercase"
          >
            Хочу так рахувати <span aria-hidden>↓</span>
          </a>
        </div>
      </section>

      <section className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">режим</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight md:text-5xl">
              Дві гри на одному тесті
            </h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs tracking-widest text-white/35 uppercase">програш</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white/40">
                «Спочатку всі формули»
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/45">
                На 14-й хвилині вже немає часу. Ти знаєш правило — і все одно обираєш сусідню відповідь.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-play/35 bg-play/10 p-6">
              <p className="text-xs tracking-widest text-play uppercase">виграш</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
                «Спочатку хід, потім формула»
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Що розв’язати першим. Де ОДЗ. Де малюнок. 60 хвилин стають стратегією, не панікою.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 md:pb-12">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">рівні</p>
          <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
            Шість світів. Один іспит.
          </h2>
        </div>
        <div className="hist-reel mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:px-8">
          {levels.map((lvl) => (
            <article
              key={lvl.n}
              className="hist-frame relative w-[17.5rem] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1018]"
            >
              <Image
                src={lvl.image}
                alt=""
                fill
                sizes="280px"
                quality={70}
                loading="lazy"
                placeholder="blur"
                blurDataURL={lvl.blur}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
              <div className="relative flex min-h-[22rem] flex-col justify-between p-6">
                <p className="font-[family-name:var(--font-display)] text-4xl font-semibold text-play/90">
                  {lvl.n}
                </p>
                <div>
                  <p className="text-xs tracking-[0.2em] text-white/50 uppercase">{lvl.title}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75">{lvl.line}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">типовий мінус</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight md:text-4xl">
              Натисни пастку. Впізнай свій бал.
            </h2>
            <p className="mt-4 text-white/55">
              Теорія дає хід, квізкарти — рефлекс, завдання — іспит. Анна розбирає помилку, доки вона
              не стала «я просто неуважно».
            </p>
          </div>
          <MathHook />
        </div>
      </section>

      <section className="border-y border-white/10 px-5 py-16 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">таймер</p>
            <p className="mt-3 max-w-md text-white/55">
              22 завдання. 32 бали. Хто вміє пропускати важке — той добігає до легкого.
            </p>
          </div>
          <div className="flex gap-8 sm:gap-14">
            {[
              { n: "22", l: "завдання" },
              { n: "32", l: "бали" },
              { n: "60", l: "хвилин" },
            ].map((item) => (
              <div key={item.l}>
                <p className="font-[family-name:var(--font-display)] text-5xl font-semibold text-white md:text-6xl">
                  {item.n}
                </p>
                <p className="mt-1 text-sm text-white/40">{item.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consult-form" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight md:text-5xl">
            Якщо хочеш грати, а не зубрить — входь у рівень.
          </h2>
          <p className="mt-4 max-w-lg text-white/55">
            Передзвонимо. Скажемо, з якого блоку стартувати. Або одразу пиши в бота.
          </p>
          <HeroPhoneForm source="landing_math" />
          <Link
            href="/cabinet/courses/math"
            className="mt-8 inline-flex text-sm font-semibold text-white/50 transition hover:text-play"
          >
            Вже в кабінеті? Відкрити курс →
          </Link>
        </div>
      </section>
    </main>
  );
}
