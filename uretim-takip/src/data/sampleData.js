export const SAMPLE_STATE = {
  meta: {
    plantName: 'Marmara İçecek Üretim Tesisi',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  },
  settings: {
    dataSource: 'manual',
    barcodePrefix: '869',
    delta: {
      ip: '192.168.1.35',
      port: 502,
      protocol: 'Modbus TCP',
      counterAddress: '40001',
      runAddress: '00001',
      alarmAddress: '10001'
    },
    ai: {
      provider: 'mock',
      openAiBaseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4.1-mini'
    }
  },
  downtimeReasons: [
    'Mekanik arıza',
    'Malzeme bekleme',
    'Kalite kontrol bekleme',
    'Operatör değişimi',
    'Planlı bakım',
    'Temizlik / CIP'
  ],
  lines: [
    {
      id: 'line_dolum_a',
      name: 'Dolum Hattı A',
      type: 'dolum',
      group: 'Gazlı İçecek',
      order: 1,
      shift: '1. Vardiya',
      operator: 'Hakan Yılmaz',
      status: 'running',
      dailyTarget: 24000,
      actual: 19850,
      defect: 420,
      barcode: '8691234567001',
      idealCycleSec: 0.95,
      plannedProductionMin: 480,
      downtime: {
        totalMin: 38,
        active: null,
        logs: [
          {
            id: 'stop_1',
            reason: 'Malzeme bekleme',
            type: 'plansiz',
            startAt: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
            endAt: new Date(Date.now() - 1000 * 60 * 231).toISOString(),
            durationMin: 19
          },
          {
            id: 'stop_2',
            reason: 'Temizlik / CIP',
            type: 'planli',
            startAt: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
            endAt: new Date(Date.now() - 1000 * 60 * 151).toISOString(),
            durationMin: 19
          }
        ]
      },
      oeeHistory: [73, 75, 78, 76, 80, 81, 79]
    },
    {
      id: 'line_dolum_b',
      name: 'Dolum Hattı B',
      type: 'dolum',
      group: 'Meyve Suyu',
      order: 2,
      shift: '2. Vardiya',
      operator: 'Elif Demir',
      status: 'stopped',
      dailyTarget: 18000,
      actual: 11620,
      defect: 390,
      barcode: '8691234567002',
      idealCycleSec: 1.1,
      plannedProductionMin: 480,
      downtime: {
        totalMin: 92,
        active: {
          id: 'stop_active_1',
          reason: 'Mekanik arıza',
          type: 'plansiz',
          startAt: new Date(Date.now() - 1000 * 60 * 14).toISOString()
        },
        logs: [
          {
            id: 'stop_3',
            reason: 'Mekanik arıza',
            type: 'plansiz',
            startAt: new Date(Date.now() - 1000 * 60 * 290).toISOString(),
            endAt: new Date(Date.now() - 1000 * 60 * 252).toISOString(),
            durationMin: 38
          },
          {
            id: 'stop_4',
            reason: 'Operatör değişimi',
            type: 'planli',
            startAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
            endAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
            durationMin: 20
          }
        ]
      },
      oeeHistory: [68, 66, 64, 62, 63, 60, 57]
    },
    {
      id: 'line_pack_a',
      name: 'Paketleme Hattı A',
      type: 'paketleme',
      group: 'Shrink',
      order: 3,
      shift: '1. Vardiya',
      operator: 'Sena Kılıç',
      status: 'running',
      dailyTarget: 22000,
      actual: 17610,
      defect: 180,
      barcode: '8691234567003',
      idealCycleSec: 1.02,
      plannedProductionMin: 480,
      downtime: {
        totalMin: 45,
        active: null,
        logs: [
          {
            id: 'stop_5',
            reason: 'Kalite kontrol bekleme',
            type: 'plansiz',
            startAt: new Date(Date.now() - 1000 * 60 * 185).toISOString(),
            endAt: new Date(Date.now() - 1000 * 60 * 162).toISOString(),
            durationMin: 23
          }
        ]
      },
      oeeHistory: [72, 74, 76, 74, 77, 78, 79]
    },
    {
      id: 'line_pack_b',
      name: 'Paketleme Hattı B',
      type: 'paketleme',
      group: 'Koli',
      order: 4,
      shift: '3. Vardiya',
      operator: 'Mert Akın',
      status: 'idle',
      dailyTarget: 20000,
      actual: 15240,
      defect: 350,
      barcode: '8691234567004',
      idealCycleSec: 1.15,
      plannedProductionMin: 480,
      downtime: {
        totalMin: 61,
        active: null,
        logs: [
          {
            id: 'stop_6',
            reason: 'Malzeme bekleme',
            type: 'plansiz',
            startAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
            endAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            durationMin: 30
          }
        ]
      },
      oeeHistory: [70, 69, 67, 66, 67, 68, 69]
    }
  ],
  productionEntries: [
    {
      id: 'prd_1',
      lineId: 'line_dolum_a',
      shift: '1. Vardiya',
      operator: 'Hakan Yılmaz',
      target: 24000,
      actual: 19850,
      defect: 420,
      barcode: '8691234567001',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
    },
    {
      id: 'prd_2',
      lineId: 'line_pack_a',
      shift: '1. Vardiya',
      operator: 'Sena Kılıç',
      target: 22000,
      actual: 17610,
      defect: 180,
      barcode: '8691234567003',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ],
  kaizens: [
    {
      id: 'kz_1',
      title: 'Dolum nozulu değişim süresi standardizasyonu',
      description: 'SMED yaklaşımı ile takım değişimi standardı oluşturuldu.',
      department: 'Dolum Hattı B',
      status: 'uygulandı',
      gains: { time: 35, cost: 15000, quality: 4, safety: 2 },
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    {
      id: 'kz_2',
      title: 'Paketleme barkod doğrulama noktası',
      description: 'Koli kapanmadan önce barkod doğrulama eklenmesi önerildi.',
      department: 'Paketleme Hattı A',
      status: 'incelemede',
      gains: { time: 10, cost: 5000, quality: 8, safety: 1 },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  fiveS: [
    { id: '5s_1', department: 'Dolum Alanı', seiri: 88, seiton: 80, seiso: 83, seiketsu: 79, shitsuke: 76, note: 'Etiketleme yenileme gerekli.' },
    { id: '5s_2', department: 'Paketleme Alanı', seiri: 74, seiton: 70, seiso: 72, seiketsu: 68, shitsuke: 66, note: 'Yol çizgileri ve görsel yönetim zayıf.' },
    { id: '5s_3', department: 'Depo Besleme', seiri: 82, seiton: 78, seiso: 80, seiketsu: 77, shitsuke: 75, note: 'FIFO alanı işaretleri revize edilmeli.' }
  ],
  fmea: [
    {
      id: 'fm_1',
      process: 'Dolum',
      failureMode: 'Kapak tork düşüklüğü',
      effect: 'Sızıntı ve iade',
      cause: 'Tork başlığı aşınması',
      severity: 8,
      occurrence: 6,
      detection: 5,
      action: 'Aylık tork başlığı değişim planı',
      owner: 'Bakım Mühendisi',
      targetDate: '2026-05-03',
      status: 'açık'
    },
    {
      id: 'fm_2',
      process: 'Paketleme',
      failureMode: 'Barkod okunmaması',
      effect: 'Yanlış sevkiyat riski',
      cause: 'Okuyucu lens kirlenmesi',
      severity: 7,
      occurrence: 5,
      detection: 4,
      action: 'Haftalık lens temizliği checklisti',
      owner: 'Kalite Sorumlusu',
      targetDate: '2026-04-28',
      status: 'aksiyon alındı'
    }
  ]
};
