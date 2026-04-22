import { fiveSScore, getLineMetrics, calculateRpn } from '../utils/oee.js';

const SUGGESTION = 'Gerçek OpenAI bağlantısı için Ayarlar > AI sağlayıcı alanına API katmanı ekleyin.';

export class AiService {
  constructor(getState) {
    this.getState = getState;
  }

  answer(question) {
    const q = question.toLocaleLowerCase('tr-TR');
    const state = this.getState();

    const lineScores = state.lines.map((line) => ({ line, m: getLineMetrics(line) }));
    const weak = [...lineScores].sort((a, b) => a.m.oeePct - b.m.oeePct)[0];

    if (q.includes('zayıf hat')) {
      return `En zayıf hat: ${weak.line.name}. OEE %${weak.m.oeePct}, verim %${weak.m.efficiencyPct}. Öncelik: duruş azaltma + hız dengesi.`;
    }

    if (q.includes('duruş')) {
      const reasonMap = new Map();
      state.lines.forEach((l) => (l.downtime.logs || []).forEach((d) => reasonMap.set(d.reason, (reasonMap.get(d.reason) || 0) + d.durationMin)));
      const [topReason, minutes] = [...reasonMap.entries()].sort((a, b) => b[1] - a[1])[0] || ['Veri yok', 0];
      return `En yüksek kayıp nedeni: ${topReason} (${minutes} dk). Kısa aksiyon: sebep bazlı Pareto ve vardiya sorumlusu atanması.`;
    }

    if (q.includes('kaizen')) {
      const targetLine = weak?.line?.name || 'belirsiz';
      return `Kaizen önceliği: ${targetLine}. OEE kaybı ve plansız duruş yoğun. Hızlı kazanım: setup standardizasyonu + kontrol noktası.`;
    }

    if (q.includes('fmea')) {
      const top = [...state.fmea].map((item) => ({ ...item, rpn: calculateRpn(item) })).sort((a, b) => b.rpn - a.rpn)[0];
      return top
        ? `Kritik FMEA riski: ${top.process} / ${top.failureMode}. RPN ${top.rpn}. Aksiyon: ${top.action}.`
        : 'FMEA kayıt verisi bulunamadı.';
    }

    if (q.includes('5s')) {
      const low = [...state.fiveS].map((item) => ({ ...item, score: fiveSScore(item) })).sort((a, b) => a.score - b.score)[0];
      return low
        ? `En düşük 5S bölümü: ${low.department} (${low.score}/100). Öncelik: görsel yönetim, standard iş talimatı ve denetim rutini.`
        : '5S verisi bulunamadı.';
    }

    if (q.includes('oee neden')) {
      return `OEE düşüşü genelde Availability kaynaklı. Plansız duruşlar ve kalite fireleri artınca OEE hızlı düşüyor. ${SUGGESTION}`;
    }

    return `Analiz tamamlandı. Soru daha spesifik olursa kök neden, etki ve aksiyon üçlüsü ile yanıt üretebilirim. ${SUGGESTION}`;
  }
}
