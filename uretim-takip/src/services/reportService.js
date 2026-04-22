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

function topDowntimeReason(state) {
  const reasonTotals = new Map();
  state.lines.forEach((line) => {
    (line.downtime.logs || []).forEach((log) => {
      reasonTotals.set(log.reason, (reasonTotals.get(log.reason) || 0) + log.durationMin);
    });
  });
  return [...reasonTotals.entries()].sort((a, b) => b[1] - a[1])[0] || ['Yok', 0];
}

function baseSummary(state) {
  const totalTarget = state.lines.reduce((sum, x) => sum + x.dailyTarget, 0);
  const totalActual = state.lines.reduce((sum, x) => sum + x.actual, 0);
  const totalDown = state.lines.reduce((sum, x) => sum + x.downtime.totalMin, 0);
  const avgOee = Math.round(state.lines.reduce((sum, x) => sum + getLineMetrics(x).oeePct, 0) / Math.max(state.lines.length, 1));
  return { totalTarget, totalActual, totalDown, avgOee };
}

function reportByType(state, type) {
  const { totalTarget, totalActual, totalDown, avgOee } = baseSummary(state);
  const shifts = state.lines.reduce((acc, line) => {
    acc[line.shift] = (acc[line.shift] || 0) + line.actual;
    return acc;
  }, {});

  const reports = {
    daily: `GÜNLÜK RAPOR\n\nToplam Hedef: ${totalTarget}\nToplam Gerçekleşen: ${totalActual}\nOrtalama OEE: %${avgOee}\nToplam Duruş: ${totalDown} dk`,
    weekly: `HAFTALIK RAPOR\n\n7 günlük OEE ortalaması: %${avgOee}\nHaftalık üretim toplamı: ${totalActual}\nHaftalık kayıp süre: ${totalDown} dk`,
    shift: `VARDİYA RAPORU\n\n${Object.entries(shifts)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')}`,
    oee: `OEE RAPORU\n\n${state.lines.map((line) => `${line.name}: %${getLineMetrics(line).oeePct}`).join('\n')}`,
    downtime: `DURUŞ RAPORU\n\n${state.lines.map((line) => `${line.name}: ${line.downtime.totalMin} dk`).join('\n')}\n\nEn kritik sebep: ${topDowntimeReason(state)[0]} (${topDowntimeReason(state)[1]} dk)`,
    kaizen: `KAIZEN RAPORU\n\nToplam öneri: ${state.kaizens.length}\nDurum dağılımı:\n${['yeni', 'incelemede', 'kabul edildi', 'reddedildi', 'uygulandı']
      .map((status) => `- ${status}: ${state.kaizens.filter((k) => k.status === status).length}`)
      .join('\n')}`,
    fmea: `FMEA RAPORU\n\n${state.fmea
      .map((item) => ({ ...item, rpn: calculateRpn(item) }))
      .sort((a, b) => b.rpn - a.rpn)
      .slice(0, 5)
      .map((item) => `${item.process} / ${item.failureMode} - RPN ${item.rpn}`)
      .join('\n')}`,
    '5s': `5S RAPORU\n\n${state.fiveS.map((item) => `${item.department}: ${fiveSScore(item)}/100`).join('\n')}`
  };

  return `${reports[type] || reports.daily}\n\nRapor tarihi: ${new Date().toLocaleString('tr-TR')}`;
}

export const ReportService = {
  print() {
    window.print();
  },
  exportCsv(state, type = 'daily') {
    const rows = state.lines.map((line) => {
      const m = getLineMetrics(line);
      return [line.name, line.type, line.dailyTarget, line.actual, line.defect, `${m.oeePct}%`, line.downtime.totalMin, line.shift];
    });
    const csv = csvFromRows(['Hat', 'Tip', 'Hedef', 'Gerçekleşen', 'Fire', 'OEE', 'Duruş dk', 'Vardiya'], rows);
    downloadBlob(csv, 'text/csv;charset=utf-8', `${type}-raporu.csv`);
  },
  exportExcel(state, type = 'fmea') {
    const rows = state.fmea
      .map((item) => ({ ...item, rpn: calculateRpn(item) }))
      .sort((a, b) => b.rpn - a.rpn)
      .map((item) => `<tr><td>${item.process}</td><td>${item.failureMode}</td><td>${item.rpn}</td><td>${item.owner}</td><td>${item.status}</td></tr>`)
      .join('');

    const html = `\n<table>\n<tr><th>Proses</th><th>Hata Türü</th><th>RPN</th><th>Sorumlu</th><th>Durum</th></tr>\n${rows}\n</table>`;
    downloadBlob(html, 'application/vnd.ms-excel', `${type}-raporu.xls`);
  },
  buildSummary(state) {
    return reportByType(state, 'daily');
  },
  buildReport(state, type) {
    return reportByType(state, type);
  }
};
