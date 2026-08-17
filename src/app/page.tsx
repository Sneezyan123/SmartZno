import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ContactFab } from "@/components/ContactFab";
import { LeadRequestForm } from "@/components/LeadRequestForm";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCta } from "@/components/StickyCta";

const subjects = [
  {
    name: "Математика",
    short: "Мат",
    teacher: "Анна",
    price: "від 990 ₴",
    focus: "Формули, таймінг і типові пастки розгорнутих задач",
    icon: "∑",
  },
  {
    name: "Українська мова",
    short: "Укр",
    teacher: "Дарія",
    price: "від 990 ₴",
    focus: "Правила через систему, розбір помилок, які зʼїдають бали",
    icon: "Аа",
  },
  {
    name: "Історія України",
    short: "Іст",
    teacher: "Ілля",
    price: "від 990 ₴",
    focus: "Хронологія й причинно-наслідкові звʼязки замість списків дат",
    icon: "₴",
  },
  {
    name: "Англійська",
    short: "Eng",
    teacher: "Марія",
    price: "від 990 ₴",
    focus: "Граматика, читання й лексика строго під формат НМТ",
    icon: "En",
  },
  {
    name: "Біологія",
    short: "Біо",
    teacher: "Христина",
    price: "від 990 ₴",
    focus: "Від клітини до систем — з акцентом на медвступ",
    icon: "β",
  },
  {
    name: "Географія",
    short: "Гео",
    teacher: "Юлія",
    price: "від 990 ₴",
    focus: "Карти, природа, економіка в логіці тестових блоків",
    icon: "◎",
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
    tone: "bg-violet/30 text-teal-bright",
  },
  {
    name: "Дарія",
    initials: "ДА",
    subject: "Українська мова",
    years: "4 роки",
    note: "Пояснює складні правила просто. Стипендіантка КНУ.",
    highlight: "Фокус на типових помилках",
    tone: "bg-[#2a0a3c] text-teal-bright",
  },
  {
    name: "Ілля",
    initials: "ІЛ",
    subject: "Історія України",
    years: "7 років",
    note: "Автор методики SmartZno. Вчить через логіку епох, не списки.",
    highlight: "12 500+ учнів за карʼєру",
    tone: "bg-amber/15 text-amber",
  },
  {
    name: "Марія",
    initials: "МА",
    subject: "Англійська",
    years: "6 років",
    note: "Філологія та переклад. Стратегії читання під таймер НМТ.",
    highlight: "Середній приріст групи +38",
    tone: "bg-violet/25 text-white",
  },
];

const included = [
  {
    t: "Живі заняття + записи",
    d: "2–3 практикуми на тиждень. Немає світла — урок лишається в кабінеті того ж дня.",
    icon: "▶",
  },
  {
    t: "Особистий кабінет",
    d: "Розклад, ДЗ, конспекти, тести й прогрес — з телефону чи ноутбука.",
    icon: "▣",
  },
  {
    t: "Конспекти й шпори",
    d: "PDF до кожної теми + короткі матеріали для повторення перед mock.",
    icon: "☰",
  },
  {
    t: "Тести по темах",
    d: "Банк формату НМТ, автоперевірка й розбір помилок — не лише «так/ні».",
    icon: "✓",
  },
  {
    t: "Щомісячний mock",
    d: "Імітація з таймінгом. Бачите приріст у балах, а не «відчуття прогресу».",
    icon: "◷",
  },
  {
    t: "Куратор у Telegram",
    d: "Темп, SLA на ДЗ до 24 год і підтримка, якщо потік почав «розʼїжджатися».",
    icon: "✉",
  },
];

const path = [
  { n: "01", t: "Точка А", d: "Діагностика фіксує стартовий бал і теми, що тягнуть результат вниз." },
  { n: "02", t: "Потік", d: "Потрапляєте в групу foundation / standard / premium — без змішування рівнів." },
  { n: "03", t: "Цикл тижня", d: "Запис або ефір → практикум → тести → ДЗ куратору. Ритм до травня." },
  { n: "04", t: "Mock", d: "Щомісячна імітація. Підкручуємо слабкі блоки, а не вчимо «все знову»." },
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
      "Пришла в січні з 118 з математики. За пʼять місяців — 176. Без куратора, який добивав ДЗ, точно б злилася на середині.",
    name: "Марія",
    meta: "11 клас · математика · +58",
    score: "176",
  },
  {
    quote:
      "Як батько бачу прогрес у кабінеті щотижня — нарешті не треба питати «чи вчиш». Дешевше за репетитора, контроль жорсткіший.",
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
  ["Перевірка", "Тести + mock", "«Відчуваю»", "Рідко"],
  ["Батьки", "Кабінет / SMS", "Окремі дзвінки", "Немає"],
  ["Світло", "Записи + офлайн", "Переносять уроки", "Зриває ритм"],
];

