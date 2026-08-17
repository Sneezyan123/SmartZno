import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const nav = [
  { href: "#subjects", label: "Предмети" },
  { href: "#teachers", label: "Викладачі" },
  { href: "#pricing", label: "Тарифи" },
  { href: "#reviews", label: "Відгуки" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="animate-header-in fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-night/95 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <BrandLogo />

        <nav className="hidden items-center gap-1 text-sm text-white/65 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cabinet" className="btn-magenta py-2">
            Кабінет
          </Link>
          <a href="#consult-form" className="btn-primary hidden py-2 sm:inline-flex">
            Записатися
          </a>
        </div>
      </div>
    </header>
  );
}
