export type Role = 'ADMIN' | 'MANAGER' | 'OPERATOR';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const demoUser = {
  id: 'demo-admin',
  name: 'Admin Kullanıcı',
  email: 'admin@eliteproduction.ai',
  role: 'ADMIN' as Role,
  password: 'Admin123!'
};

export const miniStats = [
  { label: 'AI Operatör', value: 'Aktif' },
  { label: 'Anlık OEE', value: '82.4%' },
  { label: 'Günlük Üretim', value: '24.860' },
  { label: 'Kritik Alarm', value: '3 Aktif' }
];

export const kpis = [
  { title: 'Toplam OEE', value: '82.4%', sub: 'Haftalık +2.1 puan' },
  { title: 'Fire Oranı', value: '1.9%', sub: 'Hedef 1.5%' },
  { title: 'Duruş Süresi', value: '76 dk', sub: 'Son 24 saat' },
  { title: 'Enerji Yoğunluğu', value: '0.81', sub: 'kWh / birim' }
];

export const productionLines = [
  { id: 'line-filling-1', name: 'Dolum Hattı 1', status: 'Çalışıyor', oee: 84, speed: '2.420 adet/saat', scrap: '%1.8', downtime: '21 dk' },
  { id: 'line-labeling', name: 'Etiketleme Hattı', status: 'Uyarı', oee: 71, speed: '1.930 adet/saat', scrap: '%3.9', downtime: '43 dk' },
  { id: 'line-packaging', name: 'Paketleme Hattı', status: 'Optimum', oee: 89, speed: '2.870 adet/saat', scrap: '%1.1', downtime: '12 dk' }
];

export const productionOrders = [
  { id: 'PO-24061', product: 'Premium Köpüklü Dolum 500 ml', line: 'Dolum Hattı 1', planned: 30000, produced: 24860, good: 24411, scrap: 449, status: 'RUNNING', dueDate: '2026-06-03' },
  { id: 'PO-24062', product: 'Etiketli Seri A', line: 'Etiketleme Hattı', planned: 18000, produced: 12240, good: 11763, scrap: 477, status: 'WARNING', dueDate: '2026-06-03' },
  { id: 'PO-24063', product: 'Koli Paket 12li', line: 'Paketleme Hattı', planned: 9000, produced: 8250, good: 8160, scrap: 90, status: 'RUNNING', dueDate: '2026-06-04' }
];

export const stops = [
  { id: 'ST-101', line: 'Etiketleme Hattı', reason: 'Senkron farkı', minutes: 28, severity: 'HIGH' as Severity, shift: 'A', startedAt: '2026-06-03T07:35:00Z' },
  { id: 'ST-102', line: 'Dolum Hattı 1', reason: 'Köpük stabilizasyonu', minutes: 14, severity: 'MEDIUM' as Severity, shift: 'A', startedAt: '2026-06-03T09:10:00Z' },
  { id: 'ST-103', line: 'Paketleme Hattı', reason: 'Karton besleme', minutes: 8, severity: 'LOW' as Severity, shift: 'B', startedAt: '2026-06-03T11:20:00Z' }
];

export const scrapRecords = [
  { id: 'SC-501', line: 'Etiketleme Hattı', category: 'Etiket kayması', quantity: 312, rate: 3.9, action: 'Sensör hizalama kontrolü' },
  { id: 'SC-502', line: 'Dolum Hattı 1', category: 'Hacim sapması', quantity: 449, rate: 1.8, action: 'Nozul dalma seviyesi revizyonu' },
  { id: 'SC-503', line: 'Paketleme Hattı', category: 'Koli deformasyonu', quantity: 90, rate: 1.1, action: 'Besleme baskı ayarı' }
];

export const qualityChecks = [
  { id: 'QC-711', order: 'PO-24061', metric: 'Dolum hacmi', result: 'Geçti', cpk: 1.42, owner: 'Kalite Ekibi' },
  { id: 'QC-712', order: 'PO-24062', metric: 'Etiket pozisyonu', result: 'Koşullu', cpk: 0.94, owner: 'Hat Lideri' },
  { id: 'QC-713', order: 'PO-24063', metric: 'Koli dayanımı', result: 'Geçti', cpk: 1.31, owner: 'Kalite Ekibi' }
];

