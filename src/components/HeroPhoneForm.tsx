"use client";

import { useMemo, useState } from "react";
import { submitLead } from "@/lib/crm";
import { formatUaPhone } from "@/lib/phone";

type Props = {
  source?: string;
};

export function HeroPhoneForm({ source = "landing_hero" }: Props) {
  const startedAt = useMemo(() => new Date().toISOString(), []);
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
      await submitLead({
        phone,
        source,
        honeypot: honeypot || undefined,
        form_started_at: startedAt,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося надіслати. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="animate-fade-up mt-10 max-w-md">
        <p className="text-sm text-play/90">Дякуємо. Передзвонимо найближчим часом.</p>
        <TelegramBotLink className="mt-5" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="animate-fade-up-delay-1 mt-10 max-w-md">
      <p className="text-lg leading-snug text-white/70 sm:text-xl">
        Залиште номер телефону
      </p>
      <div className="mt-4 flex items-end gap-3">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Телефон</span>
          <span className="flex items-baseline gap-2 border-b border-white/20 pb-2 transition focus-within:border-play/80">
            <span className="shrink-0 text-sm text-white/40">+380</span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(formatUaPhone(e.target.value))}
              placeholder="XX XXX XX XX"
              inputMode="tel"
              autoComplete="tel"
              className="w-full bg-transparent text-[0.95rem] tracking-wide text-white outline-none placeholder:text-white/25"
            />
          </span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mb-1 shrink-0 text-sm font-semibold text-play transition hover:text-white disabled:opacity-50"
        >
          {loading ? "…" : "Надіслати"}
        </button>
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
      {error ? <p className="mt-2 text-xs text-amber">{error}</p> : null}
      <TelegramBotLink className="mt-6" />
    </form>
  );
}

function TelegramBotLink({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-lg leading-snug text-white/70 sm:text-xl">Або напишіть нам у Telegram</p>
      <a
        href="https://t.me/SmartZNO_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-white/85 transition hover:text-play sm:text-lg"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M21.5 3.3 18.3 20.6c-.24 1.07-.87 1.33-1.76.83l-4.87-3.59-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96L17.9 6.4c.4-.35-.09-.55-.62-.2L6.4 12.9 1.6 11.4c-1.04-.32-1.06-1.04.22-1.58L20.08 2.4c.87-.32 1.63.2 1.42.9Z" />
        </svg>
        SmartZNO_bot
      </a>
    </div>
  );
}
