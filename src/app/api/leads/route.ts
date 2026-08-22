import { NextResponse } from "next/server";
import { normalizeUaPhone } from "@/lib/phone";

const CRM_API_URL =
  process.env.CRM_API_URL || process.env.NEXT_PUBLIC_CRM_API_URL || "http://localhost:8000";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const phone = normalizeUaPhone(String(body.phone ?? ""));
  if (!phone) {
    return NextResponse.json({ error: "Вкажіть коректний український номер" }, { status: 400 });
  }

  const payload = {
    phone,
    name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : undefined,
    email: typeof body.email === "string" ? body.email : undefined,
    grade: typeof body.grade === "string" ? body.grade : undefined,
    subject_interest: typeof body.subject_interest === "string" ? body.subject_interest : undefined,
    source: typeof body.source === "string" && body.source ? body.source : "landing_hero",
    honeypot: typeof body.honeypot === "string" ? body.honeypot : undefined,
    form_started_at: typeof body.form_started_at === "string" ? body.form_started_at : undefined,
  };

  try {
    const res = await fetch(`${CRM_API_URL}/leads/incoming`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: "Не вдалося надіслати заявку" }, { status: 502 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Немає зв’язку з сервером заявок" }, { status: 502 });
  }
}
