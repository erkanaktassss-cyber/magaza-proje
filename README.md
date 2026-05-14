# FabrikaOS AI (MVP)

FabrikaOS AI, üretim sahası için ERP + MES + OEE + bakım + kalite süreçlerini tek panelde birleştiren modüler bir MVP platformudur.

## Mimari
- **Frontend:** Next.js (React)
- **Backend:** FastAPI
- **Veritabanı:** PostgreSQL
- **Realtime:** WebSocket (`/ws/production`)
- **Container:** Docker Compose

## Tek Komutla Çalıştırma
```bash
docker compose up --build
```

Bu komutla:
- PostgreSQL ayağa kalkar
- Backend için migration (`alembic upgrade head`) otomatik çalışır
- Frontend/Backend servisleri başlar

## Uygulama Adresleri
- Frontend Dashboard: http://localhost:3000
- API Dokümantasyon: http://localhost:8000/docs
- WebSocket: ws://localhost:8000/ws/production

## JSON Endpointleri
Aşağıdaki endpointler frontend tarafından JSON olarak tüketilir:
- `GET /api/dashboard`
- `GET /api/oee`
- `GET /api/lines`
- `GET /api/ai`

Geriye dönük uyumluluk için `GET /api/ai-recommendations` de desteklenir.

## Notlar
- Backend erişilemiyorsa frontend otomatik olarak demo/mock veri ile dashboard ekranını açar.
- Böylece hata ekranı yerine kullanıcı her zaman dashboard'u görebilir.
