import Link from "next/link";

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-night md:hidden">
      <div className="flex gap-2 p-3">
        <a href="#consult-form" className="btn-primary flex-1">
          Записатися
        </a>
        <Link
          href="/diagnostic"
          className="flex-1 rounded-full border border-white/25 py-3 text-center text-sm font-semibold text-white"
        >
          Тест онлайн
        </Link>
      </div>
    </div>
  );
}
