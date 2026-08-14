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
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5">
        <BrandLogo />

        <nav className="hidden items-center gap-7 text-sm text-white/80 lg:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cabinet" className="btn-magenta px-4 py-2 text-sm">
            Кабінет
          </Link>
          <a href="#consult-form" className="btn-primary hidden sm:inline-flex">
            Записатися
          </a>
        </div>
      </div>
    </header>
  );
}
