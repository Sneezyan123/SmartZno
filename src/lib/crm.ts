const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL || process.env.CRM_API_URL || "http://localhost:8000";

const STUDENT_TOKEN_KEY = "smartzno_student_token";

export type DiagnosticResult = {
  id: string;
  subject: string;
  score: number;
  percentile: number;
  recommended_track: string;
  offer_segment: string;
  telegram_queued?: boolean;
};

export type LeadResult = {
  id: string;
  status: string;
  quarantine_score: number;
  phone: string;
  telegram_queued?: boolean;
};

export type StudentSubscription = {
  id: string;
  subject: string;
  subject_label: string;
  plan: string;
  price_month: number;
  status: "trialing" | "active" | "past_due" | "blocked" | "cancelled";
  next_payment_at: string | null;
  current_period_end: string | null;
  days_until_payment: number | null;
  is_overdue: boolean;
};

export type StudentMe = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  grade?: string | null;
  subscriptions: StudentSubscription[];
};

export function getStudentToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STUDENT_TOKEN_KEY);
}

export function setStudentToken(token: string) {
  localStorage.setItem(STUDENT_TOKEN_KEY, token);
}

export function clearStudentToken() {
  localStorage.removeItem(STUDENT_TOKEN_KEY);
}

export async function submitDiagnostic(payload: {
  subject: string;
  answers: Record<string, unknown>;
  contact_phone?: string;
  contact_email?: string;
  contact_name?: string;
  grade?: string;
  honeypot?: string;
  form_started_at?: string;
}): Promise<DiagnosticResult> {
  const res = await fetch(`${CRM_API_URL}/diagnostics/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Не вдалося зберегти діагностику");
  }
  return res.json();
}

export async function submitLead(payload: Record<string, unknown>): Promise<LeadResult> {
  const res = await fetch(`${CRM_API_URL}/leads/incoming`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Не вдалося надіслати заявку");
  }
  return res.json();
}

export async function studentLogin(email: string, password: string) {
  const res = await fetch(`${CRM_API_URL}/students/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Невірний email або пароль");
  const data = await res.json();
  setStudentToken(data.access_token);
  return data as { access_token: string; student_id: string; name: string };
}

export async function studentRegister(payload: {
  email: string;
  password: string;
  name: string;
  phone: string;
  grade: string;
  subject_interest?: string;
  parent_name?: string;
  parent_phone?: string;
}) {
  const res = await fetch(`${CRM_API_URL}/students/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Не вдалося зареєструватись");
  }
  const data = await res.json();
  setStudentToken(data.access_token);
  return data as { access_token: string; student_id: string; name: string };
}

export async function studentMe(): Promise<StudentMe> {
  const token = getStudentToken();
  if (!token) throw new Error("Не авторизовано");
  const res = await fetch(`${CRM_API_URL}/students/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    clearStudentToken();
    throw new Error("Сесію закінчено");
  }
  return res.json();
}
