"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { submitLead } from "@/lib/crm";

type Variant = "hero" | "section";

type Props = {
  variant?: Variant;
  source?: string;
};

export function LeadRequestForm({ variant = "hero", source = "landing_hero" }: Props) {
  const startedAt = useMemo(() => new Date().toISOString(), []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHero = variant === "hero";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const digits = phone.replace(/\D/g, "");
      const normalized =
        digits.startsWith("380") ? `+${digits}` : digits.startsWith("0") ? `+38${digits}` : `+380${digits}`;
      await submitLead({
        name,
        phone: normalized,
        grade: "11",
        subject_interest: "math",
        source,
        honeypot: honeypot || undefined,
        form_started_at: startedAt,
      });
      setDone(true);
    } catch {
      setError("Не вдалося надіслати. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        className={
          isHero
            ? "rounded-2xl border border-teal/30 bg-[#06261c]/95 p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            : "mt-8 max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6"
        }
      >
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold">Заявку отримано</p>
        <p className="mt-2 text-sm text-white/75">
          Менеджер звʼяжеться щодо безкоштовної діагностики. Повідомлення вже в Telegram команди.
        </p>
        <Link href="/diagnostic" className="mt-4 inline-block text-sm font-semibold text-amber hover:underline">
          Або пройти діагностику зараз →
        </Link>
      </div>
    );
  }

  if (isHero) {
    return (
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-white/12 bg-[#06261c]/88 p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal/20 px-3 py-1 text-[11px] font-semibold tracking-wide text-teal-bright uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />
          Безкоштовно · 10 хв
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-snug sm:text-2xl">
          Діагностика рівня НМТ
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Стартовий бал, слабкі теми й рекомендація потоку — без продажного уроку 1-на-1.
        </p>

        <div className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Імʼя</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Марія"
              className="w-full rounded-xl border border-white/12 bg-[#04140f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-teal-bright/60 focus:ring-2 focus:ring-teal/25"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Телефон</span>
            <div className="flex overflow-hidden rounded-xl border border-white/12 bg-[#04140f] transition focus-within:border-teal-bright/60 focus-within:ring-2 focus-within:ring-teal/25">
              <span className="flex items-center border-r border-white/10 px-3 text-sm text-white/55">
                +380
              </span>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="XX XXX XX XX"
                inputMode="tel"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>
          </label>
        </div>

        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        {error && <p className="mt-3 text-sm text-amber">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full disabled:opacity-50">
          {loading ? "Надсилаємо…" : "Залишити заявку"}
        </button>

        <p className="mt-4 text-center text-xs leading-relaxed text-white/40">
          Менеджер напише в Telegram або зателефонує протягом дня.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="text-white/80">Імʼя</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-white/40 focus:border-amber"
          placeholder="Марія"
        />
      </label>
      <label className="block text-sm">
        <span className="text-white/80">Телефон</span>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-white/40 focus:border-amber"
          placeholder="+380..."
        />
      </label>
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-3 pt-1 sm:col-span-2">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Надсилаємо…" : "Записатися на діагностику"}
        </button>
        {error && <p className="text-sm text-amber-soft">{error}</p>}
      </div>
    </form>
  );
}
