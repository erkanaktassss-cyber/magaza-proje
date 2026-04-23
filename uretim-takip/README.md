# FabrikaOS Pro (React)

Premium koyu temalı, Türkçe, modüler ve **gerçekten çalışan** fabrika üretim yönetim sistemi.

## Kapsam
- Dashboard KPI + hat kartları + TV modu
- Hat yönetimi (ekle/düzenle/sil/sırala)
- Üretim girişi (hedef, gerçekleşen, hatalı, vardiya, operatör)
- Duruş yönetimi + grafikler
- OEE (Availability/Performance/Quality/OEE)
- Kaizen + durum yönetimi
- 5S + radar chart
- FMEA + otomatik RPN
- Üretim Analiz Motoru (veri-temelli mock analiz)
- Entegrasyon ayarları (Manuel/Barkod/Delta HMI-PLC)
- Raporlama (günlük/haftalık/vardiya/OEE/duruş/Kaizen/FMEA/5S + CSV + yazdır)

## Çalıştırma
```bash
cd uretim-takip
npm install
npm run dev
```

## Mimari
```text
src/
  components/
  context/
  data/
  pages/
  services/
  utils/
```

## Veri Katmanı
Tüm modüller localStorage (`fabrika_os_state_v1`) üzerinden çalışır. Uygulama ilk açılışta örnek veriyi yükler.
