# SmartZno — повний промпт екосистеми

> Єдиний brief для створення репозиторію / продукту **SmartZno** (підготовка до НМТ в Україні).
> Об’єднує: (1) інженерний патерн SmartCode, (2) економіку ринку НМТ, (3) UX/marketing бестпрактиси KEVIN, ZNOHUB, ЯвКурсі, Піфагор, Атмосферна.

Скопіюй цей файл у новий чат Cursor як системне завдання: *«Реалізуй SmartZno за цим промптом»*.

---

## 0. Місія продукту

**SmartZno** — технологічна екосистема масової підготовки до НМТ/ЗНО:
ліди з реклами → діагностика / вебінар / демо → підписка за предмет → когорта + куратор → рекурентні платежі → mock НМТ → вступ.

**Не клонувати** бренд/контент SmartCode чи конкурентів. Клонувати **архітектурний патерн** і **ринкові бестпрактиси**.

Мова UI: українська. Код/ідентифікатори: англійська. Timezone операцій: Europe/Kyiv.

---

## 1. Чим SmartZno відрізняється від SmartCode

| SmartCode (IT-школа) | SmartZno (НМТ) |
|---|---|
| Індивідуальне безкоштовне ПУ 1-на-1 | Діагностика / вебінар / демо / калькулятор бала |
| Вільний календар ІУ + невеликі ГУ | **Когорти/потоки** до травня–червня |
| Prepaid пакети уроків + квитанції | **Підписка / міс за предмет** + автоблок LMS |
| Один профіль «учень» | **Parent + Student** (B2C2C) |
| Менеджер + викладач | + **куратор** (ДЗ SLA ≤24 год) |
| Відносно чисті ліди | Жорсткий **spam filter** на ingest |
| Проста атрибуція | UTM → paid → **CAC/LTV**, cross-sell MRR |

**Залишаємо зі SmartCode:** 3 продукти, дві Mongo DB, HTTP+API-key sync, Google Calendar (для ефірів), Telegram student channel, ads labels/affiliates, background workers + distributed locks, CRM не блокує UI на зовнішніх API.

**Викидаємо як core:** sales через індивідуальний безкоштовний слот викладача; prepaid «пакети уроків» як єдина модель.

---

## 2. Ринкові обмеження (обов’язково)

1. Середній чек ~**900–1500+ грн/міс за предмет** → час викладача на 1-на-1 sales неекономний.
2. Верх воронки = Meta / TikTok / відкриті форми / розіграші → багато сміттєвого трафіку.
3. Жорсткий дедлайн навчання: **травень–червень**.
4. Рішення купує **батько**, продукт споживає **підліток**.
5. Retention тримає **куратор** і система контролю прогресу, не лише «живий ефір».
6. Гроші = мікротранзакції + рекурент + часті cross-sell 2–3 предмети.

---

## 3. Бестпрактиси сайтів лідерів ринку

Джерела спостережень: **KEVIN**, **ZNOHUB**, **ЯвКурсі**, **Піфагор**, **Атмосферна**.

### 3.1 Trust / Hero
- 3–4 proof-метрики: `N учнів` · `середній бал X/200` · `середній приріст +Y` · `N × 200 балів`.
- Відгуки учнів **і** батьків; before→after бали; кейси бюджетного вступу.
- Порівняльна таблиця: **школа vs репетитор vs самостійно** (ціна / контроль / програма / підтверджений результат).

### 3.2 Сегментація на лендінгу
- Окремі шляхи: **10 клас (2 роки)**, **11 клас (3/6/9 міс)**, **перескладення НМТ**.
- Предметні хаби (окремі URL під SEO): укр / мат / історія / англ / біо / гео.

### 3.3 Lead-magnets (замість sales-ПУ 1-на-1)
1. **Експрес-діагностика** + повний **mock НМТ** у UI як на іспиті → автобал → сегмент офера.
2. **Калькулятор конкурсного бала** (предмети × коефіцієнти × університет).
3. **Профорієнтаційна консультація** (мета вступу → університети → предмети).
4. **Демо-доступ 3–5 (або до 14) днів** + перше ДЗ куратору.
5. **Масовий вебінар** / запис реального заняття (trust без витрат 1-на-1 викладача).
6. Опційно: короткий **груповий** пробний урок — НЕ індивідуальний sales-слот.

