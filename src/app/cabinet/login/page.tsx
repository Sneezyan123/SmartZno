"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStudentToken, studentLogin } from "@/lib/crm";

export default function CabinetLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("pupil@smartzno.com");
  const [password, setPassword] = useState("pupil123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getStudentToken()) router.replace("/cabinet");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await studentLogin(email, password);
      router.push("/cabinet");
    } catch {
      setError("Невірний email або пароль. API має бути на :8000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-5">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-forest">
            SmartZno
          </Link>
          <Link href="/cabinet/register" className="text-sm text-forest/70 hover:text-forest">
            Реєстрація
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">Вхід учня</h1>
        <p className="mt-2 text-sm text-forest/70">
          Демо: <code className="text-teal">pupil@smartzno.com</code> / <code className="text-teal">pupil123</code>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="font-semibold text-ink">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-ink">Пароль</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            />
          </label>
          {error && <p className="text-sm text-amber">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Входимо…" : "Увійти"}
          </button>
        </form>
      </div>
    </main>
  );
}
