# BIOLIFE Demo E-Ticaret

Bu proje, geliştirme ortamında **PostgreSQL kurulumu gerektirmeden** çalışan Express + EJS tabanlı demo e-ticaret uygulamasıdır. Ürün, kategori, kullanıcı, sepet, demo sipariş ve admin işlemleri varsayılan olarak yerel JSON dosyasında tutulur.

## Hızlı Başlangıç

Proje kök dizininde çalıştırın:

```bash
npm install
npm run dev
```

Ardından tarayıcıdan şu adrese gidin:

```text
http://localhost:3000
```

> PostgreSQL zorunlu değildir. `npm run dev` ilk açılışta `data/store.json` dosyasını otomatik oluşturur ve demo verileri yükler.

## Demo Giriş Bilgileri

### Admin Paneli

- Adres: `http://localhost:3000/admin/login`
- E-posta: `admin@biolife.com`
- Şifre: `Admin1234!`

### Demo Müşteri

- Adres: `http://localhost:3000/login`
- E-posta: `musteri@biolife.com`
- Şifre: `User1234!`

## Çalışan Demo Özellikler

- Ana sayfa açılır.
- Ürünler listelenir.
- Ürün detay sayfaları açılır.
- Sepete ürün ekleme ve sepetten ürün silme çalışır.
- Kayıt ve giriş işlemleri demo olarak çalışır.
- Checkout sırasında demo sipariş oluşturulur.
- Admin panel açılır.
- Admin panelden ürün ekleme, düzenleme ve silme çalışır.
- Admin panelden kategori, sipariş durumu, müşteri, mesaj ve yorum ekranları görüntülenir.

## Yerel JSON Veri Dosyası

Varsayılan veri dosyası:

```text
data/store.json
```

Dosya yoksa uygulama otomatik olarak demo veriyle tekrar oluşturur. Demo veriyi sıfırlamak için:

```bash
npm run db:init
```

`DATA_FILE` ortam değişkeniyle farklı bir JSON dosyası kullanılabilir:

```bash
DATA_FILE=/tmp/biolife-demo.json npm run dev
```

## Komutlar

```bash
npm install       # bağımlılıkları kurar
npm run dev      # geliştirme sunucusunu başlatır
npm start        # uygulamayı başlatır
npm run check    # server dosyasında sözdizimi kontrolü yapar
npm run db:init  # JSON demo verisini sıfırlar/yeniden oluşturur
```

## Notlar

- Sepet verisi oturumda tutulur.
- Admin ve müşteri kayıtları demo amaçlıdır.
- Siparişlerde gerçek ödeme entegrasyonu yoktur; `sandbox` durumları kullanılır.
- PostgreSQL bağımlılıkları kaldırılmıştır; geliştirme için veritabanı servisi başlatmanız gerekmez.
