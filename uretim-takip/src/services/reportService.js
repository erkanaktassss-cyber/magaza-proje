import { csvFromRows } from '../utils/format.js';
import { calculateRpn, fiveSScore, getLineMetrics } from '../utils/oee.js';

function downloadBlob(content, type, name) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export const ReportService = {
  print() {
    window.print();
  },
  exportCsv(state) {
    const rows = state.lines.map((line) => {
      const m = getLineMetrics(line);
      return [line.name, line.type, line.dailyTarget, line.actual, line.defect, `${m.oeePct}%`, line.downtime.totalMin];
    });
    const csv = csvFromRows(['Hat', 'Tip', 'Hedef', 'Gerçekleşen', 'Fire', 'OEE', 'Duruş dk'], rows);
    downloadBlob(csv, 'text/csv;charset=utf-8', 'uretim-ozet-raporu.csv');
  },
  exportExcel(state) {
    const rows = state.fmea
      .map((item) => ({ ...item, rpn: calculateRpn(item) }))
      .sort((a, b) => b.rpn - a.rpn)
      .map((item) => `<tr><td>${item.process}</td><td>${item.failureMode}</td><td>${item.rpn}</td><td>${item.owner}</td><td>${item.status}</td></tr>`)
      .join('');

    const html = `\n<table>\n<tr><th>Proses</th><th>Hata Türü</th><th>RPN</th><th>Sorumlu</th><th>Durum</th></tr>\n${rows}\n</table>`;
    downloadBlob(html, 'application/vnd.ms-excel', 'fmea-risk-raporu.xls');
  },
  buildSummary(state) {
    const totalTarget = state.lines.reduce((sum, x) => sum + x.dailyTarget, 0);
    const totalActual = state.lines.reduce((sum, x) => sum + x.actual, 0);
    const totalDown = state.lines.reduce((sum, x) => sum + x.downtime.totalMin, 0);
    const avgOee = Math.round(state.lines.reduce((sum, x) => sum + getLineMetrics(x).oeePct, 0) / Math.max(state.lines.length, 1));

    const topFmea = state.fmea.map((f) => ({ ...f, rpn: calculateRpn(f) })).sort((a, b) => b.rpn - a.rpn)[0];
    const low5s = state.fiveS.map((s) => ({ ...s, score: fiveSScore(s) })).sort((a, b) => a.score - b.score)[0];

    return `GÜNLÜK ÜRETİM RAPORU\n\nToplam Hedef: ${totalTarget}\nToplam Gerçekleşen: ${totalActual}\nOrtalama OEE: %${avgOee}\nToplam Duruş: ${totalDown} dk\n\nKritik FMEA: ${topFmea ? `${topFmea.process} / ${topFmea.failureMode} (RPN ${topFmea.rpn})` : 'Yok'}\nEn Düşük 5S: ${low5s ? `${low5s.department} (${low5s.score}/100)` : 'Yok'}\n\nBu rapor sistem tarafından otomatik üretilmiştir.`;
  }
};