const pricingFeatures = [
  { name: "2–3 заняття на тиждень + записи", s: true, p: true },
  { name: "Конспекти, шпори, база тестів", s: true, p: true },
  { name: "Щомісячний mock НМТ", s: true, p: true },
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
    a: "Запис зʼявляється в кабінеті того ж дня. Питання — викладачу або куратору в Telegram.",
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
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet/25 text-xs font-bold text-teal-bright">
      ✓
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center text-muted/40">—</span>
  );
}

export default function HomePage() {
  return (
    <main className="pb-24 md:pb-0">
      <SiteHeader />
      <StickyCta />
      <ContactFab />

      {/* Hero */}
      <section id="consult" className="relative min-h-[100svh] overflow-hidden bg-night text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(192,38,211,0.28),transparent_52%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(124,31,168,0.28),transparent_46%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-[28rem] w-[28rem] rounded-full border border-teal/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 -right-4 h-[18rem] w-[18rem] rounded-full border border-teal/10"
          aria-hidden
        />

        <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-5 pb-16 pt-28 md:grid-cols-2 md:gap-14 md:px-8 md:pb-20 md:pt-28">
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-teal/35 bg-teal/15 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white uppercase">
              <span className="h-2 w-2 rounded-full bg-teal-bright" />
              Онлайн-школа підготовки до НМТ · 9–11 клас
            </p>
            <h1 className="animate-fade-up-delay-1 mt-6 max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.35rem]">
              <span className="text-white">від хаосу репетиторів —</span>
              <br />
              <span className="bg-gradient-to-r from-teal-bright via-[#f0abfc] to-amber bg-clip-text text-transparent">
                до плану на 180+
              </span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-5 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              Діагностика, когорта за рівнем, куратор і щомісячний mock. Підписка від 990 ₴/міс за
              предмет.
            </p>
            <div className="animate-fade-up-delay-3 mt-7 flex flex-wrap gap-2">
              <span className="stat-chip">
                <i />
                12 400+ учнів
              </span>
              <span className="stat-chip">183/200 середній бал</span>
              <span className="stat-chip">+51 приріст</span>
            </div>
            <div className="animate-fade-up-delay-4 mt-8 flex flex-wrap items-center gap-3">
              <a href="#consult-form" className="btn-primary">
                Записатися на діагностику
              </a>
              <Link href="/diagnostic" className="btn-ghost">
                Пройти тест онлайн
              </Link>
            </div>
          </div>

          <div id="consult-form" className="animate-hero-card relative">
            <LeadRequestForm source="landing_hero" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <Reveal>
              <p className="section-kicker">Чому SmartZno</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Система сильніша за «уроки як вийде»
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                На НМТ виграє той, хто тримає темп, перевіряє прогрес і закриває прогалини до травня.
                Ми зібрали це в зрозумілу підписку — для батьків і для учня.
              </p>
            </Reveal>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "183", s: "/200", l: "середній бал" },
                { n: "+51", s: "", l: "приріст" },
                { n: "12k+", s: "", l: "учнів" },
              ].map((m, i) => (
                <Reveal key={m.l} delay={i * 90}>
                  <div className="lift-card px-3 py-4 text-center">
                    <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                      {m.n}
                      <span className="text-sm text-white/40">{m.s}</span>
                    </p>
                    <p className="mt-1 text-[11px] tracking-wide text-muted uppercase">{m.l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Під відключення",
                d: "Записи того ж дня, офлайн-матеріали, гнучкі дедлайни з куратором.",
                icon: "⚡",
              },
              {
                t: "Куратор 7/7",
                d: "Telegram: темп, ДЗ, мотивація перед mock — щоб потік не розʼїхався.",
                icon: "7",
              },
              {
                t: "Mock як іспит",
                d: "Щомісячна імітація з таймером. Приріст у балах, не в відчуттях.",
                icon: "60",
              },
              {
                t: "Батьки в курсі",
                d: "Premium: кабінет і SMS — відвідуваність і слабкі теми без сварок.",
                icon: "◎",
              },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 80}>
                <div className="lift-card p-5">
                  <span className="icon-tile font-[family-name:var(--font-display)] text-sm font-bold">
                    {item.icon}
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="relative border-y border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Предмети</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Окремий план на кожен предмет
              </h2>
            </div>
            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70">
              підписка від <span className="font-semibold text-amber">990 ₴</span> / міс
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s, i) => (
              <li key={s.name}>
                <Reveal delay={i * 70}>
                  <div className="group lift-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="icon-tile font-[family-name:var(--font-display)] text-xs font-bold">
                          {s.icon}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold tracking-wide text-teal-bright uppercase">
                            {s.short}
                          </span>
                          <h3 className="text-lg font-semibold text-ink">{s.name}</h3>
                        </div>
                      </div>
                      <span className="rounded-full border border-amber/25 bg-amber/10 px-2.5 py-1 text-xs font-semibold text-amber">
                        {s.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/45">викладач · {s.teacher}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.focus}</p>
                    <a
                      href="#consult-form"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-bright transition group-hover:gap-2"
                    >
                      Записатися <span aria-hidden>→</span>
                    </a>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Teachers */}
      <section id="teachers" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-kicker">Команда</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Викладачі з обличчям і методикою
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Не анонімний відеокурс — живі люди з досвідом саме НМТ/ЗНО.
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {teachers.map((t, i) => (
              <li key={t.name}>
                <Reveal delay={i * 90}>
                  <div className="lift-card flex gap-4 p-5">
                    <div
                      className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] text-sm font-bold ring-1 ring-white/10 ${t.tone}`}
                    >
                      {t.initials}
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#120816] bg-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-wide text-teal-bright uppercase">
                        {t.subject}
                      </p>
                      <h3 className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                        {t.name}
                        <span className="ml-2 text-sm font-medium text-muted">{t.years}</span>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{t.note}</p>
                      <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80">
                        {t.highlight}
                      </p>
                    </div>
                  </div>
                </Reveal>
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
          <Reveal>
            <p className="section-kicker">Всередині</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Робочий тиждень учня, не «доступ до відео»
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, i) => (
              <li key={item.t}>
                <Reveal delay={i * 70}>
                  <div className="lift-card p-5">
                    <div className="flex items-center justify-between">
                      <span className="icon-tile text-sm">{item.icon}</span>
                      <span className="font-[family-name:var(--font-display)] text-sm text-teal-bright/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{item.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{item.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Path */}
      <section id="how" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-kicker">Шлях</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Від точки А до бала на НМТ
            </h2>
          </Reveal>
          <div className="relative mt-10">
            <div
              className="pointer-events-none absolute top-10 right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent lg:block"
              aria-hidden
            />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {path.map((step, i) => (
                <li key={step.n}>
                  <Reveal delay={i * 90}>
                    <div className="lift-card relative p-6">
                      <span className="font-[family-name:var(--font-display)] text-3xl font-semibold text-teal-bright/40">
                        {step.n}
                      </span>
                      <h3 className="mt-3 text-lg font-semibold text-ink">{step.t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{step.d}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Free topics */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-teal/25 bg-gradient-to-br from-night via-[#2a0a3c] to-violet p-7 text-white shadow-[0_24px_80px_rgba(124,31,168,0.35)] md:p-10">
            <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-amber/20 blur-3xl" aria-hidden />
            <div className="relative grid gap-10 md:grid-cols-[1fr_1.05fr] md:items-center">
              <div>
                <p className="text-sm font-semibold tracking-wide text-teal-bright uppercase">
                  Спробувати
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-[2.1rem]">
                  Демо-тема безкоштовно
                </h2>
                <p className="mt-3 text-white/65">
                  Конспект + тест + запис — щоб зрозуміти формат до підписки.
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
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-kicker">Тарифи</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Прозора підписка за предмет
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Standard: знижки −50 / −100 / −150 ₴ за 2–4 предмети. Premium: −100 / −200 / −300 ₴.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="lift-card rounded-3xl p-7 md:p-8">
              <p className="text-sm font-semibold tracking-wide text-teal-bright uppercase">Standard</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-5xl font-semibold text-ink">
                990 ₴
                <span className="text-lg font-medium text-muted"> /міс</span>
              </p>
              <p className="mt-2 text-sm text-muted">Системна підготовка в когорті</p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li>— 2–3 заняття + записи</li>
                <li>— тести, конспекти, mock</li>
                <li>— куратор у Telegram</li>
              </ul>
              <a
                href="#consult-form"
                className="mt-7 inline-flex w-full items-center justify-center rounded-full border border-white/20 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Обрати Standard
              </a>
            </div>
            </Reveal>
            <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-amber/30 bg-gradient-to-br from-[#2a1238] to-night p-7 text-white md:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/25 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold tracking-wide text-amber uppercase">Premium</p>
                  <span className="rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold text-night">
                    хіт для батьків
                  </span>
                </div>
                <p className="mt-3 font-[family-name:var(--font-display)] text-5xl font-semibold">
                  1490 ₴
                  <span className="text-lg font-medium text-white/40"> /міс</span>
                </p>
                <p className="mt-2 text-sm text-white/55">Персональний куратор + батьківський контроль</p>
                <ul className="mt-6 space-y-2 text-sm text-white/75">
                  <li>— усе зі Standard</li>
                  <li>— кабінет і SMS для батьків</li>
                  <li>— AI-аналітика слабких тем</li>
                </ul>
                <a href="#consult-form" className="btn-primary mt-7 w-full">
                  Обрати Premium
                </a>
              </div>
            </div>
            </Reveal>
          </div>

          <div className="mt-8 overflow-hidden overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-mist/60">
                  <th className="px-5 py-3.5 font-medium text-muted">Що входить</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Standard</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Premium</th>
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((row) => (
                  <tr key={row.name} className="border-t border-line">
                    <td className="px-5 py-3.5 text-muted">{row.name}</td>
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
      <section id="reviews" className="border-y border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-kicker">Відгуки</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Історії з цифрами, не «супер курс»
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {reviews.map((r, i) => (
              <li key={r.name + r.meta}>
                <Reveal delay={i * 80}>
                  <div className="lift-card p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-amber text-sm tracking-widest">★★★★★</span>
                  {r.score ? (
                    <span className="rounded-full border border-teal/30 bg-teal/15 px-2.5 py-1 text-xs font-bold text-teal-bright">
                      {r.score}/200
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/50">
                      батьки
                    </span>
                  )}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">{r.quote}</blockquote>
                <footer className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/25 text-xs font-bold text-teal-bright">
                    {r.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="text-sm text-muted">{r.meta}</p>
                  </div>
                </footer>
              </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-kicker">Порівняння</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              SmartZno vs репетитор vs самостійно
            </h2>
            <div className="mt-8 overflow-hidden overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="bg-mist text-muted">
                  <th className="px-5 py-3.5 font-medium"> </th>
                  <th className="px-5 py-3.5 font-semibold text-violet">SmartZno</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Репетитор</th>
                  <th className="px-5 py-3.5 font-medium text-ink">Самостійно</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]} className="border-t border-line">
                    <td className="px-5 py-3.5 font-medium text-ink">{row[0]}</td>
                    <td className="bg-violet/15 px-5 py-3.5 font-medium text-ink">{row[1]}</td>
                    <td className="px-5 py-3.5 text-muted">{row[2]}</td>
                    <td className="px-5 py-3.5 text-muted">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Cohorts */}
      <section className="border-y border-white/10 py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-3 md:px-8">
          {[
            { t: "10 клас", d: "Дворічний трек без гонки: фундамент і ранній mock." },
            { t: "11 клас", d: "Інтенсиви 3 / 6 / 9 міс. Двері потоків зачиняються за розкладом." },
            { t: "Перескладення", d: "План під слабкі блоки після діагностики — не весь курс з нуля." },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 80}>
              <div className="lift-card p-5">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                  {item.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-kicker">FAQ</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Часті питання
            </h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="group lift-card px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-teal-bright transition group-open:rotate-45 group-open:bg-violet group-open:text-white">
                      +
                    </span>
                  </span>
                </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              </Reveal>
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
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Почніть з діагностики — не з «купити одразу»
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
          </Reveal>
          <Reveal delay={120}>
            <LeadRequestForm compact source="landing_footer" />
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-night py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
          <div>
            <BrandLogo size="footer" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              Онлайн-підготовка до НМТ для 9–11 класів. Europe/Kyiv.
            </p>
            <div className="mt-5 space-y-1.5 text-sm">
              <a href="tel:+380685180000" className="block text-white/80 hover:text-white">
                +380 68 518 00 00
              </a>
              <a
                href="https://t.me/smartZno"
                target="_blank"
                rel="noreferrer"
                className="block text-teal-bright hover:underline"
              >
                Telegram @smartZno
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-white/40 uppercase">Навігація</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/55">
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
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-white/40 uppercase">Кабінет</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/55">
              <Link href="/cabinet" className="hover:text-white">
                Увійти
              </Link>
              <Link href="/diagnostic" className="hover:text-white">
                Діагностика
              </Link>
              <a href="#consult-form" className="hover:text-white">
                Залишити заявку
              </a>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-xs text-white/30 md:px-8">
          © {new Date().getFullYear()} SmartZno
        </p>
      </footer>
    </main>
  );
}
