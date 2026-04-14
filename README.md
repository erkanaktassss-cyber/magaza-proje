# BIOLIFE Full-Stack E-Ticaret Sistemi

Bu proje, demo vitrin yaklaşımından çıkarılıp **gerçek backend + veritabanı + admin paneli** olan çalışır bir e-ticaret sistemine dönüştürülmüştür.

## Kullanılan Teknoloji

- Node.js + Express.js
- EJS (SSR frontend)
- PostgreSQL
- express-session + PostgreSQL session store
- bcrypt (şifreleme)

## Özellikler

### Müşteri tarafı
- Ana sayfa
- Ürünler sayfası (kategori filtreli)
- Ürün detay sayfası
- Yorum gönderme (admin onaylı)
- Sepet
- Checkout (sandbox ödeme akışı)
- Kayıt / giriş
- Hakkımızda
- İletişim formu (veritabanına kayıt)

### Admin paneli
- Admin giriş ekranı
- Dashboard
- Ürün ekle / düzenle / sil
- Kategori yönetimi
- Siparişleri listeleme
- Sipariş durumu güncelleme
- Müşteri listesi
- İletişim mesajları listeleme
- Yorumları onaylama / silme

## Veritabanı tabloları
- users
- categories
- products
- orders
- order_items
- reviews
- contact_messages
- session

## Kurulum (Yerel)

1. Bağımlılıkları kur:
   ```bash
   npm install
   ```
2. Ortam dosyasını oluştur:
   ```bash
   cp .env.example .env
   ```
3. PostgreSQL başlat (Docker):
   ```bash
   docker compose up -d
   ```
4. Şemayı oluştur:
   ```bash
   npm run db:init
   ```
5. Seed verisini yükle:
   ```bash
   npm run db:seed
   ```
6. Uygulamayı çalıştır:
   ```bash
   npm run dev
   ```
7. Tarayıcı:
   - Site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## Demo giriş bilgileri

### Admin
- E-posta: `admin@biolife.com`
- Şifre: `Admin1234!`

### Test müşteri
- E-posta: `musteri@biolife.com`
- Şifre: `User1234!`

## Notlar

- Checkout, ödeme sağlayıcısı entegrasyonuna hazır bir **sandbox** akışla siparişi veritabanına kaydeder.
- Siparişler doğrudan admin panelinde görüntülenir ve durumları güncellenebilir.
