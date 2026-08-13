"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { submitDiagnostic, type DiagnosticResult } from "@/lib/crm";

const SUBJECTS = [
  { id: "ukr", label: "Українська мова" },
  { id: "math", label: "Математика" },
  { id: "history", label: "Історія України" },
  { id: "eng", label: "Англійська" },
  { id: "bio", label: "Біологія" },
  { id: "geo", label: "Географія" },
] as const;

const QUESTIONS = [
  { id: "q1", text: "Відчуваю впевненість у базових темах" },
  { id: "q2", text: "Можу працювати в таймінгу іспиту" },
  { id: "q3", text: "Регулярно розбираю помилки" },
  { id: "q4", text: "Маю чіткий план до травня–червня" },
];

export default function DiagnosticPage() {
  const [subject, setSubject] = useState<string>("math");
  const [grade, setGrade] = useState("11");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const startedAt = useMemo(() => new Date().toISOString(), []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Вкажіть телефон — щоб надіслати результат і заявку команді.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payloadAnswers: Record<string, unknown> = { ...answers, _started: startedAt };
      const data = await submitDiagnostic({
        subject,
        answers: payloadAnswers,
        contact_phone: phone,
        contact_name: name || undefined,
        grade,
        honeypot: honeypot || undefined,
        form_started_at: startedAt,
      });
      setResult(data);
    } catch {
      const correct = Object.values(answers).filter(Boolean).length;
      const score = Math.round((correct / QUESTIONS.length) * 200);
      setResult({
        id: "local_stub",
        subject,
        score,
        percentile: Math.min(99, Math.max(1, Math.round(score / 2))),
        recommended_track: score >= 120 ? "standard" : "foundation",
        offer_segment: score >= 120 ? "standard_cohort" : "demo_then_standard",
      });
      setError("API недоступне — показано локальний розрахунок. Запустіть SmartManager на :8000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest">
            SmartZno
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/cabinet" className="text-forest/70 hover:text-forest">
              Кабінет
            </Link>
            <Link href="/" className="text-forest/70 hover:text-forest">
              На головну
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Безкоштовна експрес-діагностика
        </h1>
        <p className="mt-3 text-forest/75">
          Короткий зріз рівня → бал і трек. Заявка з контактами приходить менеджерам у Telegram.
        </p>

        {result ? (
          <div className="mt-10 border-t border-line pt-8">
            <p className="text-sm uppercase tracking-wide text-teal">Результат</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-5xl font-semibold text-forest">
              {result.score}
              <span className="text-2xl text-forest/50">/200</span>
            </p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-forest/55">Перцентиль</dt>
                <dd className="font-semibold">{result.percentile}</dd>
              </div>
              <div>
                <dt className="text-forest/55">Трек</dt>
                <dd className="font-semibold">{result.recommended_track}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-forest/55">Сегмент офера</dt>
                <dd className="font-semibold">{result.offer_segment}</dd>
              </div>
            </dl>
            {result.telegram_queued && (
              <p className="mt-4 text-sm text-teal">Заявку надіслано команді (Telegram).</p>
            )}
            {error && <p className="mt-4 text-sm text-amber">{error}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cabinet/register"
                className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white"
              >
                Створити кабінет учня
              </Link>
              <Link
                href="/#pricing"
                className="rounded-full border border-forest/25 px-5 py-3 text-sm font-semibold text-forest"
              >
                Дивитись тарифи
              </Link>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="rounded-full border border-forest/25 px-5 py-3 text-sm font-semibold text-forest"
              >
                Пройти ще раз
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-8">
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Предмет</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSubject(s.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      subject === s.id
                        ? "bg-forest text-white"
                        : "border border-line text-forest hover:border-forest/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm">
                <span className="font-semibold text-ink">Імʼя</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Марія"
                  className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-ink">Клас</span>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                >
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-ink">Телефон *</span>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380..."
                  className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                />
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-ink">Самооцінка (так / ні)</legend>
              <ul className="mt-4 space-y-3">
                {QUESTIONS.map((q) => (
                  <li
                    key={q.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3"
                  >
                    <span className="text-sm text-ink">{q.text}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: true }))}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          answers[q.id] === true ? "bg-teal text-white" : "border border-line"
                        }`}
                      >
                        Так
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: false }))}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          answers[q.id] === false ? "bg-ink text-white" : "border border-line"
                        }`}
                      >
                        Ні
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </fieldset>

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

            {error && <p className="text-sm text-amber">{error}</p>}

            <button
              type="submit"
              disabled={loading || Object.keys(answers).length < QUESTIONS.length}
              className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink transition enabled:hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Рахуємо…" : "Отримати результат і залишити заявку"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
