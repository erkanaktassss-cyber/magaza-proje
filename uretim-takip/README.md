# FabrikaOS Pro — Web Tabanlı Fabrika Üretim Yönetim Sistemi

FabrikaOS Pro, dolum ve paketleme hatlarını uçtan uca yönetmek için geliştirilmiş, **tam çalışan**, Türkçe, koyu temalı ve modüler bir üretim yönetim uygulamasıdır.

## Özellikler

- **Ana Dashboard**: Hat kartları, toplam KPI, zayıf hat, kritik FMEA risk sayısı.
- **Hat Yönetimi**: Hat ekleme/düzenleme/silme, tip seçimi (Dolum/Paketleme/Diğer), sıra değiştirme.
- **Üretim Girişi**: Hedef, gerçekleşen, hatalı ürün, vardiya, operatör, barkod kaydı.
- **Duruş Yönetimi**: Duruş başlat/bitir, planlı-plansız ayrımı, sebep yönetimi ve listeleme.
- **OEE Modülü**: Availability, Performance, Quality, OEE hesapları + günlük/haftalık görünüm.
- **Kaizen**: Öneri ekleme, durum takibi ve durum filtreleme.
- **5S**: Seiri/Seiton/Seiso/Seiketsu/Shitsuke puanlama + skor özeti.
- **FMEA**: Kayıt formu, otomatik RPN, kritik satır vurgusu.
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
