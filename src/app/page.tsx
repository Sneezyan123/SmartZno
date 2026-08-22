import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroPhoneForm } from "@/components/HeroPhoneForm";
import { LeadRequestForm } from "@/components/LeadRequestForm";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCta } from "@/components/StickyCta";
import { WeekRhythm } from "@/components/why/WeekRhythm";
import { WhySmart } from "@/components/why/WhySmart";

const proofs = [
  { value: "12 400+", label: "учнів" },
  { value: "183", suffix: "/200", label: "середній бал" },
  { value: "+51", label: "середній приріст" },
  { value: "840+", label: "двістібальників" },
];

const featuredSubjects = [
  {
    name: "Історія України",
    topic: "Стародавня історія",
    image: "/images/subject-history.jpg",
    tint: "bg-[#3b82f6]/70",
    href: "/history",
  },
  {
    name: "Математика",
    topic: "Арифметика",
    image: "/images/subject-math.jpg",
    tint: "bg-[#9aa0c4]/75",
    href: "/math",
  },
];

const teachers = [
  {
    name: "Анна",
    initials: "АН",
    subject: "Математика",
    years: "5 років",
    note: "Склала іспит на 200. Веде когорти з нуля до розгорнутих задач.",
    highlight: "210+ учнів з 180+",
    tone: "bg-[#f5d0fe] text-[#6b21a8]",
  },
  {
    name: "Дарія",
    initials: "ДА",
    subject: "Українська мова",
    years: "4 роки",
    note: "Пояснює складні правила просто. Стипендіантка КНУ.",
    highlight: "Фокус на типових помилках",
    tone: "bg-[#fae8ff] text-[#86198f]",
  },
  {
    name: "Ілля",
    initials: "ІЛ",
    subject: "Історія України",
    years: "7 років",
    note: "Автор методики SmartZno. Вчить через логіку епох, не списки.",
    highlight: "12 500+ учнів за карʼєру",
    tone: "bg-[#fef3c7] text-[#854d0e]",
  },
  {
    name: "Марія",
    initials: "МА",
    subject: "Англійська",
    years: "6 років",
    note: "Філологія та переклад. Стратегії читання під таймер НМТ.",
    highlight: "Середній приріст групи +38",
    tone: "bg-[#f3e8ff] text-[#6b21a8]",
  },
];

const included = [
  {
    t: "Живі заняття + записи",
    d: "2–3 практикуми на тиждень. Немає світла - урок лишається в кабінеті того ж дня.",
  },
  {
    t: "Особистий кабінет",
    d: "Розклад, ДЗ, конспекти, тести й прогрес - з телефону чи ноутбука.",
  },
  {
    t: "Конспекти й шпори",
    d: "PDF до кожної теми + короткі матеріали для повторення перед авторським варіантом НМТ.",
  },
  {
    t: "Тести по темах",
    d: "Банк формату НМТ, автоперевірка й розбір помилок - не лише «так/ні».",
  },
  {
    t: "Щомісячний авторський варіант НМТ",
    d: "Імітація з таймінгом. Бачите приріст у балах, а не «відчуття прогресу».",
  },
  {
    t: "Куратор у Telegram",
    d: "Темп, SLA на ДЗ до 24 год і підтримка, якщо потік почав «розʼїжджатися».",
  },
];

const path = [
  { n: "01", t: "Точка А", d: "Діагностика фіксує стартовий бал і теми, що тягнуть результат вниз." },
  { n: "02", t: "Потік", d: "Потрапляєте в групу foundation / standard / premium - без змішування рівнів." },
  { n: "03", t: "Цикл тижня", d: "Запис або ефір → практикум → тести → ДЗ куратору. Ритм до травня." },
  { n: "04", t: "Авторський варіант НМТ", d: "Щомісячна імітація. Підкручуємо слабкі блоки, а не вчимо «все знову»." },
];

