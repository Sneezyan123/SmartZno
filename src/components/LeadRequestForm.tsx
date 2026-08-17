"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { submitLead } from "@/lib/crm";

type Props = {
  source?: string;
  compact?: boolean;
};

export function LeadRequestForm({ source = "landing_hero", compact = false }: Props) {
  const startedAt = useMemo(() => new Date().toISOString(), []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="hero-card p-7 text-white">
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

  return (
    <form onSubmit={onSubmit} className="hero-card overflow-hidden text-white">
      {!compact && (
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-teal-bright uppercase">
              Mock НМТ · математика
            </p>
            <p className="mt-0.5 text-xs text-white/50">типовий прогрес за 5 місяців · +58 балів</p>
          </div>
          <div className="flex items-baseline gap-2 font-[family-name:var(--font-display)]">
            <span className="text-lg text-white/40">118</span>
            <span className="text-white/30">→</span>
            <span className="text-2xl font-semibold">176</span>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-teal-bright uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" />
          Безкоштовно · 10 хв
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-snug sm:text-[1.35rem]">
          Діагностика рівня{" "}
          <span className="text-teal-bright">НМТ</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Стартовий бал, слабкі теми й рекомендація потоку.
        </p>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/55">Імʼя</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Марія"
              className="w-full rounded-xl border border-white/12 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-teal-bright/70 focus:ring-2 focus:ring-teal/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/55">Телефон</span>
            <div className="flex overflow-hidden rounded-xl border border-white/12 bg-black/35 transition focus-within:border-teal-bright/70 focus-within:ring-2 focus-within:ring-teal/20">
              <span className="flex items-center border-r border-white/10 px-3 text-sm text-white/60">+380</span>
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

        <p className="mt-3.5 text-center text-xs leading-relaxed text-white/40">
          Менеджер напише в Telegram або зателефонує протягом дня.
        </p>
      </div>
    </form>
  );
}
