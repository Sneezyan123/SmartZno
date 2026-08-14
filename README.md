# SmartZno Land

Маркетинговий сайт + lead-magnets (діагностика) для підготовки до НМТ.

Окремий репозиторій. Sibling-проєкти:

| Репо | GitHub | Порт |
|---|---|---|
| **SmartZno Land** (цей) | [Sneezyan123/SmartZno](https://github.com/Sneezyan123/SmartZno) | 3000 |
| **SmartZno Manager** (CRM) | [Sneezyan123/SmartZno_Manager](https://github.com/Sneezyan123/SmartZno_Manager) | 3001 |
| **SmartManager** API | sibling `smartmanager-backend` | 8000 |

Повний brief: [SMARTZNO_ECOSYSTEM_PROMPT.md](./SMARTZNO_ECOSYSTEM_PROMPT.md)

## Відмінність від SmartCode

Не 1-на-1 sales-слот і не prepaid пакети уроків. Primary: діагностика / демо / підписка за предмет / когорти / Parent+Student / куратор SLA 24h.

## Run

```bash
copy .env.example .env.local
npm install
npm run dev
```

Діагностика: http://localhost:3000/diagnostic → `POST` на SmartManager `/diagnostics/attempts` (+ Telegram).

Кабінет учня: http://localhost:3000/cabinet  
Демо: `pupil@smartzno.com` / `pupil123`

Заявка з лендінгу (#consult) → `POST /leads/incoming` → Telegram.

## Sitemap лендінгу (§13)

1. Hero + proof + dual CTA  
2. Для кого (10 / 11 / перескладення)  
3. Предмети  
4. Як працює  
5. Що всередині  
6. Pricing Standard/Premium  
7. Результати / відгуки  
8. vs репетитор  
9. FAQ  
10. Sticky CTA  

## Env

Див. `.env.example` — `CRM_API_URL`, LMS Mongo stubs, HMAC.