const freeTopics = [
  { subject: "Історія", topic: "Стародавня історія України" },
  { subject: "Українська", topic: "Дієслово: типові пастки" },
  { subject: "Математика", topic: "Арифметична й геометрична прогресії" },
  { subject: "Біологія", topic: "Хімічний склад клітини" },
];

const reviews = [
  {
    quote:
      "Пришла в січні з 118 з математики. За пʼять місяців - 176. Без куратора, який добивав ДЗ, точно б злилася на середині.",
    name: "Марія",
    meta: "11 клас · математика · +58",
    score: "176",
  },
  {
    quote:
      "Як батько бачу прогрес у кабінеті щотижня - нарешті не треба питати «чи вчиш». Дешевше за репетитора, контроль жорсткіший.",
    name: "Андрій",
    meta: "батько учня 11 класу",
    score: null,
  },
  {
    quote:
      "Історію завжди зубріла списками і забувала. Тут логіка епох + тести після теми. На пробному вже 184.",
    name: "Софія",
    meta: "11 клас · історія",
    score: "184",
  },
  {
    quote:
      "Брала українську й англійську. Знижка на другий предмет відчутна. Записи рятували, коли не було світла до вечора.",
    name: "Олена",
    meta: "мама · 10 клас",
    score: null,
  },
];

const compareRows = [
  ["Ціна / міс", "Фіксована підписка", "Часто дорого за урок", "Дешево, але хаос"],
  ["Хто тримає темп", "Куратор + когорта", "Залежить від людини", "Ніхто"],
  ["Програма НМТ", "Повна, до травня", "Різна якість", "Самі збираєте"],
  ["Перевірка", "Тести + авторський варіант НМТ", "«Відчуваю»", "Рідко"],
  ["Батьки", "Кабінет / SMS", "Окремі дзвінки", "Немає"],
  ["Світло", "Записи + офлайн", "Переносять уроки", "Зриває ритм"],
];

const pricingFeatures = [
  { name: "2–3 заняття на тиждень + записи", s: true, p: true },
  { name: "Конспекти, шпори, база тестів", s: true, p: true },
  { name: "Щомісячний авторський варіант НМТ", s: true, p: true },
  { name: "Куратор у Telegram, SLA ДЗ 24 год", s: true, p: true },
  { name: "Групи за рівнем після діагностики", s: true, p: true },
  { name: "Персональний куратор", s: false, p: true },
  { name: "Батьківський кабінет + SMS", s: false, p: true },
  { name: "AI-аналітика слабких тем", s: false, p: true },
  { name: "Мінігрупи з куратором", s: false, p: true },
];

const faqs = [
  {
    q: "Чи все пройдемо до НМТ?",
    a: "Так. Програма за офіційними вимогами НМТ: від базових тем до складних. Темп когорти розрахований до травня–червня.",
  },
  {
    q: "Що, якщо пропустив живе заняття?",
    a: "Запис зʼявляється в кабінеті того ж дня. Питання - викладачу або куратору в Telegram.",
  },
  {
    q: "Можна брати кілька предметів?",
    a: "Так. Підписка за кожен предмет. Знижки Standard: 2 пр. −50 ₴, 3 −100 ₴, 4 −150 ₴.",
  },
  {
    q: "Як готуватися без стабільного світла?",
    a: "Ефіри пишуться. Конспекти й тести можна завантажити. Куратор зрушує дедлайни після відключень.",
  },
  {
    q: "Хто платить і хто вчиться?",
    a: "Оплачують батьки, навчається учень. У Premium батьки бачать прогрес без щоденних допитів.",
  },
  {
    q: "З чого почати?",
    a: "З безоплатної діагностики або короткого тесту. Підкажемо потік і тариф без продажного уроку 1-на-1.",
  },
];

function Check({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal/15 text-xs font-bold text-teal">
      ✓
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center text-forest/25">—</span>
  );
}