### 3.4 Pricing UX
- Прозора підписка `/міс за предмет`, тарифи **Standard / Premium**.
- Знижки за multi-subject (2/3/4 предмети) — cross-sell у прайсі.
- Premium: персональний куратор, батьківський кабінет + SMS/звіти, AI-аналітика, гейміфікація.
- Diia / податковий кешбек 18% — якщо юридично релевантно.
- Scarcity когорт: «двері груп зачиняються»; окремий набір 10 vs 11.

### 3.5 Product story («що всередині»)
- Живі заняття + записи (адаптація до відключень світла).
- Особистий кабінет учня (розклад, ДЗ, тести, прогрес).
- Конспекти / шпори / Quizlet-картки.
- База тестів по темах + робота над помилками.
- Щомісячні імітації НМТ у реальному інтерфейсі + таймінг.
- Групи за рівнем.
- Підтримка викладача/куратора в Telegram.
- Батьківський кабінет.
- Мобільний web/app.

### 3.6 Content / SEO
- Блог: бали для бюджету, розбір предметів, лайфхаки НМТ.
- FAQ: записи, кілька предметів, пропуск уроку, світло/інтернет.

---

## 4. Три продукти (репозиторії)

Монорепо або 3 репо — на старті допустимий monorepo `smartzno/` з apps:

```
smartzno/
  apps/
    web/          # сайт + LMS (Next.js, Vercel)
    manager/      # CRM UI + Mini App shell (Next.js, Vercel)
    api/          # CRM API + workers (FastAPI, Railway)
  packages/       # shared types/contracts (опційно)
  SMARTZNO_ECOSYSTEM_PROMPT.md
  README.md
```

### 4.1 `apps/web` — сайт + LMS
**Stack:** Next.js (App Router) + TypeScript + Tailwind + MongoDB + Vercel.

**Відповідальність:**
- Marketing + lead-magnets (діагностика, calc, вебінари, демо).
- Кабінет учня: модулі, відео, ДЗ, дедлайни, тести, mock НМТ UI, прогрес, коїни.
- Parent portal (read-only прогрес/оплати) **або** глибокі Email/Viber звіти.
- Оплати LiqPay/Monobank + рекурент; fail → автоблок доступу.
- Affiliate cabinet; Meta Pixel/CAPI + TikTok.
- Окрема Mongo DB LMS (не змішувати з CRM).

### 4.2 `apps/manager` — CRM UI
**Stack:** Next.js + TypeScript + Tailwind; proxy `/crm/*` → API; Vercel.

**Модулі:**
- Ліди (+ quarantine / spam score)
- Діагностики (бали, сегменти офера)
- Вебінари (реєстрації, attended, дожим)
- Демо-доступи
- Parents + Students (зв’язок)
- Когорти / потоки
- Куратори (ліміти, навантаження, SLA ДЗ)
- Підписки / платежі / failed / MRR
- Cross-sell
- Ads attribution (UTM → paid), CAC vs LTV
- Розклад ефірів когорт + статус Google sync
- Команда, логи, огляд

**Ролі JWT CRM:** `admin` | `sales_manager` | `curator_lead` | `targetologist`.

### 4.3 `apps/api` — CRM API + workers
**Stack:** Python 3 + FastAPI + Motor + Pydantic Settings + Railway (uvicorn).

**DB:** Mongo `smartzno_crm`.

**Принцип правди:**
- CRM = ліди, гроші, когорти, куратори, атрибуція, операційний розклад ефірів.
- LMS = навчальний контент, прогрес, демо-доступ, block/unblock.
- Зв’язок лише HTTP + `x-api-key` (без спільної схеми БД).
- Лінк: `students.smartzno_user_id` ↔ LMS `user.profile.crmStudentId` (аналог SmartCode).

---

## 5. Воронка (продуктова)

```
Ads / organic
    → Lead ingest (spam filter + UTM)
        ├─ Calculator / career consult
        ├─ Diagnostic / mock NMT → score → offer segment
        ├─ Webinar registration (Telegram bot)
        └─ Demo access 3–5d → first HW to curator
             → Paid subscription (subject × month, Standard|Premium)
                  → Cohort enroll (level + start date) + curator assign
                       → Live classes + monthly mocks + parent reports
                            → Renew / dunning / LMS block on fail
                                 → Cross-sell next subject
```

