import Link from "next/link";

const nav = [
  { href: "#subjects", label: "Предмети" },
  { href: "#teachers", label: "Викладачі" },
  { href: "#pricing", label: "Тарифи" },
  { href: "#reviews", label: "Відгуки" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto max-w-6xl px-5 pt-4 md:px-8 md:pt-5">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-md sm:px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-bright to-teal text-sm font-extrabold text-ink">
              SZ
            </span>
            <span className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-white md:text-lg">
                SmartZno
              </span>
              <span className="hidden text-[11px] text-white/45 sm:block">школа НМТ</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cabinet"
              className="rounded-full border border-white/20 px-3.5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Кабінет
            </Link>
            <a href="#consult-form" className="btn-primary hidden sm:inline-flex">
              Записатися
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
