import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroPhoneForm } from "@/components/HeroPhoneForm";
import { HistoryHook } from "@/components/history/HistoryHook";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCta } from "@/components/StickyCta";
import eraBlurs from "@/components/history/era-blurs.json";

export const metadata: Metadata = {
  title: "Історія України — SmartZno",
  description:
    "Історія як серіал, який НМТ перевіряє за 60 хвилин. Від Трипілля до незалежності — через сюжети, не через списки дат.",
};

const years = [
  { y: "988", x: "8%", t: "18%" },
  { y: "1240", x: "22%", t: "62%" },
  { y: "1569", x: "48%", t: "14%" },
  { y: "1648", x: "68%", t: "44%" },
  { y: "1918", x: "82%", t: "22%" },
  { y: "1991", x: "90%", t: "70%" },
];

const eras = [
  {
    year: "до н.е.",
    title: "Стародавня",
    line: "Степ, Трипілля, поліси. Земля вже жила, держави ще не було.",
    image: "/images/eras/ancient.webp",
    blur: eraBlurs.ancient,
  },
  {
    year: "IX–XIV",
    title: "Русь",
    line: "Хрещення, розквіт, роздробленість. Карту потім ділитимуть усі.",
    image: "/images/eras/rus.webp",
    blur: eraBlurs.rus,
  },
  {
    year: "1569",
    title: "Унія",
    line: "Не весілля королів. Точка, після якої правила гри інші.",
    image: "/images/eras/unia.webp",
    blur: eraBlurs.unia,
  },
  {
    year: "1648",
    title: "Січ",
    line: "Не «козаки на конях». Ставка, яку степ зробив проти імперій.",
    image: "/images/eras/sich.webp",
    blur: eraBlurs.sich,
  },
  {
    year: "1709",
    title: "Мазепа",
    line: "Поразка, після якої автономію з’їдають повільно і назавжди.",
    image: "/images/eras/mazepa.webp",
    blur: eraBlurs.mazepa,
  },
  {
    year: "1918",
    title: "Злука",
    line: "Кілька місяців на карті. Ідея, яка пережила всі влади.",
    image: "/images/eras/zluka.webp",
    blur: eraBlurs.zluka,
  },
  {
    year: "1933",
    title: "Голодомор",
    line: "НМТ питає не лише рік. Він питає, як держава ламає село.",
    image: "/images/eras/holodomor.webp",
    blur: eraBlurs.holodomor,
  },
  {
    year: "1991",
    title: "Незалежність",
    line: "Не фінал підручника. Старт сюжету, в якому ти вже є.",
    image: "/images/eras/independence.webp",
    blur: eraBlurs.independence,
  },
];

export default function HistoryPage() {
  return (
    <main className="hist-page hist-grain pb-24 md:pb-0">
      <StickyCta />

      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/images/subject-history.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={55}
          className="object-cover opacity-[0.28] saturate-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080c]/40 via-[#07080c]/75 to-[#07080c]" />
        <div className="hist-scan pointer-events-none absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-play/50 to-transparent" />
        {years.map((item, i) => (
          <span
            key={item.y}
            className="hist-year pointer-events-none absolute hidden font-[family-name:var(--font-display)] text-4xl font-semibold text-white/25 md:block lg:text-6xl"
            style={{ left: item.x, top: item.t, animationDelay: `${i * 0.7}s` }}
          >
            {item.y}
          </span>
        ))}
        <SiteHeader />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-20">
          <p className="text-xs font-semibold tracking-[0.28em] text-play uppercase">НМТ · 30 кадрів · 54 бали</p>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Історія — це серіал.
            <span className="mt-2 block text-white/45">НМТ перевіряє, чи ти дивився.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
            Поки хтось зубрить 400 дат, ти тримаєш вісім сюжетів. Дата потім сама лягає на місце —
            як титр у кінці серії.
          </p>
          <a
            href="#consult-form"
            className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide text-play uppercase"
          >
            Хочу так вчити <span aria-hidden>↓</span>
          </a>
        </div>
      </section>

      <section className="relative px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">розкол</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight md:text-5xl">
              Два способи скласти історію
            </h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs tracking-widest text-white/35 uppercase">звичайний шлях</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white/40">
                «Вивчи дати до травня»
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/45">
                Мозок тримає список три дні. На тесті питають звʼязок — і все розсипається.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-play/35 bg-play/10 p-6">
              <p className="text-xs tracking-widest text-play uppercase">наш шлях</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
                «Зрозумій, чому вибухнуло»
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Кожна епоха — серія. Персонажі, конфлікт, фінал. НМТ любить саме це.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 md:pb-12">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">стрічка епох</p>
          <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
            Прокрути історію, як титри
          </h2>
        </div>
        <div className="hist-reel mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:px-8">
          {eras.map((era) => (
            <article
              key={era.year}
              className="hist-frame relative w-[17.5rem] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-[#101218]"
            >
              <Image
                src={era.image}
                alt=""
                fill
                sizes="280px"
                quality={70}
                loading="lazy"
                placeholder="blur"
                blurDataURL={era.blur}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/80" />
              <div className="relative flex min-h-[22rem] flex-col justify-between p-6">
                <p className="font-[family-name:var(--font-display)] text-4xl font-semibold text-white/90">
                  {era.year}
                </p>
                <div>
                  <p className="text-xs tracking-[0.2em] text-play uppercase">{era.title}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-white/70">{era.line}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">пастка іспиту</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight md:text-4xl">
              Натисни кадр. Побач, як думає НМТ.
            </h2>
            <p className="mt-4 text-white/55">
              Лекція дає сюжет, конспект — титри, квізкарти — обличчя, квіз — сам іспит.
              Ілля веде так, ніби ви дивитеся сезон, а не зубріть том.
            </p>
          </div>
          <HistoryHook />
        </div>
      </section>

      <section className="border-y border-white/10 px-5 py-16 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-play/80 uppercase">формат</p>
            <p className="mt-3 max-w-md text-white/55">
              60 хвилин. Жодного зайвого сюжету. Лише те, що реально вилізе в тесті.
            </p>
          </div>
          <div className="flex gap-8 sm:gap-14">
            {[
              { n: "30", l: "завдань" },
              { n: "54", l: "бали" },
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
            Якщо хочеш складати історію як фільм — зайди в кадр.
          </h2>
          <p className="mt-4 max-w-lg text-white/55">
            Передзвонимо. Покажемо, з якої серії стартувати. Або одразу пиши в бота.
          </p>
          <HeroPhoneForm source="landing_history" />
          <Link
            href="/cabinet/courses/history"
            className="mt-8 inline-flex text-sm font-semibold text-white/50 transition hover:text-play"
          >
            Вже в кабінеті? Відкрити курс →
          </Link>
        </div>
      </section>
    </main>
  );
}
