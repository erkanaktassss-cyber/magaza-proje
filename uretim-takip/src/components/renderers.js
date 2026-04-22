import { toTrDate } from '../utils/format.js';
import { calculateRpn, fiveSScore, getLineMetrics, safePercent } from '../utils/oee.js';

const el = (id) => document.getElementById(id);
const lineTypeLabel = (type) => ({ dolum: 'Dolum', paketleme: 'Paketleme', diger: 'Diğer' }[type] || 'Diğer');

export function renderHeader(state) {
  el('plantName').textContent = state.meta.plantName;
  el('lastUpdated').textContent = `Son güncelleme: ${toTrDate(state.meta.lastUpdated)}`;
}

export function renderDashboard(state) {
  const cards = state.lines
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((line) => {
      const m = getLineMetrics(line);
      const lastReason = line.downtime.active?.reason || line.downtime.logs.at(-1)?.reason || '-';
      const statusText = line.status === 'running' ? 'Çalışıyor' : line.status === 'stopped' ? 'Duruşta' : 'Beklemede';
      return `<article class="line-card ${m.statusBand}">
        <div class="card-head"><h4>${line.name}</h4><span class="pill">${lineTypeLabel(line.type)}</span></div>
        <div class="kpi-grid">
          <span>Hedef<b>${line.dailyTarget}</b></span><span>Gerçekleşen<b>${line.actual}</b></span>
          <span>Verim<b>%${m.efficiencyPct}</b></span><span>Durum<b>${statusText}</b></span>
          <span>Duruş<b>${line.downtime.totalMin} dk</b></span><span>Son Sebep<b>${lastReason}</b></span>
          <span>OEE<b>%${m.oeePct}</b></span><span>Vardiya<b>${line.shift}</b></span>
          <span>Operatör<b>${line.operator || '-'}</b></span><span>Kalite<b>%${m.qualityPct}</b></span>
        </div>
      </article>`;
    })
    .join('');
  el('lineCards').innerHTML = cards;

  const totalTarget = state.lines.reduce((s, l) => s + l.dailyTarget, 0);
  const totalActual = state.lines.reduce((s, l) => s + l.actual, 0);
  const avgOee = Math.round(state.lines.reduce((s, l) => s + getLineMetrics(l).oeePct, 0) / Math.max(1, state.lines.length));
  const totalDown = state.lines.reduce((s, l) => s + l.downtime.totalMin, 0);
  const weakest = [...state.lines].sort((a, b) => safePercent(a.actual, a.dailyTarget) - safePercent(b.actual, b.dailyTarget))[0];
  const critical = state.fmea.filter((item) => calculateRpn(item) >= 200).length;

  el('summaryCards').innerHTML = [
    ['Toplam Hedef', totalTarget],
    ['Toplam Gerçekleşen', totalActual],
    ['Ortalama OEE', `%${avgOee}`],
    ['Toplam Duruş', `${totalDown} dk`],
    ['En Zayıf Hat', weakest?.name || '-'],
    ['Kritik Risk Sayısı', `${critical} adet`]
  ]
    .map(([t, v]) => `<div class="summary-item"><small>${t}</small><strong>${v}</strong></div>`)
    .join('');

  el('latestKaizens').innerHTML = state.kaizens
    .slice(-4)
    .reverse()
    .map((k) => `<li>${k.title} <span>${k.status}</span></li>`)
    .join('');

  el('criticalFmea').innerHTML = state.fmea
    .map((f) => ({ ...f, rpn: calculateRpn(f) }))
    .sort((a, b) => b.rpn - a.rpn)
    .slice(0, 4)
    .map((f) => `<li>${f.process} / ${f.failureMode} <span>RPN ${f.rpn}</span></li>`)
    .join('');

  el('low5s').innerHTML = state.fiveS
    .map((s) => ({ ...s, score: fiveSScore(s) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((s) => `<li>${s.department} <span>${s.score}/100</span></li>`)
    .join('');
}

export function renderLineManagement(state) {
  el('lineList').innerHTML = state.lines
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((line) => `<tr>
      <td>${line.order}</td><td>${line.name}</td><td>${lineTypeLabel(line.type)}</td><td>${line.group}</td>
      <td>
        <button data-action="up" data-id="${line.id}">↑</button>
        <button data-action="down" data-id="${line.id}">↓</button>
        <button data-action="edit" data-id="${line.id}">Düzenle</button>
        <button data-action="delete" data-id="${line.id}">Sil</button>
      </td>
    </tr>`)
    .join('');
}

export function fillLineSelects(state) {
  const options = state.lines
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((line) => `<option value="${line.id}">${line.name}</option>`)
    .join('');
  ['productionLine', 'stopLine', 'kaizenDept'].forEach((id) => {
    if (!el(id)) return;
    el(id).innerHTML = options;
  });
}

export function renderDowntime(state) {
  const all = state.lines.flatMap((line) => (line.downtime.logs || []).map((log) => ({ ...log, lineName: line.name })));
  el('downtimeTable').innerHTML = all
    .sort((a, b) => new Date(b.startAt) - new Date(a.startAt))
    .map((log) => `<tr><td>${log.lineName}</td><td>${log.type}</td><td>${log.reason}</td><td>${toTrDate(log.startAt)}</td><td>${toTrDate(log.endAt)}</td><td>${log.durationMin} dk</td></tr>`)
    .join('');

  const byLine = state.lines.map((line) => ({ name: line.name, down: line.downtime.totalMin })).sort((a, b) => b.down - a.down);
  el('downLineRanking').innerHTML = byLine.map((l) => `<li>${l.name}<span>${l.down} dk</span></li>`).join('');

  const reasonMap = new Map();
  all.forEach((a) => reasonMap.set(a.reason, (reasonMap.get(a.reason) || 0) + a.durationMin));
  const byReason = [...reasonMap.entries()].sort((a, b) => b[1] - a[1]);
  el('downReasonRanking').innerHTML = byReason.map(([r, m]) => `<li>${r}<span>${m} dk</span></li>`).join('');

  el('stopReason').innerHTML = state.downtimeReasons.map((r) => `<option>${r}</option>`).join('');
  el('reasonChips').innerHTML = state.downtimeReasons.map((r) => `<button class="chip" data-reason="${r}">${r} ✕</button>`).join('');
}

export function renderOee(state, viewMode = 'daily') {
  const historySize = viewMode === 'weekly' ? 7 : 1;
  el('oeeCards').innerHTML = state.lines
    .map((line) => {
      const m = getLineMetrics(line);
      return `<article class="metric-card ${m.statusBand}"><h4>${line.name}</h4><p>Availability: %${m.availabilityPct}</p><p>Performance: %${m.performancePct}</p><p>Quality: %${m.qualityPct}</p><strong>OEE: %${m.oeePct}</strong></article>`;
    })
    .join('');

  const periods = ['Günlük', 'Haftalık'];
  const avg = Math.round(state.lines.reduce((sum, l) => sum + getLineMetrics(l).oeePct, 0) / Math.max(1, state.lines.length));
  el('oeePeriod').innerHTML = periods.map((p, i) => `<li>${p}<span>%${Math.max(0, avg - i * 2)}</span></li>`).join('');

  el('oeeTrend').innerHTML = state.lines
    .map((line) => {
      const bars = (line.oeeHistory || []).slice(-historySize).map((v) => `<i style="height:${v}%"></i>`).join('');
      return `<div class="trend-row"><span>${line.name}</span><div class="spark">${bars}</div></div>`;
    })
    .join('');
}

export function renderKaizen(state, statusFilter = 'all') {
  const rows = statusFilter === 'all' ? state.kaizens : state.kaizens.filter((k) => k.status === statusFilter);
  el('kaizenRows').innerHTML = rows
    .slice()
    .reverse()
    .map((k) => `<tr><td>${k.title}</td><td>${k.department}</td><td>${k.status}</td><td>${k.gains.time} dk</td><td>${k.gains.cost} ₺</td><td>${k.gains.quality}%</td><td>${k.gains.safety}</td></tr>`)
    .join('');
}

export function renderFiveS(state) {
  const scored = state.fiveS.map((s) => ({ ...s, score: fiveSScore(s) }));
  el('fiveSRows').innerHTML = scored
    .map((s) => `<tr><td>${s.department}</td><td>${s.seiri}</td><td>${s.seiton}</td><td>${s.seiso}</td><td>${s.seiketsu}</td><td>${s.shitsuke}</td><td>${s.score}</td><td>${s.note || '-'}</td></tr>`)
    .join('');

  const summary = scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((item) => `<div class="score-bar"><span>${item.department}</span><div class="bar"><i style="width:${item.score}%"></i></div><strong>${item.score}</strong></div>`)
    .join('');
  el('fiveSSummary').innerHTML = summary;
}

export function renderFmea(state) {
  el('fmeaRows').innerHTML = state.fmea
    .map((f) => ({ ...f, rpn: calculateRpn(f) }))
    .sort((a, b) => b.rpn - a.rpn)
    .map((f) => `<tr class="${f.rpn >= 200 ? 'critical' : ''}"><td>${f.process}</td><td>${f.failureMode}</td><td>${f.effect}</td><td>${f.cause}</td><td>${f.severity}</td><td>${f.occurrence}</td><td>${f.detection}</td><td>${f.rpn}</td><td>${f.action}</td><td>${f.owner}</td><td>${f.targetDate}</td><td>${f.status}</td></tr>`)
    .join('');
}

export function renderSettings(state) {
  el('dataSource').value = state.settings.dataSource;
  el('deltaIp').value = state.settings.delta.ip;
  el('deltaPort').value = state.settings.delta.port;
  el('deltaProtocol').value = state.settings.delta.protocol;
  el('deltaCounter').value = state.settings.delta.counterAddress;
  el('deltaRun').value = state.settings.delta.runAddress;
  el('deltaAlarm').value = state.settings.delta.alarmAddress;
  el('barcodePrefix').value = state.settings.barcodePrefix;
  el('aiProvider').value = state.settings.ai.provider;
  el('aiModel').value = state.settings.ai.model;
}

export function renderReport(summary) {
  el('reportPreview').textContent = summary;
}