export const maintenanceTasks = [
  { id: 'MT-330', asset: 'Dolum Pompası P-01', type: 'Kestirimci', dueInHours: 16, risk: 'Orta', mtbf: '122 saat', mttr: '38 dk' },
  { id: 'MT-331', asset: 'Etiket Servo S-03', type: 'Düzeltici', dueInHours: 4, risk: 'Yüksek', mtbf: '74 saat', mttr: '52 dk' },
  { id: 'MT-332', asset: 'Paketleme Konveyörü C-02', type: 'Planlı', dueInHours: 36, risk: 'Düşük', mtbf: '210 saat', mttr: '24 dk' }
];

export const alerts = [
  { title: 'Köpük kaynaklı dolum sapması', text: 'Dolum başında hacim dalgalanması tespit edildi. Nozul daldırma ve bekleme süresi kontrol edilmeli.', severity: 'Yüksek' },
  { title: 'Planlı bakım yaklaşımı', text: 'Dolum pompası için 16 saat içinde bakım öneriliyor. Verim düşüşü %6 seviyesinde.', severity: 'Orta' },
  { title: 'Hurda artış eğilimi', text: 'Etiketleme hattında son 3 vardiyada fire oranı hedefin üstünde.', severity: 'Orta' }
];

export const modules = [
  { title: 'Canlı Hat İzleme', text: 'Makine, hız, duruş ve sayaç verileri' },
  { title: 'AI Kök Neden Analizi', text: 'Sorunların nedenini yorumlar' },
  { title: 'Bakım Tahmini', text: 'Arıza öncesi uyarı ve bakım zamanı' },
  { title: 'Kalite / Fire Takibi', text: 'Hurda ve tekrar işleme analizi' }
];

export const weeklyTrend = [72, 76, 82, 75, 88, 79, 91];
export const targetTrend = [83, 83, 85, 85, 87, 86, 87];

export function aiReply(text: string) {
  const t = text.toLocaleLowerCase('tr-TR');
  if (t.includes('köpük')) return 'Köpük kaynaklı dolum problemi için ilk bakılacak noktalar: ürün sıcaklığı, karıştırma devri, bekleme tankı süresi, nozul dalma seviyesi ve dolum başlangıç gecikmesi. En hızlı iyileştirme için ilk 20 şişeyi ayrı takip edip dolum başlangıç stabilitesini ölç.';
  if (t.includes('oee') || t.includes('verim')) return 'Verim kaybının ana kaynağı kısa duruşlar ve hız düşüşü görünüyor. Önce mikro duruş sayımını başlat, sonra vardiya bazında ilk 30 dakika ayar kayıplarını ayrı raporla. Bu iki alan toparlanırsa OEE artışı daha hızlı gelir.';
  if (t.includes('bakım') || t.includes('arıza')) return 'Bakım tarafında önerim: plansız duruş veren ekipmanları kritik listede topla, MTBF ve MTTR takibi ekle, operatör kaynaklı arızaları ayrı kodla. Böylece gerçek mekanik problem ile kullanım hatasını ayırırsın.';
  if (t.includes('fire') || t.includes('kalite')) return 'Kalite ve fire için lot bazlı takip, vardiya bazlı hata kodu ve ilk ürün onayı sürecini dijital hale getirmek gerekir. En büyük kazanç, tekrar eden hata sebebini standart kategoriye bağlamaktan gelir.';
  return 'Demo AI cevabı: Gerçek sürüm ERP, sensör, PLC, kalite formu ve vardiya kayıtlarını Prisma/PostgreSQL üzerinden okuyarak canlı yorum verecek şekilde yapılandırıldı.';
}

export const dashboard = {
  miniStats,
  kpis,
  productionLines,
  productionOrders,
  stops,
  scrapRecords,
  qualityChecks,
  maintenanceTasks,
  alerts,
  modules,
  weeklyTrend,
  targetTrend
};
