"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { studentRegister } from "@/lib/crm";

export default function CabinetRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("11");
  const [subject, setSubject] = useState("math");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await studentRegister({
        name,
        email,
        phone,
        password,
        grade,
        subject_interest: subject,
        parent_name: parentName || undefined,
      });
      router.push("/cabinet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка реєстрації");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-5">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            SmartZno
          </Link>
          <Link href="/cabinet/login" className="text-sm text-forest/70 hover:text-forest">
            Увійти
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
          Кабінет учня
        </h1>
        <p className="mt-2 text-sm text-forest/70">
          Створіть акаунт — одразу зʼявиться пробна підписка з відліком до оплати.
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ink">Імʼя учня</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field mt-2 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ink">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field mt-2 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-ink">Телефон</span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380..."
              className="field mt-2 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-ink">Пароль</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field mt-2 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-ink">Клас</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="field mt-2 px-3 py-2.5"
            >
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-ink">Предмет інтересу</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="field mt-2 px-3 py-2.5"
            >
              <option value="math">Математика</option>
              <option value="ukr">Українська</option>
              <option value="history">Історія</option>
              <option value="eng">Англійська</option>
              <option value="bio">Біологія</option>
              <option value="geo">Географія</option>
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-ink">Імʼя батька/матері (опційно)</span>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="field mt-2 px-3 py-2.5"
            />
          </label>
          {error && <p className="sm:col-span-2 text-sm text-amber">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 rounded-full bg-amber px-5 py-3 text-sm font-semibold text-night disabled:opacity-50"
          >
            {loading ? "Створюємо…" : "Створити кабінет"}
          </button>
        </form>
      </div>
    </main>
  );
}
