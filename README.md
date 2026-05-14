# FabrikaOS AI (MVP)

FabrikaOS AI, üretim sahası için ERP + MES + OEE + bakım + kalite süreçlerini tek panelde birleştiren modüler bir MVP platformudur.

## Mimari
- **Frontend:** Next.js (React)
- **Backend:** FastAPI
- **Veritabanı:** PostgreSQL
- **Realtime:** WebSocket (`/ws/production`)
- **Container:** Docker Compose

## MVP Modülleri
- Kullanıcı & roller (Admin, Üretim şefi, Operatör, Bakım, Kalite, Yönetim)
- Üretim hatları canlı görünüm
- Üretim emri oluşturma API
- Duruş kaydı API
- Fire kaydı API
- Dashboard (üretim, fire, duruş, en sık duruş sebebi)
- OEE hesaplama (Availability, Performance, Quality)
- Kurallı AI öneri sistemi

## Kurulum
```bash
docker compose up -d --build
```

## Migration ve Seed
```bash
docker compose exec backend alembic upgrade head
docker compose exec db psql -U factory -d fabrikaos -f /docker-entrypoint-initdb.d/seed.sql
```
> Not: Seed için hızlı yöntem olarak aşağıdaki komut da kullanılabilir:
```bash
docker compose cp backend/seed.sql db:/tmp/seed.sql
docker compose exec db psql -U factory -d fabrikaos -f /tmp/seed.sql
```

## Uygulama Adresleri
- Frontend: http://localhost:3000
- API: http://localhost:8000/docs
- WebSocket: ws://localhost:8000/ws/production

## Demo API Örnekleri
- `GET /api/lines`
- `POST /api/production-orders`
- `POST /api/downtimes`
- `POST /api/scrap`
- `GET /api/dashboard`
- `GET /api/oee`
- `GET /api/ai-recommendations`

## PLC Hazırlığı
Backend katmanı servis + API + realtime ayrımıyla tasarlandı. Gelecekte Modbus TCP / OPC UA collector servisleri eklenerek gerçek zamanlı sinyaller WebSocket kanalına yayınlanabilir.
