# Biolife Atelier - Premium E-Ticaret Altyapısı

Biolife Atelier; parfüm, parfüm esansı, doğal sabun, el yapımı sabun, doğal krem, dudak balmı, aromaterapi, mum, epoksi hediyelik ürünler ve üretim ekipmanları için hazırlanmış çok kategorili premium bir Next.js e-ticaret projesidir.

## Teknoloji

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- React client state ile demo sepet, favori ve admin işlemleri
- SEO uyumlu metadata ve ürün detay sayfaları

## Öne Çıkan Modüller

- Premium ana sayfa: hero, kategori vitrinleri, çok satanlar, yeni gelenler, parfüm koleksiyonu, doğal bakım, üretim malzemeleri, kampanyalar, marka hikayesi ve WhatsApp hızlı sipariş alanı
- Ürün listeleme: arama, kategori filtresi, stok filtresi ve fiyat sıralama
- Ürün kartları: görsel alan, kategori, fiyat, indirimli fiyat, stok, sepete ekle, WhatsApp ile sor ve favori
- Ürün detay: varyasyonlar ve kategoriye özel teknik alanlar
  - Parfüm: koku ailesi, üst/orta/alt nota, cinsiyet, kalıcılık, kullanım zamanı, benzer koku tipi
  - Sabun/doğal ürün: içerik, cilt tipi, gramaj, kullanım şekli, uyarılar
  - Kalıp/ambalaj: malzeme türü, ölçü, uyumlu ürünler, paket içeriği
- Sepet: kapıda ödeme, havale/EFT ve online ödeme entegrasyonuna hazır ödeme seçimi
- Üyelik ve misafir siparişi için hazır ekranlar
- Kargo takip ekranı
- Admin paneli: dashboard, toplam satış, bekleyen siparişler, stok azalan ürünler, en çok satan ürünler, ürün ekleme, kategori ekleme, ürün silme, stok düşürme, sipariş durumu değiştirme, müşteri listesi ve kupon oluşturma

## Demo Ürünler

Projede aşağıdaki demo ürünler hazır gelir:

1. Savage Erkek Parfüm 50 ml
2. Labella Kadın Parfüm 50 ml
3. Amber Oud Unisex Parfüm 50 ml
4. Doğal Zeytinyağlı Sabun 100 gr
5. Lavantalı El Yapımı Sabun
6. Hindistan Cevizi Dudak Balmı
7. Shea Butter Doğal Krem
8. Silikon Sabun Kalıbı
9. 50 ml Parfüm Şişesi
10. Epoksi Kolye Kalıbı

## Kurulum

Aşağıdaki komutları proje kök dizininden çalıştırın:

```bash
cd frontend
npm install
npm run dev
```

Tarayıcıdan aşağıdaki adrese gidin:

```text
http://localhost:3000
```

## Üretim Build

```bash
cd frontend
npm run build
npm run start
```

## Faydalı Sayfalar

- Ana sayfa: `http://localhost:3000`
- Ürünler: `http://localhost:3000/products`
- Admin paneli: `http://localhost:3000/admin`
- Sepet: `http://localhost:3000/cart`
- Üyelik: `http://localhost:3000/account`
- Kargo takip: `http://localhost:3000/tracking`

## Geliştirme Notları

Bu sürüm profesyonel satış altyapısına hazırlanmış ön yüz ve demo yönetim deneyimi sunar. Gerçek kullanıma geçişte önerilen sonraki adımlar:

- Ürün, kategori, sipariş ve müşteri verilerini PostgreSQL gibi kalıcı veritabanına bağlamak
- Admin işlemlerini API route veya ayrı backend üzerinden yetkilendirmek
- Online ödeme sağlayıcısı entegrasyonu eklemek
- WhatsApp numarasını `frontend/lib/data.ts` içindeki `whatsappNumber` değerinden güncellemek
- Görsel alanlarını gerçek ürün fotoğraflarıyla değiştirmek
- Kargo firması API entegrasyonunu takip sayfasına bağlamak