### Lead magnets як first-class entities
1. `DiagnosticTestAttempt` — subject, answers, score, percentile, recommended_track, utm_*.
2. `Webinar` + `WebinarRegistration` — topic, starts_at, tg_user_id, attended, replay_watched.
3. `DemoAccess` — student_id, course_ids, starts_at, ends_at, first_hw_submitted_at, converted_at.
4. `CompetitionScoreCalculatorLead` — inputs, result universities, captured contact.

**НЕ робити** calendar slot «безкоштовне ПУ з викладачем» як основний sales motion.

---

## 6. Дані: B2C2C і ключові колекції CRM

### Parent_Entity
- phone, email, viber_id
- marketing consent, billing profile, payment methods
- отримує: звіти успішності, billing reminders, nurture (Viber/Email)

### Student_Entity
- grade (9/10/11), subjects interests, telegram_id, lms_user_id
- gamification balance, deadlines, schedule notifications (Telegram)
- `primary_parent_id` / `parent_ids[]`

### Інші ключові колекції
- `leads` (+ utm, quarantine_score, status)
- `diagnostic_attempts`
- `webinars`, `webinar_registrations`
- `demo_accesses`
- `subscriptions` — student_id, parent_id (payer), subject, plan (standard|premium), price_month, status (`trialing|active|past_due|blocked|cancelled`), cohort_id, curator_id, utm snapshots (first_touch / last_touch / at_purchase)
- `cohorts` — name, subject, level, start_date, exam_window, capacity, schedule_template, teacher_ids, google_calendar_id
- `staff` — teacher / curator / manager / admin; zoom_url; capacity_limit; google calendar ids
- `homework_submissions`, `feedbacks` — due_at, reviewed_at, sla_hours=24, breach_bool
- `mock_nmt_sessions` — real UI timing, score, error analytics
- `payment_ledger` / invoices
- `ad_funnel_labels`, `ad_spend`, `affiliates`
- `google_sync_jobs`, `crm_locks`, `crm_logs`, `crm_settings`
- Telegram: sessions, conversations, messages, bindings

**Правила:**
- Один Parent → N Students.
- Один Student → кілька subject-підписок (cross-sell) без дублювання в MRR (MRR = sum active subscriptions).
- Не змішувати Parent і Student в одній сутності.

---

## 7. Когорти (замість вільного ІУ-календаря)

- Після оплати: автозарахування в актуальну когорту (дата старту + предмет + рівень з діагностики).
- Capacity + «закриття дверей» після контрольних зрізів перших тижнів.
- Генерація ефірів потоку + sync у **Google Calendar викладачів** (операційний розклад, не sales).
- Individual tutoring — лише дорогий upsell, не core funnel.

---

## 8. Куратори + SLA

- `capacity_limit`, auto-assign нових paid учнів за найменшим load.
- ДЗ з демо і з платної підписки.
- Feedback SLA = **24 години**; дашборд breaches; алерти `curator_lead`.
- Premium план пріоритетно отримує персонального куратора.

---

## 9. Фінанси

- Monthly charge per subject via payment gateway webhooks (`paid|failed|refunded`).
- Dunning retries → CRM ініціює **LMS block** без менеджера; успішна оплата → unblock.
- Cross-sell: додавання subject-підписки; коректний MRR/audit.
- Realtime CAC/LTV: UTM на ліда зберегти до first paid і наступних renewals; dashboards by channel/creative.
- Опційно: юридичний модуль «гарантія вступу» (договір) — не обіцяти в UI без моделі.

---

## 10. Spam protection на ingest

На `POST /leads/incoming` і всі public webhooks:
- HMAC/signature + rate limit (IP / phone / tg_id)
- phone/email normalize, disposable email block
- honeypot + time-to-submit
- scoring → `quarantine` vs main pipeline
- dedupe by phone/telegram before Parent/Student create

---

## 11. Інтеграції

