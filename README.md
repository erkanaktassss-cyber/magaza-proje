# Fabrika Dijital Üretim ve Verimlilik Yönetim Sistemi (MVP)

Türkçe, web tabanlı ve modüler fabrika yönetim sistemi.

## Mimari
- **Frontend:** Next.js (`/frontend`)
- **Backend:** FastAPI (`/backend`)
- **Database:** PostgreSQL
- **Kimlik Doğrulama:** Kullanıcı adı/şifre + JWT + rol alanı
- **Raporlama Hazırlığı:** API katmanı PDF/Excel export için genişletilebilir şekilde kurgulandı

## Modüller (MVP)
1. Üretim emirleri
2. Canlı hat ekranı
3. Duruş takibi
4. Lot/depo hareketleri (palet-raf)
5. Laboratuvar onayı
6. Bakım/arıza
7. Enerji-su izleme
8. Dashboard ve OEE

## Kurulum
### 1) Veritabanı
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/fabrika'
```

### 2) Backend
```bash
uvicorn app.main:app --reload --port 8000
```

### 3) Seed veri
`backend/seed.sql` dosyasını PostgreSQL içinde çalıştırın.

Örnek kullanıcılar (şifre: `demo123`):
- `admin@fabrika.local` (Admin)
- `operator@fabrika.local` (Operatör)

### 4) Frontend
```bash
cd frontend
npm install
API_URL=http://localhost:8000/api npm run dev
```

UI: `http://localhost:3000`

## Örnek API Endpointleri
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET /api/oee`
- `GET/POST /api/production-orders`
- `GET/POST /api/downtimes`
- `POST /api/scrap`
- `GET/POST /api/lab-approvals`
- `GET/POST /api/inventory/moves`
- `GET/POST /api/maintenance/tickets`
- `GET/POST /api/utilities/readings`

## Notlar
- Lab onayı olmayan ürün için doluma izin verme kuralı backend iş kuralı olarak kolayca genişletilebilir şekilde ayrıştırılmıştır.
- TV ekranına uygun büyük kartlar dashboard’da hazırlandı.
