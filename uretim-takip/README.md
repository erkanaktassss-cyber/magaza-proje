# FabrikaOS Pro — Web Tabanlı Fabrika Üretim Yönetim Sistemi

FabrikaOS Pro, dolum ve paketleme hatlarını uçtan uca yönetmek için geliştirilmiş, **tam çalışan**, Türkçe, koyu temalı ve modüler bir üretim yönetim uygulamasıdır.

## Özellikler

- **Ana Dashboard**: Hat kartları, toplam KPI, zayıf hat, kritik FMEA risk sayısı.
- **Hat Yönetimi**: Hat ekleme/düzenleme/silme, tip seçimi (Dolum/Paketleme/Diğer), sıra değiştirme.
- **Üretim Girişi**: Hedef, gerçekleşen, hatalı ürün, vardiya, operatör, barkod kaydı.
  - Kayıtlar tabloya eklenir, düzenlenir/silinir ve dashboard anında güncellenir.
- **Duruş Yönetimi**: Duruş başlat/bitir, planlı-plansız ayrımı, sebep yönetimi ve listeleme.
- **OEE Modülü**: Availability, Performance, Quality, OEE hesapları + günlük/haftalık görünüm.
- **Kaizen**: Öneri ekleme, durum takibi, durum ilerletme/silme ve filtreleme.
- **5S**: Seiri/Seiton/Seiso/Seiketsu/Shitsuke puanlama + skor özeti.
- **FMEA**: Kayıt formu, otomatik RPN, kritik satır vurgusu, düzenleme/silme.
- **Üretim Analiz Motoru**: Veri odaklı mock analiz yanıtları.
- **Entegrasyon Altyapısı**: Manuel/Barkod/Delta HMI-PLC ayarları (IP, Port, Protokol, adresler).
- **Raporlama**: Günlük, haftalık, vardiya, OEE, duruş, Kaizen, FMEA, 5S raporları + CSV/Excel.
- **TV Modu**: Tam ekran ve büyük ekran uyumu.

## Proje Yapısı

```text
uretim-takip/
├── index.html
├── styles.css
├── README.md
└── src/
    ├── app.js
    ├── components/
    │   └── renderers.js
    ├── data/
    │   └── sampleData.js
    ├── services/
    │   ├── aiService.js
    │   ├── integrationService.js
    │   ├── reportService.js
    │   └── storageService.js
    ├── store/
    │   └── state.js
    └── utils/
        ├── format.js
        └── oee.js
```

## Nasıl Çalıştırılır?

### Seçenek 1: Doğrudan aç
`uretim-takip/index.html` dosyasını tarayıcıda açın.

### Seçenek 2: Lokal sunucu (önerilen)
```bash
cd uretim-takip
python3 -m http.server 8080
```
Tarayıcıdan açın: `http://localhost:8080`

## Teknik Notlar

- İlk sürümde veri katmanı `localStorage` kullanır.
- Uygulama açıldığında örnek veriler otomatik yüklenir.
- `Verileri Sıfırla` butonu tüm veriyi örnek başlangıç durumuna döndürür.
- Servis katmanı (services) daha sonra API/DB bağlantısına uygun tasarlanmıştır.
- Tüm event listener kurulumları `DOMContentLoaded` sonrasında yapılır.

## Dosya Bazlı Açıklama

- `index.html`: Tüm modül ekranları, formlar, tablolar ve butonların DOM yapısı.
- `styles.css`: Koyu tema, premium kart/tablo/form stilleri.
- `src/app.js`: Tüm event listener bağlama, CRUD akışları, sayfa geçişleri ve uygulama başlatma.
- `src/components/renderers.js`: Her modülün dinamik render fonksiyonları (dashboard, tablo, özet alanları).
- `src/services/storageService.js`: `localStorage` yükleme/kaydetme/sıfırlama.
- `src/services/aiService.js`: Mevcut üretim, duruş, FMEA, 5S verilerini okuyup analiz üreten motor.
- `src/services/integrationService.js`: Veri kaynağı ayarlarıyla entegrasyon test simülasyonu.
- `src/services/reportService.js`: Rapor üretim, yazdırma ve dışa aktarım.
- `src/store/state.js`: Merkezi state ve subscribe tetikleme altyapısı.
- `src/data/sampleData.js`: Uygulamanın örnek başlangıç verileri.
- `src/utils/oee.js`, `src/utils/format.js`: OEE/RPN/5S ve biçimleme yardımcıları.

## Manuel Test Listesi

- Butonlar
  - Hat Ekle / Düzenle / Sil / Sıralama butonları çalışır.
  - Üretim Verisini Kaydet, kayıt tablosunda Düzenle/Sil çalışır.
  - Duruş Başlat / Duruş Bitir / Sebep Ekle / Sebep Sil çalışır.
  - Kaizen Ekle / Durum İlerle / Sil çalışır.
  - 5S Kaydet çalışır.
  - FMEA Ekle / Düzenle / Sil çalışır.
  - Analiz Çalıştır butonu veri tabanlı yanıt üretir.
  - Ayarları Kaydet / Bağlantı Testi çalışır.
  - Rapor Oluştur / CSV / Excel / Yazdır çalışır.
- Formlar
  - Hat, üretim, duruş sebebi, kaizen, 5S, FMEA ve ayarlar formlarından gelen girdiler state’e ve localStorage’a işlenir.
- Kayıt sistemleri
  - Tüm modül verileri `localStorage` içinde saklanır; sayfa yenilemeden sonra korunur.
  - Dashboard kartları veri değişiminden sonra otomatik güncellenir.
