"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { checkStudentSession, clearStudentToken, type StudentMe } from "@/lib/crm";
import { DevTodayBar } from "./DevTodayBar";
import { IconCalendar, IconCard, IconHistory, IconMath, IconMock, IconToday } from "./icons";

const StudentContext = createContext<StudentMe | null>(null);

export function useStudent(): StudentMe {
  const me = useContext(StudentContext);
  if (!me) throw new Error("useStudent має викликатись усередині CabinetShell");
  return me;
}

const nav = [
  { href: "/cabinet", label: "Мій тиждень", Icon: IconToday },
  { href: "/cabinet/calendar", label: "Календар", Icon: IconCalendar },
  { href: "/cabinet/math", label: "Математика", Icon: IconMath },
  { href: "/cabinet/history", label: "Історія", Icon: IconHistory },
  { href: "/cabinet/mocks", label: "Пробні НМТ", Icon: IconMock },
  { href: "/cabinet/subscription", label: "Підписка", Icon: IconCard },
];

function Spinner() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-forest/60">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-teal" />
      <p className="text-sm">Завантажуємо кабінет…</p>
    </div>
  );
}

export function CabinetShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<StudentMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    checkStudentSession().then((session) => {
      if (cancelled) return;
      if (session.status === "anonymous" || session.status === "expired") {
        router.replace("/cabinet/login");
        return;
      }
      if (session.status === "offline") {
        setError(session.message);
        setLoading(false);
        return;
      }
      setMe(session.me);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  function logout() {
    clearStudentToken();
    router.push("/cabinet/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <Spinner />
      </main>
    );
  }

  if (error || !me) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-5 text-center">
        <p className="max-w-md text-forest/80">{error || "Не вдалося завантажити кабінет"}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
          >
            Спробувати ще
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
          >
            Вийти
          </button>
        </div>
      </main>
    );
  }

  const firstName = me.name.split(" ")[0];
  const initials = me.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const attention = me.subscriptions.filter(
    (s) => s.is_overdue || (s.days_until_payment !== null && s.days_until_payment <= 3),
  );

  return (
    <StudentContext.Provider value={me}>
      <main className="min-h-screen bg-paper pb-16">
        <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest"
            >
              SmartZno
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm leading-tight font-semibold text-ink">{firstName}</p>
                <p className="text-xs leading-tight text-forest/50">
                  {me.grade ? `${me.grade} клас` : me.email}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-xs font-bold text-teal">
                {initials || "У"}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-forest/70 transition hover:border-forest/30 hover:text-forest"
              >
                Вийти
              </button>
            </div>
          </div>

          <nav className="mx-auto max-w-6xl px-4 pb-2.5 md:px-6">
            <ul className="hide-scrollbar flex gap-1.5 overflow-x-auto">
              {nav.map((item) => {
                const active =
                  item.href === "/cabinet" ? pathname === "/cabinet" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition ${
                        active
                          ? "bg-forest text-white"
                          : "text-forest/60 hover:bg-mist hover:text-forest"
                      }`}
                    >
                      <item.Icon />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        {attention.length > 0 && pathname !== "/cabinet/subscription" && (
          <div className="mx-auto mt-4 max-w-6xl px-4 md:px-6">
            <Link
              href="/cabinet/subscription"
              className="flex items-center justify-between gap-3 rounded-2xl border border-amber/40 bg-amber-soft/60 px-4 py-3 text-sm text-ink transition hover:border-amber"
            >
              <span>
                {attention.length === 1
                  ? "Одна підписка потребує уваги до оплати"
                  : `${attention.length} підписки потребують уваги до оплати`}
              </span>
              <span className="shrink-0 font-semibold text-teal">Перевірити →</span>
            </Link>
          </div>
        )}

        <DevTodayBar />

        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">{children}</div>
      </main>
    </StudentContext.Provider>
  );
}