| Інтеграція | Призначення |
|---|---|
| Google Calendar SA | Ефіри когорт для викладачів; reconcile + retry queue |
| Telegram student bot | Розклад, дедлайни, демо, ДЗ, баланс/оплата |
| Telegram webinar bot | Реєстрація / нагадування на ефіри |
| Telegram curator/manager | SLA alerts, inbox, broadcasts |
| Viber / Email | Parent reports + billing |
| LMS ↔ CRM API keys | Grant/block access, enroll, progress hooks |
| Meta + TikTok | Pixel/CAPI + attribution |
| LiqPay / Monobank | Recurring + one-off |

### Google Calendar правила (з досвіду SmartCode)
- Durable retry queue для upsert/delete.
- Auto-reconcile current + N future weeks.
- При зміні викладача ефіру: delete зі старого календаря + create в новому (без stale event id).
- Не ставити важкий LMS sync перед calendar sync у BackgroundTasks — критичні sync стартують одразу (`asyncio.create_task` / перший у черзі).

---

## 12. Background workers

| Worker | Суть |
|---|---|
| Demo expiry + nurture | Закінчення демо → sequence |
| Subscription renew / dunning / LMS block-unblock | Рекурент |
| Curator SLA sweep (hourly) | Breaches 24h |
| Cohort schedule + Google reconcile | Ефіри |
| Diagnostic → offer segment jobs | Автоофер |
| Webinar reminders + no-show nurture | Дожим |
| Attribution rollups (daily) | CAC/LTV |
| Spam quarantine review | Модерація сміття |
| Reminders / engagement | Quiet hours 23–08 Kyiv |
| Distributed locks (`crm_locks`) | Multi-replica safe |

---

## 13. Sitemap лендінгу (MVP web marketing)

1. Hero + proof metrics + dual CTA (діагностика / консультація)
2. Для кого (10 / 11 / перескладення)
3. Предмети (grid → subject hubs)
4. Як працює воронка (діагностика → план → когорта)
5. Що всередині курсу (checklist з §3.5)
6. Pricing Standard/Premium + multi-subject discounts
7. Викладачі / результати / відгуки
8. Порівняння vs репетитор
9. FAQ + блог teaser
10. Sticky CTA: «Пройти діагностику» / «Отримати план»

---

## 14. MVP порядок реалізації

1. Monorepo skeleton + env contracts + health endpoints.
2. Lead ingest + spam filter + UTM.
3. Diagnostic / mock NMT → score webhook → CRM segment.
4. Demo access 3–5d + first HW → curator queue.
5. Subscription Standard/Premium + LMS grant/block.
6. Cohort auto-enroll + live schedule → Google Calendar.
7. Curator auto-assign + SLA 24h.
8. Parent reports (Email/Viber) + student Telegram.
9. Mock NMT simulator + progress charts у кабінетах.
10. Cross-sell pricing + CAC/LTV dashboards.
11. Webinar funnel.

---

## 15. Explicit non-goals (на старті)

- Не клонувати SmartCode «ПУ слот у календарі вчителя» як головний sales.
- Не prepaid «пакети уроків» як єдина модель — primary = monthly per subject.
- Не змішувати Parent і Student.
- Не будувати Zoom API — лише stored meeting URL.
- Не обіцяти гарантію вступу без юридичного модуля.
- Не shared Mongo між LMS і CRM.

---

## 16. Якість інженерії

- Production-ready код, без зайвих abstractions.
- Зовнішні API (Google/LMS/Telegram/Payments) — фон + retry; CRM UI не зависає.
- Київський timezone для розкладу, renewals, quiet hours.
- Логи/audit критичних дій (оплати, block/unblock, assign curator).
- Спочатку end-to-end thin slice, потім масштабування модулів.

---

## 17. Перша відповідь агента (коли стартуєш імплементацію)

1. Підтвердити розуміння відмінностей від SmartCode.
2. Запропонувати дерево monorepo + ERD колекцій + env map.
3. Запропонувати sitemap лендінгу з блоками §13.
4. Почати skeleton: `apps/api` health+auth stubs, `apps/manager` nav shell, `apps/web` landing+diagnostic stub.
5. Не роздувати scope поза MVP §14 без запиту.

**Стартове завдання:**  
«Збудуй SmartZno за `SMARTZNO_ECOSYSTEM_PROMPT.md`: спочатку план (репо/ERD/API/env), потім skeleton lead → diagnostic → demo → pay → cohort → curator.»
