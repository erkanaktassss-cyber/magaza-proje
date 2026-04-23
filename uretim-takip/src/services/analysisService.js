import { oeeForLine } from '../utils/calculations';
export const runAnalysis = (state) => {
  const lineOee = state.lines.map((l) => ({ ...l, ...oeeForLine(l) }));
  const weakLine = [...lineOee].sort((a, b) => a.oee - b.oee)[0];
  const worstDowntime = [...state.lines].sort((a, b) => b.downtimeTotal - a.downtimeTotal)[0];
  const criticalFmea = [...state.fmea].map((f) => ({ ...f, rpn: f.severity * f.occurrence * f.detection })).sort((a, b) => b.rpn - a.rpn)[0];
  const fiveS = state.fiveS.at(-1);
  const fiveSLow = fiveS ? Object.entries(fiveS).filter(([k]) => ['seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke'].includes(k)).sort((a, b) => a[1] - b[1])[0] : null;
  const kaizenNeed = weakLine?.type === 'Dolum' ? 'dolum süreç standardizasyonu' : 'paketleme setup kayıp azaltımı';
  return [
    `En zayıf hat: ${weakLine?.name ?? '-'} | OEE: %${weakLine?.oee.toFixed(1) ?? '0'}`,
    `En yüksek duruş kaybı: ${worstDowntime?.name ?? '-'} | ${worstDowntime?.downtimeTotal ?? 0} dk`,
    `En kritik FMEA riski: ${criticalFmea?.process ?? '-'} / RPN ${criticalFmea?.rpn ?? 0}`,
    `Kaizen önceliği: ${kaizenNeed}`,
    `En düşük 5S alanı: ${fiveSLow ? `${fiveSLow[0]} (${fiveSLow[1]})` : '-'}`
  ];
};
