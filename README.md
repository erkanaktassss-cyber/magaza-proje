# Biolife Atelier - Premium E-Ticaret Altyapısı

Biolife Atelier; parfüm, parfüm esansı, doğal sabun, el yapımı sabun, doğal krem, dudak balmı, aromaterapi, mum, epoksi hediyelik ürünler ve üretim ekipmanları için hazırlanmış çok kategorili premium bir Next.js e-ticaret projesidir.

## Kurulum ve Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Uygulama açıldıktan sonra tarayıcıdan `http://localhost:3000` adresine gidin.

## Üretim Build

```bash
cd frontend
npm run build
npm run start
```

> Not: `frontend/next.config.js` içinde `output: 'standalone'` açıktır. `npm run start` komutu build sonrası standalone sunucuyu çalıştırır.

## Kullanılan Teknolojiler

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- React client state ile demo sepet, favori ve admin yönetimi
- SEO uyumlu metadata ve statik ürün detay sayfaları

## Sayfalar

- Ana sayfa: `/`
- Ürünler, arama ve filtreleme: `/products`
- Ürün detay: `/products/[slug]`
- Sepet ve ödeme seçenekleri: `/cart`
- Üyelik / misafir akışı: `/account`
- Kargo takip: `/tracking`
- Admin paneli: `/admin`

## Özellikler

- Çok kategorili premium mağaza vitrini
- Büyük ürün görselleri için hızlı yüklenen gradient görsel alanları
- Ürün kartlarında fiyat, indirimli fiyat, stok, favori, sepete ekle ve WhatsApp ile sor aksiyonları
- ml, gram, renk, koku, adet ve boyut varyasyonları
- Parfüm, doğal ürün ve üretim malzemesi türlerine özel ürün detay alanları
- Kampanya/indirim işaretleri
- Kapıda ödeme, havale/EFT ve online ödeme entegrasyonuna hazır checkout alanı
- Admin dashboard, ürün/kategori/sipariş/stok/müşteri/kupon yönetimi ekranları

## Demo Ürünler

- Savage Erkek Parfüm 50 ml
- Labella Kadın Parfüm 50 ml
- Amber Oud Unisex Parfüm 50 ml
- Doğal Zeytinyağlı Sabun 100 gr
- Lavantalı El Yapımı Sabun
- Hindistan Cevizi Dudak Balmı
- Shea Butter Doğal Krem
- Silikon Sabun Kalıbı
- 50 ml Parfüm Şişesi
- Epoksi Kolye Kalıbı

## Gerçek Projeye Geçiş İçin Sonraki Adımlar

- Ürün, kategori, sipariş ve müşteri verilerini PostgreSQL gibi kalıcı veritabanına bağlamak
- Admin işlemlerine kimlik doğrulama ve yetkilendirme eklemek
- Online ödeme sağlayıcısı entegrasyonunu tamamlamak
- Kargo firması API entegrasyonunu takip ekranına bağlamak
- WhatsApp numarasını `frontend/lib/data.ts` içindeki `whatsappNumber` değerinden güncellemek
- Gradient demo görsel alanlarını gerçek ürün fotoğrafları ile değiştirmek
