# FabrikaOS — Profesyonel Fabrika Üretim Yönetim Sistemi

Bu proje, mevcut çalışan üretim paneli korunarak geliştirilmiş; sahada kullanılabilir, Türkçe, kurumsal görünümlü ve modüler bir üretim yönetim uygulamasıdır.

## Öne Çıkan Özellikler

- **Gelişmiş Hat Yönetimi**
  - Hat ekleme / silme / isim düzenleme
  - Hat tipi seçimi: **Dolum / Paketleme / Diğer**
  - Hat bazlı hedef, gerçekleşen, verim, OEE, operatör, vardiya, duruş bilgileri

- **Profesyonel Dashboard**
  - Tüm hatlar tek ekranda
  - Premium kart yapısı ve koyu tema
  - TV ekranı için tam ekran kullanım
  - Canlı operasyon alarm merkezi (düşük verim, aktif duruş, kritik FMEA, düşük 5S)
  - Kritik FMEA riski ve kaizen öncelikli hat alanları

- **OEE Modülü**
  - Availability / Performance / Quality hesaplama
  - Otomatik OEE
  - Günlük / haftalık görünüm anahtarı
  - Günlük OEE listesi + haftalık trend grafik görünümü

- **Duruş Yönetimi**
  - Duruş başlat / bitir
  - Planlı / plansız duruş ayrımı
  - Duruş sebebi ekleme/silme
  - En çok duran hat ve sebep raporları

- **Kaizen Modülü**
  - Öneri ekleme ve takip
  - Durumlar: yeni, incelemede, kabul edildi, reddedildi, uygulandı
  - Zaman / maliyet / kalite kazanımı alanları

- **5S Modülü**
  - Seiri / Seiton / Seiso / Seiketsu / Shitsuke puanlama
  - Grafiksel puan gösterimi
  - Eksik alanların listelenmesi

- **FMEA Modülü**
  - Proses, hata türü/etkisi/sebebi, S/O/D, RPN, sorumlu, hedef tarih, durum
  - Otomatik RPN hesaplama
  - Risk sıralaması ve dashboard kritik risk kutusu

- **Üretim Analiz Motoru (AI Demo)**
  - Animasyonlu, teknolojik analiz paneli
  - Şu sorulara analiz yanıtı üretir:
    - en zayıf hat hangisi
    - en çok duruş nedeni ne
    - hangi hatta kaizen gerekir
    - en kritik FMEA riski ne
    - en düşük 5S puanı hangi bölümde
  - Altyapı ileride gerçek API bağlantısına uygun tutulmuştur.

- **Raporlama**
  - Günlük, vardiya, OEE, duruş, kaizen, FMEA raporları
  - CSV ve Excel dışa aktarma

- **Entegrasyon Ayarları Altyapısı**
  - Veri kaynağı seçimi: Manuel / Barkod / Delta HMI/PLC
  - Delta ayar alanları: IP, Port, Sayaç, Run, Alarm
  - Mock veri akışı simülasyonu

## Başlangıçta Dolu Veri

Uygulama açıldığında boş gelmez:
- Örnek hatlar
- Örnek kaizen kayıtları
- Örnek 5S puanları
- Örnek FMEA riskleri

Bu sayede sistem ilk açılışta gerçek panel hissi verir.

## Teknik Yapı

- Web tabanlı (HTML + CSS + Vanilla JS)
- Veri katmanı: `localStorage`
- Kod modüler servis yapısına ayrılmıştır (data/analytics/report servisleri + ana app).
- Sonradan API/veritabanı entegrasyonuna uygun mimari

## Klasör Yapısı

```text
uretim-takip/
├── index.html
├── styles.css
├── app.js
├── js/
│   ├── data-service.js
│   ├── analytics-engine.js
│   └── report-service.js
└── README.md
```

## Çalıştırma

### Yöntem 1 (Hızlı)
1. `uretim-takip` klasörüne girin.
2. `index.html` dosyasını tarayıcıda açın.

### Yöntem 2 (Önerilir)
```bash
cd uretim-takip
python3 -m http.server 8080
```
Tarayıcı: `http://localhost:8080`

### Yöntem 3 (Repo kökünden tek komut)
```bash
cd ..
npm run fabrika
```
Tarayıcı: `http://localhost:8080`

## Kullanım Sırası Önerisi

1. Dashboard’da hatları düzenleyin.
2. Duruş yönetiminden duruşları izleyin.
3. OEE ekranından performansı kontrol edin.
4. Kaizen, 5S ve FMEA modüllerini kullanarak iyileştirme kültürünü yönetin.
5. Ayarlar ekranından veri kaynağı/Delta parametrelerini hazırlayın.
6. Raporlama ekranından CSV/Excel export alın.
