# Elite Production AI

Next.js + TypeScript tabanlı üretim verimlilik sistemi. Mevcut demo HTML görünümü componentlere ayrıldı ve PostgreSQL/Prisma/JWT altyapısıyla çalışan bir uygulama iskeletine dönüştürüldü.

## Component ayrımı

- `HeroPanel`: premium giriş, CTA ve mini KPI kartları
- `NeuralCore`: animasyonlu şeffaf zekâ çekirdeği
- `SummaryPanel`: yönetici özeti ve OEE KPI alanı
- `LineCards`: canlı üretim hattı kartları
- `WeeklyTrendChart` ve `PerformanceRadar`: SVG grafikler
- `AIAssistant`: API destekli sohbet asistanı
- `AlertsPanel`, `ModulesPanel`: alarm ve modül yapısı
- `AdminTables`: üretim emri, duruş, fire, kalite ve bakım yönetimi tabloları

## Kurulum

```bash
npm install
cp ../.env.example .env
npm run prisma:generate
npm run db:push
npm run prisma:seed
npm run dev
```

## Docker

```bash
docker compose up --build
```

Uygulama: `http://localhost:3000`
Admin: `http://localhost:3000/admin`
Demo kullanıcı: `admin@eliteproduction.ai` / `Admin123!`

## API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/production-orders`
- `GET /api/stops`
- `GET /api/scrap`
- `GET /api/quality`
- `GET /api/maintenance`
- `POST /api/ai/chat`