export default function HomePage() {
  return (
    <main className="pb-24 md:pb-0">
      <SiteHeader />
      <StickyCta />

      {/* Hero */}
      <section id="consult" className="relative min-h-[100svh] overflow-hidden bg-ink-game text-white">
        <HeroDecor />
        <div className="relative z-[1] mx-auto flex min-h-[100svh] max-w-6xl items-center px-5 pb-28 pt-28 md:px-8 md:pt-24">
          <div className="flex w-full flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-12">
            <div className="relative z-[1] max-w-xl shrink-0">
              <h1 className="animate-fade-up font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-[3.35rem]">
                Підготовка до НМТ
                <br />
                <span className="text-play">без запару</span>
              </h1>
              <HeroPhoneForm />
            </div>
            <div className="hero-girl animate-fade-up-delay-2 pointer-events-none relative mx-auto w-[min(78vw,20rem)] shrink-0 sm:w-[22rem] md:mx-0 md:w-[26rem] lg:w-[32rem]">
              <Image
                src="/images/hero-guitar-girl.png"
                alt=""
                width={1024}
                height={866}
                priority
                aria-hidden
                className="relative z-[1] h-auto w-full select-none object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="relative z-10 px-5 md:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_rgba(4,21,15,0.1)] md:grid-cols-4">
          {proofs.map((p, i) => (
            <div
              key={p.label}
              className={`px-5 py-6 md:px-6 ${i > 0 ? "border-l border-line" : ""} ${i === 2 ? "border-t md:border-t-0" : ""} ${i === 3 ? "border-t md:border-t-0" : ""} ${i === 1 ? "max-md:border-t-0" : ""} ${i >= 2 ? "max-md:border-t" : ""}`}
            >
              <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {p.value}
                {p.suffix ? <span className="text-base text-forest/35">{p.suffix}</span> : null}
              </p>
              <p className="mt-1 text-sm text-forest/55">{p.label}</p>
            </div>
          ))}
        </div>
      </section>

      <WhySmart />

      {/* Weekly rhythm */}
      <section className="border-b border-[#e2e8f0] bg-[#f4f7fd] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-xs font-bold tracking-[0.24em] text-[#2563eb] uppercase">
            Формат тижня
          </p>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Ось як системна підготовка виглядає у звичайний тиждень
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-forest/70">
            Не список «зробіть щось». На кожен день - конкретний блок і конкретний час.
          </p>

          <div className="mt-9">
            <WeekRhythm />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Підлаштуй під себе",
                d: "Секція, відключення світла, хвороба - зрушуєте день разом з куратором. Тиждень не зривається.",
              },
              {
                t: "Запис того ж дня",
                d: "Пропустили ефір - матеріал уже в кабінеті. Темп зберігається, наздоганяти нема чого.",
              },
              {
                t: "Усе в одному місці",
                d: "Розклад, теорія, картки, домашка й авторський варіант НМТ. Куратор у Telegram сім днів на тиждень.",
              },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                <div className="mb-4 h-1 w-10 rounded-full bg-[#2563eb]" />
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
                  {item.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-forest/70">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a href="#consult-form" className="btn-blue">
              Хочу системну підготовку
              <span aria-hidden className="ml-1.5">
                ›
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="border-y border-line bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide text-teal uppercase">Предмети</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
                Математика та історія України
              </h2>
            </div>
            <p className="text-sm text-forest/55">підписка від 990 ₴ / міс</p>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-16">
            {featuredSubjects.map((s) => (
              <li key={s.name} className="w-[9.5rem] sm:w-[11.5rem]">
                <a href={s.href} className="group block">
                  <span className="relative block aspect-[3/5] overflow-hidden rounded-full shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_rgba(15,23,42,0.22)]">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="184px"
                      className="object-cover saturate-[0.35] contrast-[1.05]"
                    />
                    <span className={`absolute inset-0 ${s.tint} mix-blend-multiply`} />
                    <span className="absolute inset-0 bg-black/10" />
                  </span>
                  <span className="mt-4 block truncate text-sm text-forest/45">{s.name}</span>
                  <span className="mt-0.5 block truncate text-lg font-semibold tracking-tight text-ink">
                    {s.topic}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Teachers */}
      <section id="teachers" className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold tracking-wide text-teal uppercase">Команда</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Викладачі з обличчям і методикою
          </h2>
          <p className="mt-3 max-w-2xl text-forest/70">
            Не анонімний відеокурс - живі люди з досвідом саме НМТ/ЗНО.
          </p>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {teachers.map((t) => (
              <li
                key={t.name}
                className="flex gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-teal/25 hover:shadow-[0_16px_40px_rgba(4,21,15,0.07)]"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] text-sm font-bold ${t.tone}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-teal uppercase">{t.subject}</p>
                  <h3 className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                    {t.name}
                    <span className="ml-2 text-sm font-medium text-forest/40">{t.years}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest/70">{t.note}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{t.highlight}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Included */}
      <section id="results" className="relative overflow-hidden bg-night py-16 text-white md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(192,38,211,0.22),transparent_48%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold tracking-wide text-teal-bright uppercase">Всередині</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Робочий тиждень учня, не «доступ до відео»
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, i) => (
              <li
                key={item.t}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              >
                <span className="font-[family-name:var(--font-display)] text-sm text-teal-bright/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Path */}
      <section id="how" className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold tracking-wide text-teal uppercase">Шлях</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Від точки А до бала на НМТ
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {path.map((step) => (
              <li
                key={step.n}
                className="relative rounded-2xl border border-line bg-white p-6"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl font-semibold text-teal/25">
                  {step.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/65">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Free topics */}
      <section className="border-y border-line bg-mist/70 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-night via-[#2a0a3c] to-violet p-7 text-white md:p-10">
            <div className="grid gap-10 md:grid-cols-[1fr_1.05fr] md:items-center">
              <div>
                <p className="text-sm font-semibold tracking-wide text-teal-bright uppercase">
                  Спробувати
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-[2.1rem]">
                  Демо-тема безкоштовно
                </h2>
                <p className="mt-3 text-white/65">
                  Конспект + тест + запис - щоб зрозуміти формат до підписки.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#consult-form" className="btn-primary">
                    Отримати демо
                  </a>
                  <Link href="/diagnostic" className="btn-ghost">
                    Експрес-діагностика
                  </Link>
                </div>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {freeTopics.map((t) => (
                  <li
                    key={t.topic}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-xs font-semibold tracking-wide text-teal-bright uppercase">
                      {t.subject}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">{t.topic}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold tracking-wide text-teal uppercase">Тарифи</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Прозора підписка за предмет
          </h2>
          <p className="mt-3 max-w-2xl text-forest/70">
            Standard: знижки −50 / −100 / −150 ₴ за 2–4 предмети. Premium: −100 / −200 / −300 ₴.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-7 md:p-8">
              <p className="text-sm font-semibold tracking-wide text-teal uppercase">Standard</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-5xl font-semibold text-ink">
                990 ₴
                <span className="text-lg font-medium text-forest/45"> /міс</span>
              </p>
              <p className="mt-2 text-sm text-forest/60">Системна підготовка в когорті</p>
              <a
                href="#consult-form"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full border border-forest/15 py-3.5 text-sm font-semibold text-forest transition hover:bg-mist"
              >
                Обрати Standard
              </a>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white md:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/20 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold tracking-wide text-amber uppercase">Premium</p>
                  <span className="rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold text-ink">
                    хіт для батьків
                  </span>
                </div>
                <p className="mt-3 font-[family-name:var(--font-display)] text-5xl font-semibold">
                  1490 ₴
                  <span className="text-lg font-medium text-white/40"> /міс</span>
                </p>
                <p className="mt-2 text-sm text-white/55">Персональний куратор + батьківський контроль</p>
                <a href="#consult-form" className="btn-primary mt-7 w-full">
                  Обрати Premium
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-mist/60">
                  <th className="px-5 py-3.5 font-medium text-forest/50">Що входить</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Standard</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Premium</th>
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((row) => (
                  <tr key={row.name} className="border-t border-line">
                    <td className="px-5 py-3.5 text-forest/75">{row.name}</td>
                    <td className="px-5 py-3.5">
                      <Check on={row.s} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Check on={row.p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="border-y border-line bg-mist/70 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-sm font-semibold tracking-wide text-teal uppercase">Відгуки</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
            Історії з цифрами, не «супер курс»
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <li
                key={r.name + r.meta}
                className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(4,21,15,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-[family-name:var(--font-display)] text-4xl leading-none text-teal/20">
                    “
                  </span>
                  {r.score ? (
                    <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal">
                      {r.score}/200
                    </span>
                  ) : null}
                </div>
                <blockquote className="mt-2 text-[15px] leading-relaxed text-ink">{r.quote}</blockquote>
                <footer className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-xs font-bold text-forest">
                    {r.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="text-sm text-forest/50">{r.meta}</p>
                  </div>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            SmartZno vs репетитор vs самостійно
          </h2>
          <div className="mt-8 overflow-hidden overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="bg-mist/70 text-forest/50">
                  <th className="px-5 py-3.5 font-medium"> </th>
                  <th className="px-5 py-3.5 font-semibold text-teal">SmartZno</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Репетитор</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Самостійно</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]} className="border-t border-line">
                    <td className="px-5 py-3.5 font-medium text-ink">{row[0]}</td>
                    <td className="bg-teal/[0.04] px-5 py-3.5 font-medium text-forest">{row[1]}</td>
                    <td className="px-5 py-3.5 text-forest/60">{row[2]}</td>
                    <td className="px-5 py-3.5 text-forest/60">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cohorts */}
      <section className="border-y border-line bg-mist/50 py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-3 md:px-8">
          {[
            { t: "10 клас", d: "Дворічний трек без гонки: фундамент і ранній авторський варіант НМТ." },
            { t: "11 клас", d: "Інтенсиви 3 / 6 / 9 міс. Двері потоків зачиняються за розкладом." },
            { t: "Перескладення", d: "План під слабкі блоки після діагностики - не весь курс з нуля." },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border border-line bg-white p-5">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                {item.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-forest/65">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Часті питання
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-line bg-white px-5 py-4 open:shadow-[0_12px_36px_rgba(4,21,15,0.06)]"
              >
                <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-teal transition group-open:rotate-45 group-open:bg-teal group-open:text-white">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-forest/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-night py-16 text-white md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(192,38,211,0.32),transparent_52%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,197,24,0.14),transparent_46%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Почніть з діагностики - не з «купити одразу»
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
              Заявка або короткий тест у кабінеті. Підкажемо потік під ваш рівень і відповімо в
              Telegram.
            </p>
            <Link
              href="/diagnostic"
              className="mt-6 inline-flex text-sm font-semibold text-amber underline-offset-4 hover:underline"
            >
              Пройти експрес-діагностику →
            </Link>
          </div>
          <div id="consult-form">
            <LeadRequestForm variant="hero" source="landing_footer" />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-night py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-start md:justify-between md:px-8">
          <div>
            <BrandLogo size="footer" />
            <p className="mt-3 max-w-xs text-sm text-white/45">
              Онлайн-підготовка до НМТ для 9–11 класів. Europe/Kyiv.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
            <a href="#subjects" className="hover:text-white">
              Предмети
            </a>
            <a href="#teachers" className="hover:text-white">
              Викладачі
            </a>
            <a href="#pricing" className="hover:text-white">
              Тарифи
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
            <Link href="/cabinet" className="hover:text-white">
              Кабінет
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-xs text-white/30 md:px-8">
          © {new Date().getFullYear()} SmartZno
        </p>
      </footer>
    </main>
  );
}
