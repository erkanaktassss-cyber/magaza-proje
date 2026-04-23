export const sampleState = {
  lines: [
    { id: 'l1', name: 'Dolum Hattı A', type: 'Dolum', status: 'running', dailyTarget: 12000, actual: 10300, defect: 120, shift: '1. Vardiya', operator: 'Mehmet Yılmaz', lastDowntimeReason: 'Sensör Kalibrasyon', downtimeTotal: 42, idealCycleSec: 1.2, plannedProductionMin: 480, order: 1 },
    { id: 'l2', name: 'Paketleme Hattı B', type: 'Paketleme', status: 'stopped', dailyTarget: 14000, actual: 9500, defect: 260, shift: '2. Vardiya', operator: 'Selin Kurt', lastDowntimeReason: 'Film Kopması', downtimeTotal: 86, idealCycleSec: 1.4, plannedProductionMin: 480, order: 2 },
    { id: 'l3', name: 'Dolum Hattı C', type: 'Dolum', status: 'running', dailyTarget: 11000, actual: 9800, defect: 90, shift: '3. Vardiya', operator: 'Alper Çetin', lastDowntimeReason: 'Nozul Temizliği', downtimeTotal: 28, idealCycleSec: 1.1, plannedProductionMin: 480, order: 3 }
  ],
  downtimes: [],
  downtimeReasons: ['Mekanik Arıza', 'Malzeme Bekleme', 'Kalibrasyon', 'Film Kopması'],
  kaizens: [
    { id: 'k1', title: 'Etiket sensor konum iyileştirme', status: 'incelemede', area: 'kalite', createdAt: '2026-04-21', description: 'Yanlış hizalama hatalarını düşürme.' }
  ],
  fiveS: [
    { id: 's1', department: 'Dolum Alanı', seiri: 74, seiton: 71, seiso: 79, seiketsu: 68, shitsuke: 72, date: '2026-04-20' }
  ],
  fmea: [
    { id: 'f1', process: 'Dolum', failureMode: 'Eksik dolum', effect: 'Müşteri şikayeti', cause: 'Basınç dalgalanması', severity: 8, occurrence: 6, detection: 5, action: 'Basınç regülasyon planı', owner: 'Bakım', dueDate: '2026-05-05', status: 'açık' }
  ],
  settings: { source: 'Manuel', delta: { ip: '192.168.1.25', port: '502', protocol: 'Modbus TCP', counterAddress: 'D100', runAddress: 'M100', alarmAddress: 'M120' } },
  notifications: [{ id: 'n1', text: 'Paketleme Hattı B duruşta', level: 'warning' }]
};
