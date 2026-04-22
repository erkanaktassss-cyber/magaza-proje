# FabrikaOS — Profesyonel Üretim Yönetim Sistemi

Bu proje; dolum ve paketleme hatları olan fabrikalar için, **gerçek kullanım odaklı**, modüler ve modern bir üretim yönetim panelidir.

## Kapsam

Sistemde aşağıdaki modüller çalışır halde gelir:

1. **Yönetim Paneli**
   - Hat ekleme / düzenleme / silme
   - Dolum / paketleme gruplama
   - Hat başına hedef, gerçekleşen, duruş süresi, son duruş sebebi, verim, OEE, operatör, vardiya
   - TV uyumlu canlı kartlar

2. **OEE Modülü**
   - Availability / Performance / Quality hesaplaması
   - Otomatik OEE yüzdesi
   - Hat bazlı renkli OEE kartları
   - Günlük ve haftalık özet alanı

3. **Duruş Yönetimi**
   - Duruş başlat / bitir
   - Planlı / plansız ayrımı
   - Duruş sebeplerini ekleme / silme
   - En çok duran hatlar ve tekrar eden sebepler

4. **Kaizen Modülü**
   - Çalışan öneri girişi
   - Durum takibi (yeni, değerlendirmede, kabul edildi, reddedildi, uygulandı)
   - Zaman / maliyet / kalite kazanımı alanları
   - Kaizen takip tablosu

5. **5S Modülü**
   - Bölüm bazlı Seiri, Seiton, Seiso, Seiketsu, Shitsuke puan girişi
   - Grafiksel skor görünümü
   - Eksik alan listesi (80 altı)

6. **FMEA Modülü**
   - Proses bazlı hata türü / etkisi / sebebi
   - Şiddet, oluşma, tespit ve otomatik RPN
   - Aksiyon sorumlusu, hedef tarih, durum
   - Risk sıralaması

7. **AI Asistan Modülü**
   - Sistem içi sohbet
   - En zayıf hat, duruş nedenleri, kaizen önceliği, kritik FMEA, düşük 5S gibi sorulara yanıt
   - Demo analiz motoru ile çalışır
   - Kod yapısı gelecekte OpenAI API entegrasyonuna uygundur

8. **Raporlama**
   - Günlük, haftalık, vardiya, OEE, duruş, kaizen, FMEA raporları
   - CSV dışa aktarma

## Teknik Mimari

- Web tabanlı (HTML/CSS/Vanilla JS)
- Veri katmanı: `localStorage` (ilk sürüm için hızlı kurulum)
- Sonradan API/veritabanı bağlantısı için modüler JS fonksiyon yapısı
- Kurulum gerektirmeden çalıştırılabilir

## Klasör Yapısı

```text
uretim-takip/
├── index.html      # Tüm modüllerin bulunduğu ana arayüz
├── styles.css      # Premium koyu tema ve responsive tasarım
├── app.js          # Durum yönetimi, hesaplamalar, raporlar, AI demo motoru
└── README.md       # Kurulum ve kullanım dokümantasyonu
```

## Çalıştırma (Adım Adım)

### Yöntem 1 — Dosyayı doğrudan aç
1. `uretim-takip` klasörüne girin.
2. `index.html` dosyasını çift tıklayarak tarayıcıda açın.

### Yöntem 2 — Lokal sunucu (önerilir)
1. Terminal açın.
2. Klasöre geçin:
   ```bash
   cd uretim-takip
   ```
3. Basit sunucu başlatın:
   ```bash
   python3 -m http.server 8080
   ```
4. Tarayıcıdan açın:
   ```
   http://localhost:8080
   ```

## Kullanım Başlangıcı

1. **Yönetim Paneli** sekmesinden hatlarınızı ekleyin.
2. Hat kartlarında hedef, gerçekleşen, operatör, vardiya ve sağlam ürün alanlarını doldurun.
3. **Duruş Yönetimi** ekranından duruş başlatıp bitirin.
4. **OEE Modülü**nden performansı takip edin.
5. **Kaizen**, **5S** ve **FMEA** ekranları ile iyileştirme kültürünü yönetin.
6. **AI Asistan** ekranında yönetim soruları sorun.
7. **Raporlama** ekranından rapor oluşturun ve CSV dışa aktarın.

## Notlar

- Bu sürüm tek istasyon/tek tarayıcı kullanımına uygundur.
- Veriler tarayıcı localStorage içinde tutulur.
- Kurumsal yayında bir sonraki adım, merkezi DB + kullanıcı yetkilendirme entegrasyonudur.
