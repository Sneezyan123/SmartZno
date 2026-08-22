"use client";

import Link from "next/link";
import type { StudentSubscription } from "@/lib/crm";
import { useStudent } from "./CabinetShell";

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

export function SubscriptionClient() {
  const me = useStudent();

  return (
    <div>
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-ink md:text-3xl">
          Підписка
        </h1>
        <p className="mt-2 text-forest/65">
          {me.name}
          {me.grade ? ` · ${me.grade} клас` : ""} · {me.email}
        </p>
      </header>

      {me.subscriptions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white/60 px-5 py-10 text-center">
          <p className="font-semibold text-forest/70">Поки немає активних підписок</p>
          <Link
            href="/diagnostic"
            className="mt-3 inline-flex rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white"
          >
            Пройти діагностику
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {me.subscriptions.map((sub) => {
            const urgent =
              sub.is_overdue || (sub.days_until_payment !== null && sub.days_until_payment <= 3);
            return (
              <li key={sub.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">{sub.subject_label}</h2>
                    <p className="mt-1 text-sm text-forest/60">
                      {sub.plan === "premium" ? "Premium" : "Standard"} · {sub.price_month} ₴/міс
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      urgent ? "bg-amber-soft text-ink" : "bg-mist text-teal"
                    }`}
                  >
                    {statusLabel(sub.status)}
                  </span>
                </div>

                <p
                  className={`mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold ${
                    urgent ? "text-amber" : "text-forest"
                  }`}
                >
                  {sub.days_until_payment === null
                    ? "—"
                    : sub.is_overdue || sub.days_until_payment < 0
                      ? `−${Math.abs(sub.days_until_payment)}`
                      : sub.days_until_payment}
                  <span className="ml-1 text-base font-medium text-forest/45">дн.</span>
                </p>
                <p className="mt-1 text-xs text-forest/55">
                  {daysLabel(sub.days_until_payment, sub.is_overdue)}
                </p>

                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-forest/50">Наступна оплата</dt>
                    <dd className="font-medium text-ink">{formatDate(sub.next_payment_at)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-forest/50">Доступ</dt>
                    <dd className="font-medium text-ink">
                      {sub.status === "blocked" || sub.status === "past_due"
                        ? "Обмежено до оплати"
                        : sub.status === "trialing"
                          ? "Демо / trial"
                          : "Відкрито"}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="text-sm font-semibold text-ink">Що далі</h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <Link
            href="/diagnostic"
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest/30"
          >
            Нова діагностика
          </Link>
          <Link
            href="/#pricing"
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest/30"
          >
            Тарифи
          </Link>
        </div>
      </section>
    </div>
  );
}
