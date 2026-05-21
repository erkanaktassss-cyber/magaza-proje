# MES Üretim Takip Sistemi (On-Premise)

Profesyonel, şirket içi yerel ağda çalışacak MES platformu altyapısı.

## Teknoloji
- Next.js (Frontend)
- Node.js + Express (API)
- PostgreSQL
- Prisma ORM
- Docker Compose
- RBAC (role-based authorization)
- PLC entegrasyonuna hazır servis katmanı (genişletilebilir API)

## Modüller
- Kullanıcı/Yetki, Ürün, Reçete, Üretim Emri, Kazan, Lab QC, İlave, Lab Onay, Dolum, Hattı Canlı Ekran
- Fire/Duruş, Lot-Palet Barkod, Depo Giriş/Çıkış, Dashboard, Raporlama, Sistem Logları

## İş Kuralları
- Lab onayı olmayan ürün için dolum emri açılamaz.
- Lab ilave kararı üretim görevine düşer (`additiveTaskOpen`).
- İlave tamamlanmadan yeniden lab onayı/dolum geçişi olmaz.
- Tüm kritik işlemler `SystemLog` tablosuna kullanıcı-zaman ile yazılır.

## Çalıştırma
```bash
docker compose up --build
```

- UI: http://localhost:3000
- API: http://localhost:4000/health
