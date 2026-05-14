const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const mockData = {
  '/dashboard': {
    daily_total_production: 1280,
    total_scrap: 42,
    total_downtime_minutes: 65,
    top_downtime_reason: 'Planlı bakım',
  },
  '/oee': {
    availability: 0.94,
    performance: 0.89,
    quality: 0.97,
    oee: 0.811,
  },
  '/lines': [
    {
      id: 1,
      line_name: 'Hat-1',
      machine_name: 'Dolum Makinesi',
      status: 'RUNNING',
      instant_count: 560,
      target_count: 600,
    },
    {
      id: 2,
      line_name: 'Hat-2',
      machine_name: 'Etiketleme',
      status: 'IDLE',
      instant_count: 320,
      target_count: 500,
    },
  ],
  '/ai': {
    recommendations: [
      'Hat-2 için kısa setup kontrol listesi uygulayın.',
      'Vardiya başlangıcında 10 dakikalık otonom bakım yapın.',
      'Fire oranı artan ürünler için kalite kontrol sıklığını artırın.',
    ],
  },
};

function getMock(path) {
  return mockData[path] ?? { ok: true, source: 'mock' };
}

export async function getData(path) {
  const url = `${API_BASE}/api${path}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!contentType.includes('application/json')) {
      throw new Error(`Beklenen JSON yerine: ${contentType || 'bilinmiyor'}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[API fallback] ${path} mock data ile render ediliyor:`, error.message);
    return getMock(path);
  }
}
