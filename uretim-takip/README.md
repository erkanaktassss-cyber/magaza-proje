# Üretim Takip Sistemi (v1)

Bu proje, dolum ve paketleme hatları için **tek bilgisayarda çalışan**, **web tabanlı**, **çok basit kurulumlu** bir üretim takip ekranıdır.

## Özellikler

- Türkçe, koyu temalı ve sade arayüz
- Hat seçimi: `D1-D5` ve `P1-P5`
- Her hat için:
  - günlük hedef
  - anlık gerçekleşen
  - duruş durumu / sebebi
  - vardiya
  - operatör
- Manuel adet artırma
- Barkod simülasyonu ile adet artırma (`+1`)
- Duruş başlat / duruş bitir
- Toplam duruş süresi hesaplama
- Tüm hatları tek ekranda canlı dashboard
- TV için tam ekran modu
- Günlük / vardiya / hat bazlı / duruş sebebi raporu
- CSV dışa aktarma
- Veriler `localStorage` içinde saklanır (veritabanısız kullanım)

## Kurulum (Çok Basit)

### Yöntem 1: Direkt aç
1. `uretim-takip` klasörünü bilgisayara kopyalayın.
2. `index.html` dosyasına çift tıklayın.
3. Tarayıcıda sistem açılır.

### Yöntem 2: Lokal sunucu (önerilir)
> Bu yöntem özellikle TV veya ağdaki başka cihazlardan erişim için daha stabil olur.

1. Terminal açın.
2. Proje klasörüne girin:
   ```bash
   cd uretim-takip
   ```
3. Basit sunucu başlatın (Python yüklüyse):
   ```bash
   python3 -m http.server 8080
   ```
4. Tarayıcıdan açın:
   - `http://localhost:8080`

## Kullanım Akışı

1. **Hat Ekranı** sekmesine geçin.
2. Hat seçin (`D1 ... P5`).
3. Hedef, vardiya ve operatör bilgisini girin.
4. Üretim adetini `+1` veya manuel adet ile artırın.
5. Duruş durumunda sebep seçip `Duruş Başlat` butonuna basın.
6. Duruş bittiğinde `Duruş Bitir` ile süreyi otomatik hesaplatın.
7. **Dashboard** ekranında tüm hatları renkli izleyin.
8. **Rapor** ekranından rapor metni alın veya CSV indirin.

## Notlar

- Gün değiştiğinde sistem yeni güne otomatik geçer.
- Hedef, vardiya ve operatör bilgileri bir sonraki güne taşınır.
- PLC entegrasyonu yoktur; ilk sürüm manuel kullanım içindir.
- Sonraki sürümde SQLite/API entegrasyonu eklenebilir.
