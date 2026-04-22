# FabrikaOS Pro — Profesyonel Üretim Yönetim Sistemi

FabrikaOS Pro; dolum ve paketleme hatları olan tesislerde **gerçek kullanım odaklı üretim yönetimi** için tasarlanmış, modüler ve koyu tema kurumsal web panelidir.

## Ana Modüller

- Ana Dashboard (hat kartları, üst KPI özetleri, kritik listeler)
- Hat Yönetimi (ekle, sil, sırala, grupla)
- Üretim Girişi (hedef, gerçekleşen, fire, kalite, vardiya, operatör, barkod)
- Duruş Yönetimi (başlat/bitir, planlı/plansız, sebep yönetimi, geçmiş + Pareto benzeri listeler)
- OEE Modülü (Availability, Performance, Quality, OEE + trend)
- Kaizen Modülü (öneri, durum, kazanım alanları, liste)
- 5S Modülü (bölüm bazlı puanlama + not)
- FMEA Modülü (RPN otomatik hesaplama, kritik risk vurgusu)
- Üretim Analiz Motoru (AI-ready analiz paneli, mock analiz yanıtları)
- Entegrasyon/Ayarlar (Manuel, Barkod, Delta HMI/PLC Modbus TCP hazırlığı)
- Raporlama (günlük özet, CSV export, Excel export, yazdırma)

## Mimarî

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

- Veri katmanı: localStorage (ilk sürüm)
- Geleceğe hazırlık: servis katmanı sayesinde DB/API entegrasyonuna uygun
- AI-ready: mock motor + gerçek API takılabilecek yapı

## Kurulum

### 1) Basit kullanım
`uretim-takip/index.html` dosyasını tarayıcıda açın.

### 2) Lokal sunucu (önerilen)

```bash
cd uretim-takip
python3 -m http.server 8080
```

Tarayıcı:
- http://localhost:8080

## Notlar

- Uygulama açıldığında örnek verilerle dolu gelir.
- "Verileri Sıfırla" ile örnek veri başlangıcına dönülür.
- Delta PLC alanı mock test verir; gerçek sürücü entegrasyonu için `services/integrationService.js` genişletilir.
- AI motoru mock cevap üretir; gerçek OpenAI API bağlantısı için `services/aiService.js` içerisine HTTP katmanı eklenebilir.
