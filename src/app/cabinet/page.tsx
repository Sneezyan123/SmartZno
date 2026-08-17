"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearStudentToken,
  getStudentToken,
  studentMe,
  type StudentMe,
  type StudentSubscription,
} from "@/lib/crm";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Kyiv",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function daysLabel(days: number | null, overdue: boolean) {
  if (days === null) return "дата невідома";
  if (overdue || days < 0) return `прострочено на ${Math.abs(days)} дн.`;
  if (days === 0) return "оплата сьогодні";
  if (days === 1) return "залишився 1 день";
  if (days < 5) return `залишилось ${days} дні`;
  return `залишилось ${days} днів`;
}

function statusLabel(status: StudentSubscription["status"]) {
  const map: Record<StudentSubscription["status"], string> = {
    trialing: "Пробний період",
    active: "Активна",
    past_due: "Прострочена оплата",
    blocked: "Заблоковано",
    cancelled: "Скасована",
  };
  return map[status];
}

export default function CabinetPage() {
  const router = useRouter();
  const [me, setMe] = useState<StudentMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStudentToken()) {
      router.replace("/cabinet/login");
      return;
    }
    studentMe()
      .then(setMe)
      .catch(() => {
        setError("Не вдалося завантажити кабінет");
        router.replace("/cabinet/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    clearStudentToken();
    router.push("/cabinet/login");
  }

  if (loading || !me) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper text-forest/70">
        {error || "Завантаження…"}
      </main>
    );
  }

  const urgent = me.subscriptions.filter(
    (s) => s.is_overdue || (s.days_until_payment !== null && s.days_until_payment <= 7),
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-white/10 bg-night/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            SmartZno
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-forest/70 sm:inline">{me.name}</span>
            <button type="button" onClick={logout} className="text-forest/70 hover:text-forest">
              Вийти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
        <p className="text-sm uppercase tracking-wide text-teal">Кабінет учня</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink md:text-4xl">
          Привіт, {me.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-forest/70">
          {me.grade ? `${me.grade} клас · ` : ""}
          {me.email}
        </p>

        {urgent.length > 0 && (
          <div className="mt-8 border-l-4 border-amber bg-amber-soft/60 px-4 py-3 text-sm text-ink">
            Увага: {urgent.length}{" "}
            {urgent.length === 1 ? "підписка потребує" : "підписки потребують"} уваги до оплати.
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
            Підписки
          </h2>
          <p className="mt-1 text-sm text-forest/70">Скільки днів залишилось до наступної оплати.</p>

          <ul className="mt-6 space-y-4">
            {me.subscriptions.map((sub) => (
              <li key={sub.id} className="border-t border-line pt-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{sub.subject_label}</h3>
                    <p className="mt-1 text-sm text-forest/65">
                      {sub.plan === "premium" ? "Premium" : "Standard"} · {sub.price_month} ₴/міс ·{" "}
                      {statusLabel(sub.status)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-[family-name:var(--font-display)] text-2xl font-semibold ${
                        sub.is_overdue || (sub.days_until_payment !== null && sub.days_until_payment <= 3)
                          ? "text-amber"
                          : "text-forest"
                      }`}
                    >
                      {sub.days_until_payment === null
                        ? "—"
                        : sub.is_overdue || sub.days_until_payment < 0
                          ? `−${Math.abs(sub.days_until_payment)}`
                          : sub.days_until_payment}
                      <span className="ml-1 text-base font-medium text-forest/50">дн.</span>
                    </p>
                    <p className="mt-1 text-xs text-forest/60">
                      {daysLabel(sub.days_until_payment, sub.is_overdue)}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-forest/50">Наступна оплата</dt>
                    <dd className="font-medium">{formatDate(sub.next_payment_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-forest/50">Статус доступу</dt>
                    <dd className="font-medium">
                      {sub.status === "blocked" || sub.status === "past_due"
                        ? "Обмежено до оплати"
                        : sub.status === "trialing"
                          ? "Демо / trial"
                          : "Відкрито"}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          {me.subscriptions.length === 0 && (
            <p className="mt-6 text-sm text-forest/70">
              Поки немає підписок.{" "}
              <Link href="/diagnostic" className="text-teal underline">
                Пройдіть діагностику
              </Link>
              .
            </p>
          )}
        </section>

        <section className="mt-14 border-t border-line pt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink">
            Навчання
          </h2>
          <p className="mt-1 text-sm text-forest/70">Курси, доступні у твоєму кабінеті.</p>
          <ul className="mt-6 space-y-3">
            <li>
              <Link
                href="/cabinet/courses/math"
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-4 transition hover:border-teal/40"
              >
                <div>
                  <p className="font-semibold text-ink">НМТ Математика 2027</p>
                  <p className="mt-1 text-sm text-forest/60">
                    Теорія · картки · ДЗ · план тижня · пробні 60 хв
                  </p>
                </div>
                <span className="text-teal">→</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-lg font-semibold text-ink">Що далі</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cabinet/courses/math"
              className="rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white"
            >
              Відкрити курс математики
            </Link>
            <Link
              href="/cabinet/courses/math/placement"
              className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
            >
              Діагностика старту
            </Link>
            <Link
              href="/cabinet/courses/math/plan"
              className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
            >
              План тижня
            </Link>
            <Link
              href="/cabinet/courses/math/parent"
              className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
            >
              Звіт батькам
            </Link>
            <Link
              href="/#pricing"
              className="rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest"
            >
              Тарифи
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
