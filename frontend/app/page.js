import { getHealth } from '../lib/api';

const modules = [
  'Kullanıcı ve yetki yönetimi', 'Ürün kartları', 'Reçete yönetimi', 'Üretim emirleri', 'Kazan yönetimi', 'Lab kalite kontrol',
  'İlave talimatları', 'Lab onay sistemi', 'Dolum emirleri', 'Dolum hattı canlı ekranı', 'Fire ve duruş kayıtları',
  'Lot ve palet barkod sistemi', 'Depo giriş/çıkış', 'Yönetim dashboard', 'Raporlama', 'Sistem logları'
];

const rules = [
  'Lab onayı olmayan ürün doluma açılamaz.',
  'Lab ilave verdiyse üretim görev ekranına düşer.',
  'İlave tamamlanmadan tekrar lab onayı açılamaz.',
  'Dolum emri sadece onaylı ürün için açılır.',
  'Her işlem kullanıcı, tarih ve saat ile loglanır.'
];

export default async function Home() {
  const health = await getHealth().catch(() => ({ ok: false }));
  return (
    <main style={{ padding: 24, fontFamily: 'Arial' }}>
      <h1>MES Üretim Takip Sistemi</h1>
      <p>Durum: {health.ok ? 'API Bağlı' : 'API Ulaşılamıyor'}</p>
      <h2>Modüller</h2>
      <ul>{modules.map((m) => <li key={m}>{m}</li>)}</ul>
      <h2>İş Kuralları</h2>
      <ul>{rules.map((r) => <li key={r}>{r}</li>)}</ul>
      <p>Şirket içi sunucuda Docker Compose ile yayınlanır, tüm PC'ler tarayıcı ile erişir.</p>
    </main>
  );
}
